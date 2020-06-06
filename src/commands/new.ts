import { GluegunCommand } from 'gluegun'
import * as figlet from "figlet";
import { info, success, warning } from "log-symbols";

const command: GluegunCommand = {
    name: 'new',
    alias: "n",
    description: "Adds a new user: masterdata new [email]",
    run: async toolbox => {
        const { print } = toolbox

        figlet('Masterdata CLI', function (err, data) {
            if (err) {
                print.error('Something went wrong...');
                return;
            }
            print.success(`${data}`)
        });
        
        print.newline()
        print.divider()
        print.info(`${success} Welcome to your CLI`);
        print.info(`${info} Created by: Erislandio Soares`);
        print.warning(`${warning} We are doing development, you can contribute at: https: git ${warning}`);
        print.divider()
    }
}

module.exports = command
