import { TAccountUser, InfoResponse } from './../types'
import { GluegunCommand } from 'gluegun'
import { id } from '../auth/variables.json'
import { warning, error, success, info } from 'log-symbols'
import api from '../client/api'

interface ICreateReturn {
  name: string
  app: string
  token: string
}

interface IAsksTypes {
  name: string
  message: string
  type: string
  required: boolean
}

interface ICreateAccountResponse {
  accounts: TAccountUser[]
  _id: string
  email: string
  account: TAccountUser
  error: string
}

const options = (account?: string): IAsksTypes[] => {
  const asks = [
    {
      name: 'name',
      message: 'Account name: ',
      type: 'text',
      required: true
    },
    {
      name: 'app',
      message: 'APP Key',
      type: 'text',
      required: true
    },
    {
      name: 'token',
      message: 'APP Token',
      type: 'text',
      required: true
    }
  ]

  if (account) {
    return asks
      .map<IAsksTypes>((ask, index) => {
        if (index > 0) {
          return {
            ...ask,
            message: `${ask.message} for account: ${account}`
          }
        }
      })
      .filter(Boolean)
  }

  return asks
}

const command: GluegunCommand = {
  name: 'create',
  description: 'Create a new account: masterdata create [teste]',
  run: async toolbox => {
    const {
      print,
      prompt,
      parameters: { array }
    } = toolbox

    if (!id) {
      print.newline()
      return print.error(
        `${warning} You need to be logged in, try the command: masterdata login`
      )
    }

    const asks = array.length ? options(array[0]) : options()

    prompt
      .ask<ICreateReturn>(asks)
      .then(async ({ name, app, token }) => {
        const account = {
          name: array.length ? array[0] : name,
          appKey: app,
          appToken: token,
          userId: id
        }

        const spinner = toolbox.print.spin(`${info} Checking user...`)

        const {
          data: { accounts }
        } = await api.get<InfoResponse>(`/v1/user?id=${id}`, { id })

        const exists = accounts.filter(({ name }) => name === account.name)

        if (exists.length) {
          spinner.stop()
          print.newline()
          return print.warning(
            `${warning} ${account.name} account has already been created!`
          )
        }

        spinner.start(`${success} Creating ${account.name} account, wait...`)

        api
          .post<ICreateAccountResponse>('/v1/add', {
            account,
            id
          })
          .then(({ data }) => {
            spinner.stop()
            if (data.error) {
              if (data.error === 'Token inválido') {
                print.newline()
                return print.warning(
                  `${warning}: You need to be logged in before creating a new account, try the command: masterdata login [user]`
                )
              }

              print.newline()
              return print.error(
                `${error} We were unable to execute the create command at this time, please try again.`
              )
            } else {
              print.newline()
              print.divider()
              print.success(
                `${print.colors.bold.blue(
                  account.name
                )} account was created successfully!`
              )
              print.divider()
            }
          })
          .catch(() => {
            print.newline()
            return print.error(
              `${error} We were unable to execute the create command at this time, please try again.`
            )
          })
      })
      .catch(() => {
        print.newline()
        return print.error(
          `${error} We were unable to execute the create command at this time, please try again.`
        )
      })
  }
}

module.exports = command
