const fs = require('fs')

const { config } = require('dotenv')
const { mwn } = require('mwn')
const Git = require('nodegit')
const core = require('@actions/core')

const settings = require('../settings.js')

const updateRepo = require('./Git/update.js')
const parser = require('./parser.js')
const formatter = require('./formatter.js')
const uploader = require('./uploader.js')

config()

const bot = mwn.init({
  apiUrl: settings.mwEndpoint,

  username: process.env.MEDIAWIKI_USERNAME,
  password: process.env.MEDIAWIKI_PASSWORD,

  // Instead of username and password, you can use OAuth 1.0a to authenticate,
  // OAuthCredentials: {
  //   consumerToken: "16_DIGIT_ALPHANUMERIC_KEY",
  //   consumerSecret: "20_DIGIT_ALPHANUMERIC_KEY",
  //   accessToken: "16_DIGIT_ALPHANUMERIC_KEY",
  //   accessSecret: "20_DIGIT_ALPHANUMERIC_KEY"
  // },

  userAgent: settings.userAgent.replace('%s', settings.packageJSON.version),

  defaultParams: {
    assert: 'user' // ensure we're logged in
  }
})

Promise.resolve(bot).then(async bot => {
  let repo

  // Git clone it or get it
  try {
    repo = await Git.Clone.clone(settings.repoRemoteURL, settings.repoLocalPath)
  } catch (error) {
    repo = await updateRepo(error)
  }

  if (typeof repo === 'boolean') {
    if (settings.githubContext.sha) {
      core.setFailed(`Could not find repository in directory: ${settings.repoLocalPath}`)
    }
    return process.exit(1)
  }

  const { unusedData, rawData } = await parser()

  // Get hash commit
  const sha = (await repo.getHeadCommit()).sha()

  const formattedData = await formatter(sha, rawData)

  const uploadedArticles = [] // await uploader(bot, formattedData)

  console.log('Uploaded [%s]', uploadedArticles.join(', '))

  console.log('Finished.')

  if (settings.githubContext.sha) {
    core.setOutput('unused-data', JSON.stringify(unusedData))
    core.setOutput('uploaded-articles', JSON.stringify(uploadedArticles))
    core.setOutput('time', new Date())
  }
})
