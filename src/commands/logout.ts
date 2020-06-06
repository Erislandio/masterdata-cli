import { GluegunCommand } from 'gluegun'
import { warning, error } from "log-symbols";
import { id } from '../auth/variables.json'

const command: GluegunCommand = {
    name: 'logout',
    description: "Disconnect from the application",
    run: async toolbox => {
        const { print, prompt } = toolbox;

        const spinner = toolbox.print.spin('Wait...');


        if (!id) {
            spinner.stop();
            print.newline();
            return print.warning(`${warning} You need to be logged in to access this resource`)
        }

        spinner.stop();

        prompt.confirm('Are you sure you want to leave?', true).then((res) => {

            if (res) {

                spinner.start('going out');

                return toolbox.patching.update(__dirname + '/../auth/variables.json', config => {
                    config.token = null;
                    config.id = null
                    return config
                }).then(() => {

                    print.newline();
                    print.divider();
                    return spinner.succeed('Bye')

                }).catch(() => {
                    print.newline();
                    print.error(`${error} The resource could not be accessed at this time`);
                });

            }

            return print.newline();

        }).catch(() => {
            print.newline();
            print.error(`${error} The resource could not be accessed at this time`)
        })

    }
}

module.exports = command
