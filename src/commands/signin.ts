import { GluegunCommand, print } from 'gluegun'
import { isEmail } from '../utils/utils'
import api from '../client/api'
import { warning, error, success } from 'log-symbols'
import { ILoginResponse } from '../types'

interface IAsksReturn {
  email: string | undefined
  password: string
}

const options = (email?: string): any[] => {
  let messagePassword = email
    ? `Password for email: ${print.colors.bold.green(email)}`
    : 'Password: '
  return [
    {
      message: 'Email: ',
      type: 'input',
      required: true,
      name: 'email'
    },
    {
      message: messagePassword,
      type: 'password',
      required: true,
      name: 'password'
    }
  ]
}

interface IApiResponse {
  error: boolean
  message: string
  isVerified: boolean
  _id: string
  email: string
  password: string
}

const command: GluegunCommand = {
  name: 'signin',
  alias: 'n',
  description: 'Adds a new user: masterdata new [email]',
  run: async toolbox => {
    const {
      print,
      prompt,
      parameters: { array }
    } = toolbox

    if (array.length) {
      if (!isEmail(array[0])) {
        return print.error(`${array[0]}: It is not a valid email`)
      }
    }

    const asks = array.length ? options(array[0])[1] : options('')

    prompt
      .ask<IAsksReturn>(asks)
      .then(async res => {
        if (res.email) {
          if (!isEmail(res?.email?.trim())) {
            return print.error(`${res.email}: It is not a valid email`)
          }
        }

        const email = array.length ? array[0].trim() : res?.email?.trim()

        const spinner = toolbox.print.spin(
          `creating the user: ${email}, wait...`
        )

        api
          .post<IApiResponse>('/v1/user', {
            email,
            password: res.password
          })
          .then(({ data }) => {
            if (data.error) {
              spinner.stop()
              return print.warning(`${warning} - ${data.message} - ${warning}`)
            }

            spinner.succeed(`user: ${email} successfully created`)

            return api
              .post<ILoginResponse>('/v1/login', {
                email: email.trim(),
                password: res.password.trim()
              })
              .then(async ({ data }) => {
                if (data.error) {
                  print.newline()
                  return print.error(`${error} - ${data.message}`)
                }

                if (data.token) {
                  await toolbox.patching.update(
                    __dirname + '/../auth/variables.json',
                    config => {
                      config.token = data.token
                      config.id = data.user._id
                      return config
                    }
                  )

                  print.newline()
                  return print.success(
                    `${success} Welcome you are logged in to the account: ${data.user.email}`
                  )
                }
              })
              .catch(error => {
                spinner.warn('End request...')
                return print.error(
                  `An error occurred while trying to login, please try again: ${error.message}`
                )
              })
              .finally(() => {
                spinner.stop()
              })
          })
          .catch(error => {
            spinner.stop()
            print.error(
              `An error occurred while trying to login, please try again: ${error.message}`
            )
          })
      })
      .catch((error: any) => {
        print.error(
          `An error occurred while trying to login, please try again: ${error.message}`
        )
      })
  }
}

module.exports = command
