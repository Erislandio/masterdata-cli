import { IChoices, ISelectAccount } from './../types'
import { GluegunCommand, print } from 'gluegun'
import { warning, info, error, success } from 'log-symbols'
import { id } from '../auth/variables.json'
import { InfoResponse } from '../types'
import api from '../client/api'

async function switchAccount(account: string): Promise<InfoResponse> {
  return api
    .post<InfoResponse | any>('/v1/set/account', {
      name: account,
      id
    })
    .then(({ data }) => {
      return data
    })
    .catch(err => {
      return print.error(
        `${error} We were unable to execute the switch command at this time, please try again: ${err.message}`
      )
    })
}

const command: GluegunCommand = {
  name: 'switch',
  alias: 's',
  description: 'Switch account: masterdata switch [teste]',
  run: async toolbox => {
    const {
      print,
      prompt,
      parameters: { array }
    } = toolbox
    const spinner = toolbox.print.spin(`${info} Checking user...`)

    if (!id) {
      spinner.stop()
      print.newline()
      return print.error(
        `${warning} You need to be logged in, try the command: masterdata login`
      )
    }

    if (array.length) {
      spinner.start(
        `${info} Switching to account ${array[0].toString().trim()}`
      )

      const data = await switchAccount(array[0].toString().trim())

      if (data.error) {
        print.newline()
        spinner.stop()
        return print.warning(`${warning} ${data.message}`)
      }

      spinner.stop()
      print.newline()
      print.divider()
      print.success(
        `Now you are using the ${print.colors.bold.magenta(
          array[0].toString().toUpperCase()
        )} account`
      )
      print.newline()
      return
    }

    try {
      spinner.start(`${info} Searching for registered accounts, wait`)

      const {
        data: { accounts, account }
      } = await api.get<InfoResponse>(`/v1/user?id=${id}`, { id })

      if (!accounts.length) {
        spinner.stop()
        print.newline()
        return print.warning(
          `${warning} You do not have an account yet, try the command: masterdata create [account]`
        )
      }

      const choices: IChoices[] = accounts.map(({ name }) => ({
        name,
        disabled: name === account.name,
        message: name,
        value: name,
        hint: name === account.name ? `in use ${success}` : ''
      }))

      spinner.stop()
      print.newline()
      print.divider()

      prompt
        .ask<ISelectAccount>([
          {
            type: 'select',
            separator: true,
            name: 'account',
            message: 'Select one of the accounts',
            choices
          }
        ])
        .then(async ({ account }) => {
          spinner.start(`${info} Switching to account ${account}`)

          const data = await switchAccount(account)

          if (data.error) {
            print.newline()
            spinner.stop()
            return print.warning(`${warning} ${data.message}`)
          }

          spinner.stop()
          print.newline()
          print.divider()
          print.success(
            `${success} Now you are using the ${print.colors.bold.magenta(
              account.toUpperCase()
            )} account`
          )
          print.newline()
          return
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
    } catch (err) {
      spinner.stop()
      print.newline()
      return print.error(
        `${error} We were unable to execute the switch command at this time, please try again: ${err.message}`
      )
    }
  }
}

module.exports = command
