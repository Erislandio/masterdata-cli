import { IChoices, ISelectAccount } from './../types';
import { info, success, error } from 'log-symbols';
import { GluegunCommand } from 'gluegun'
import { id } from '../auth/variables.json'
import { warning } from 'log-symbols'
import { InfoResponse } from '../types';
import api from '../client/api'

const command: GluegunCommand = {
    name: 'delete',
    description: "Create a new account: masterdata create [teste]",
    run: async toolbox => {
        const { print, prompt } = toolbox;

        const spinner = toolbox.print.spin(`${info} Checking user...`);

        try {
            if (!id) {
                spinner.stop()
                print.newline();
                return print.error(`${warning} You need to be logged in, try the command: masterdata login`);
            }

            spinner.succeed('user found');
            spinner.start('Searching accounts');

            const { data: { accounts, account } } = await api.get<InfoResponse>(`/v1/user?id=${id}`, { id });

            spinner.start(`${info} Searching for registered accounts, wait`);

            if (!accounts.length) {
                spinner.stop();
                print.newline();
                print.divider();
                return print.info(`${info} You need to have at least one account registered to use this command`);
            }

            if (accounts.length === 1) {
                spinner.stop();
                print.warning(`${warning} You only have one registered account !!`);
                print.warning(`${warning} account: ${accounts[0].name}`);
                const confirm = await prompt.confirm(`${warning} Are you sure you want to delete the account: ${accounts[0].name}!`, false);

                if (!confirm) {
                    spinner.stop();
                    print.newline();
                    return print.success(`${success} Bye`)
                }

                spinner.start(`Removing account `)

                return api.delete('/v1/user/account', {
                    id,
                    accountId: accounts[0]._id
                }).then(async (res) => {

                    await api.post('/v1/exit/account', {
                        id
                    })

                    spinner.stop();
                    print.divider();

                    return print.success(`Account ${accounts[0].name} removed successfully!`)

                }).catch(err => {
                    return print.error(`${error} We were unable to execute the switch command at this time, please try again: ${err.message}`);
                })

            }

            const choices: IChoices[] = accounts.map(({ name }) => ({
                name,
                disabled: name === account.name,
                message: name,
                value: name,
                hint: name === account.name ? `in use ${success}` : ''
            }));

            console.log(choices)

            spinner.stop();
            print.divider();

            return prompt.ask<ISelectAccount>([{
                type: "select",
                separator: true,
                name: "account",
                message: "Select one of the accounts",
                choices
            }]).then(async ({ account }) => {

                spinner.start(`${info} Switching to account ${account}`);
                spinner.stop();
                print.newline();
                print.divider()
                print.success(`${success} Now you are using the ${print.colors.bold.magenta(account.toUpperCase())} account`);
                print.newline();
                return

            }).catch((err) => {
                spinner.stop();
                print.newline();
                return print.error(`${error} We were unable to execute the switch command at this time, please try again: ${err.message}`);
            }).finally(() => {
                spinner.stop();
            })

        } catch (err) {
            return print.error(`${error} We were unable to execute the switch command at this time, please try again: ${err.message}`);
        }
    }
}

module.exports = command
