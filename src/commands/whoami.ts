import { InfoResponse } from './../types'
import { GluegunCommand } from 'gluegun'
import { id } from '../auth/variables.json'
import { warning, success, info } from 'log-symbols'
import api from '../client/api'
import { formatedDate, isEmpty } from '../utils/utils'

const command: GluegunCommand = {
  name: 'whoami',
  alias: 'w',
  description: 'displays the information of the logged in user',
  run: async toolbox => {
    const { print } = toolbox

    const spinner = toolbox.print.spin('Checking user...')

    if (!id) {
      spinner.stop()
      print.newline()
      return print.error(
        `${warning} You need to be logged in, try the command: masterdata login`
      )
    }

    spinner.start('fetching the data, wait...')

    api.get<InfoResponse>(`/v1/user?id=${id}`, {
        id
      })
      .then(({ data }) => {
        if (data.error) {
          spinner.stop()
          print.newline()

          if (data.error === 'Token inválido') {
            return print.warning(
              `${warning} Authentication error, please use the masterdata login command`
            )
          }

          return print.warning(
            `${warning} Unable to access memento resource, check if you are logged in`
          )
        }

        spinner.succeed()
        print.newline()
        print.divider()
        print.newline()
        print.success(
          `${success} You are logged in with email: ${print.colors.bold.blue(
            data.email
          )}`
        )
        print.success(
          `${info} account created on: ${print.colors.bold.magenta(
            formatedDate(data.createdAt)
          )}`
        )

        if (!isEmpty(data.account)) {
          print.success(
            `${info} You are using the account: ${print.colors.bold.magenta(
              data.account.name.toUpperCase()
            )}`
          )
          print.newline()
        }

        if (data.accounts.length) {
          print.success(`${info} registered accounts: `)
          print.newline()
          console.table(
            data.accounts.map(account => ({
              name: account.name,
              appKey: account.appKey
            }))
          )
          print.divider()
        } else {
          console.info(`${warning} You don't have any registered accounts yet`)
        }
      })
      .catch(error => {
        print.error(
          `An error occurred while trying to login, please try again.: ${error.message}`
        )
      })
      .finally(() => {
        spinner.stop()
      })
  }
}

module.exports = command
