import { IChoices, ISelectAccount } from './../types'
import { info, success, error, warning } from 'log-symbols'
import { GluegunCommand } from 'gluegun'
import { id } from '../auth/variables.json'
import { InfoResponse } from '../types'
import api from '../client/api'

const command: GluegunCommand = {
  name: 'delete',
  description: 'Create a new account: masterdata create [teste]',
  run: async toolbox => {
    const {
      print,
      prompt,
      parameters: { array }
    } = toolbox

    const spinner = toolbox.print.spin(`${info} Checking user...`)

    try {
      if (!id) {
        spinner.stop()
        print.newline()
        return print.error(
          `${warning} You need to be logged in, try the command: masterdata login`
        )
      }

      spinner.succeed('user found')
      spinner.start('Searching accounts')

      const {
        data: { accounts, account }
      } = await api.get<InfoResponse>(`/v1/user?id=${id}`, { id })

      if (array.length) {
        const selectedAccount = accounts.find(({ name }) => name === array[0])

        if (selectedAccount) {
          spinner.stop()

          const confirm = await prompt.confirm(
            `${warning} Are you sure you want to delete the account: ${print.colors.bold.yellow(
              selectedAccount.name
            )}!`,
            false
          )

          if (!confirm) {
            spinner.stop()
            print.newline()
            return print.success(`${success} Bye`)
          }

          spinner.start(`Removing account ${selectedAccount.name}`)

          if (account.name === selectedAccount.name) {
            await api.post('/v1/exit/account', {
              id
            })
          }

          return api
            .delete<IDeleteResponse>(
              '/v1/user/account',
              {},
              {
                data: {
                  id: selectedAccount.userId,
                  accountId: selectedAccount._id
                }
              }
            )
            .then(async res => {
              if (res.data.error) {
                spinner.stop()
                print.divider()
                return print.warning(`${warning}: ${res.data.message}`)
              }

              spinner.stop()
              print.divider()

              return print.success(
                `Account ${selectedAccount.name} removed successfully!`
              )
            })
            .catch(err => {
              return print.error(
                `${error} We were unable to execute the switch command at this time, please try again: ${err.message}`
              )
            })
        }

        spinner.stop()
        return print.warning(`${warning}: account ${array[0]} not found!`)
      } else {
        spinner.start(`${info} Searching for registered accounts, wait`)

        if (!accounts.length) {
          spinner.stop()
          print.newline()
          print.divider()
          return print.info(
            `${info} You need to have at least one account registered to use this command`
          )
        }

        if (accounts.length === 1) {
          spinner.stop()
          print.warning(`${warning} You only have one registered account !!`)
          print.warning(`${warning} account: ${accounts[0].name}`)
          const confirm = await prompt.confirm(
            `${warning} Are you sure you want to delete the account: ${print.colors.bold.yellow(
              accounts[0].name
            )}!`,
            false
          )

          if (!confirm) {
            spinner.stop()
            print.newline()
            return print.success(`${success} Bye`)
          }

          spinner.start(`Removing account ${accounts[0].name}`)

          return api
            .delete(
              '/v1/user/account',
              {},
              {
                data: {
                  id: accounts[0].userId,
                  accountId: accounts[0]._id
                }
              }
            )
            .then(async res => {
              await api.post('/v1/exit/account', {
                id
              })

              spinner.stop()
              print.divider()

              return print.success(
                `Account ${accounts[0].name} removed successfully!`
              )
            })
            .catch(err => {
              return print.error(
                `${error} We were unable to execute the switch command at this time, please try again: ${err.message}`
              )
            })
        }

        const choices: IChoices[] = accounts.map(({ name, _id }) => ({
          name,
          disabled: name === account.name,
          message: name,
          value: _id,
          hint: name === account.name ? `in use ${success}` : ''
        }))

        spinner.stop()
        print.divider()

        return prompt
          .ask<ISelectAccount>([
            {
              type: 'select',
              separator: true,
              name: 'account',
              message: 'Select one of the accounts',
              choices
            }
          ])
          .then(async ({ account: nameAccount }) => {
            const account = accounts.find(({ name }) => name === nameAccount)

            spinner.start(`Removing account ${nameAccount}`)

            if (account.name === nameAccount) {
              await api.post('/v1/exit/account', {
                id
              })
            }

            return api
              .delete<IDeleteResponse>(
                '/v1/user/account',
                {},
                {
                  data: {
                    id: account.userId,
                    accountId: account._id
                  }
                }
              )
              .then(async res => {
                if (res.data.error) {
                  spinner.stop()
                  print.divider()
                  return print.warning(`${warning}: ${res.data.message}`)
                }

                spinner.stop()
                print.divider()

                return print.success(
                  `Account ${nameAccount} removed successfully!`
                )
              })
              .catch(err => {
                return print.error(
                  `${error} We were unable to execute the switch command at this time, please try again: ${err.message}`
                )
              })
          })
          .catch(err => {
            spinner.stop()
            print.newline()
            return print.error(
              `${error} We were unable to execute the switch command at this time, please try again: ${err.message}`
            )
          })
          .finally(() => {
            spinner.stop()
          })
      }
    } catch (err) {
      return print.error(
        `${error} We were unable to execute the switch command at this time, please try again: ${err.message}`
      )
    }
  }
}

interface IDeleteResponse {
  error: boolean
  message: string
}

module.exports = command
