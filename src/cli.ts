const { build } = require('gluegun')

async function run(argv) {
  // create a CLI runtime
  const cli = build()
    .brand('masterdata')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'masterdata-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create()
  const toolbox = await cli.run(argv)

  return toolbox
}

module.exports = { run }
