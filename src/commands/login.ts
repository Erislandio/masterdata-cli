import { ILoginResponse } from './../types';
import { GluegunCommand, print } from 'gluegun'
import api from '../client/api'
import { error, success } from 'log-symbols'
import { isEmail } from '../utils/utils'
import { Toolbox } from 'gluegun/build/types/domain/toolbox';

const options = (email?: string) => {
    let messagePassword = email ? `Password for email: ${print.colors.bold.green(email)}` : 'Password: '
    return [
        {
            message: "Email: ",
            type: "input",
            required: true,
            name: "email"
        },
        {
            message: messagePassword,
            type: "password",
            required: true,
            name: "password"
        }
    ]
}

interface IAsksReturn {
    email: string | undefined;
    password: string;
}

const command: GluegunCommand = {
    name: 'login',
    alias: 'l',
    dashed: true,
    description: "Sign in to an account, example: masterdata login teste@gmail.com or masterdata login",
    run: async toolbox => {

        const { print, prompt, parameters: { array } } = toolbox

        if (array.length) {
            if (!isEmail(array[0])) {
                return print.error(`${array[0]}: It is not a valid email`)
            }
        }

        const asks = array.length ? options(array[0])[1] : options('');

        prompt.ask<IAsksReturn>(asks).then(async (res) => {

            if (res.email) {
                if (!isEmail(res?.email?.trim())) {
                    return print.error(`${res.email}: It is not a valid email`)
                }
            }

            const email = array.length ? array[0].trim() : res?.email?.trim();
            return loginMethod(toolbox, email, res.password)

        }).catch((error: any) => {
            print.error(`An error occurred while trying to login, please try again: ${error.message}`)
        })

    }
}


export async function loginMethod(toolbox: Toolbox, email: string, password: string): Promise<any> {

    const spinner = toolbox.print.spin('Wait...');

    return api.post<ILoginResponse>('/v1/login', {
        email: email.trim(),
        password: password.trim()
    }).then(async ({ data }) => {

        if (data.error) {
            print.newline()
            return print.error(`${error} - ${data.message}`)
        }

        if (data.token) {

            await toolbox.patching.update(__dirname + '/../auth/variables.json', config => {
                config.token = data.token;
                config.id = data.user._id
                return config
            })

            print.newline()
            return print.success(`${success} Welcome you are logged in to the account: ${data.user.email}`)

        }

    }).catch((error) => {
        spinner.warn('End request...');
        return print.error(`An error occurred while trying to login, please try again: ${error.message}`)

    }).finally(() => {
        spinner.stop();
    })

}

module.exports = command
