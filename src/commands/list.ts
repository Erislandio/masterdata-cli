import { GluegunCommand } from 'gluegun'
import { info, warning } from "log-symbols";
import { id } from '../auth/variables.json'
import api from '../client/api'
import { InfoResponse } from '../types';

const command: GluegunCommand = {
    name: 'list',
    alias: 'ls',
    description: "List all registered accounts: masterdata ls",
    run: async toolbox => {

        const { print } = toolbox
        const spinner = toolbox.print.spin('Checking user...');

        if (!id) {
            spinner.stop();
            print.newline();
            return print.error(`${warning} You need to be logged in, try the command: masterdata login`)
        }

        spinner.start('fetching the data, wait...');

        api.get<InfoResponse>(`/v1/user?id=${id}`, {
            id
        }).then(({ data }) => {
            spinner.succeed();

            if (data.accounts.length) {
                print.success(`${info} registered accounts: `);
                print.newline();
                console.table(data.accounts.map((account) => ({
                    name: account.name,
                    id: account._id,
                    appKey: account.appKey,
                })));
            } else {
                spinner.stop();
                console.info(`${warning} You don't have any registered accounts yet`)
            }

            spinner.stop();

        }).catch((error) => {

            print.error(`An error occurred while trying to login, please try again.: ${error.message}`)

        }).finally(() => {
            spinner.stop();
        })


    }
}

module.exports = command
