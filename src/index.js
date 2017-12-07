/*
  Botpress module template. This is your module's entry point.
  Please have a look at the docs for more information about config, init and ready.
  https://botpress.io/docs
*/

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const Promise = require('bluebird')
const _AWS = require('aws-sdk')

// TODO polyfill require => const configTemplate = require(raw!.botpress-aws-comprehend.config.yml)
import configTemplate from 'raw!./botpress-aws-comprehend.config.yml'

let comprehend = null

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

const incomingMiddleWare = async (event, next) => {
  const message = _.get(event, 'text')
  if (message) {
    let language = await comprehend.detectDominantLanguageAsync({ Text: message })
    language = _.get(language, 'Languages[0].LanguageCode')
    comprehend
      .detectEntitiesAsync({ Text: message, LanguageCode: language })
      .then(async data => {
        let awsObj = {}
        const key = await comprehend.detectKeyPhrasesAsync({ Text: message, LanguageCode: language })
        const sentiment = await comprehend.detectSentimentAsync({
          Text: message,
          LanguageCode: language
        })
        event.aws_comprehend = _.assign(awsObj, data, key, sentiment)
        next()
      })
      .catch(err => {
        event.bp.logger.debug('botpress-aws-comprehend error: ', err)
        next()
      })
  }
}

const initAWSComprehend = configurator => {
  comprehend = Promise.promisifyAll(new _AWS.Comprehend({ ...configurator }))
}

module.exports = {
  config: {
    accessKeyId: { type: 'string', required: true, default: '', env: 'AWD_ACCESS_KEY_ID' },
    secretAccessKey: { type: 'string', required: true, default: '', env: 'AWS_SECRET_ACCESS_KEY' },
    region: { type: 'string', required: true, default: '', env: 'AWS_REGION' },
    apiVersion: { type: 'string', required: true, default: '', env: 'AWS_API_VERSION' }
    // TODO add more Config
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

    initAWSComprehend(config)

    createConfigFile(bp)
  },

  ready: async function(bp, configurator) {
    var router = bp.getRouter('botpress-aws-comprehend')

    router.get('/config', async (req, res) => {
      res.send(await configurator.loadAll())
    })

    router.post('/config', async (req, res) => {
      const { ...config } = req.body
      await configurator.saveAll(config).then(() => {})

      initAWSComprehend(config)
      res.sendStatus(200)
    })

    // Your module's been loaded by Botpress.
    // Serve your APIs here, execute logic, etc.
    // Do fancy stuff here :)
  }
}
