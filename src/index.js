/*
  Botpress module template. This is your module's entry point.
  Please have a look at the docs for more information about config, init and ready.
  https://botpress.io/docs
*/

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const _AWS = require('aws-sdk')
const Promise = require('bluebird')

// TODO polyfill require => const configTemplate = require(raw!.botpress-aws-comprehend.config.yml)
import configTemplate from 'raw!./botpress-aws-comprehend.config.yml'

let comprehend = null

const incomingMiddleWare = (event, next) => {
  // PUT CONFIG

  const message = _.get(event, 'text')

  if (message) {
    comprehend.detectEntities({ Text: message, LanguageCode: 'en' }, (err, data) => {
      if (!err) {
        event.aws_comprehend = data
        console.log(data)
        next()
      }
    })
  }
}

const initAWSComprehend = (bp, configurator) => {
  comprehend = new _AWS.Comprehend({ ...configurator })
}

const createConfigFile = bp => {
  const name = 'botpress-aws-comprehend.config.yml'
  const file = path.join(bp.projectLocation, name)

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, configTemplate)

    bp.notifications.send({
      level: 'info',
      message: name + ' has been created, fill it'
    })
  }
}

module.exports = {
  config: {
    accessKeyId: { type: 'string', required: true, default: '', env: 'AWD_ACCESS_KEY_ID' },
    secretAccessKey: { type: 'string', required: true, default: '', env: 'AWS_SECRET_ACCESS_KEY' },
    region: { type: 'string', required: true, default: '', env: 'AWS_REGION' },
    apiVersion: { type: 'string', required: true, default: '', env: 'AWS_API_VERSION' }
  },

  init: async function(bp, configurator) {
    bp.middlewares.register({
      name: 'aws-comprehend.sendMessage',
      module: 'botpress-aws-comprehend',
      type: 'incoming',
      handler: incomingMiddleWare,
      order: 10,
      description:
        'Process natural language in the form of text. Structured data with an action and parameters for that action is injected in the incoming message event.'
    })

    const config = await configurator.loadAll()

    initAWSComprehend(bp, config)

    createConfigFile(bp)
    // This is called before ready.
    // At this point your module is just being initialized, it is not loaded yet.
  },

  ready: async function(bp, configurator) {
    var router = bp.getRouter('botpress-aws-comprehend')

    // Your module's been loaded by Botpress.
    // Serve your APIs here, execute logic, etc.

    const config = await configurator.loadAll()
    // Do fancy stuff here :)
  }
}
