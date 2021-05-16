const fs = require('fs')

const { config } = require('dotenv')
const { mwn } = require('mwn')
const Git = require('nodegit')
const core = require('@actions/core')

const settings = require('../settings.js')

const updateRepo = require('./Git/update.js')
const parser = require('./parser.js')
const formatter = require('./formatter.js')

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

  // Run this only if we're not in a github action.
  if (!settings.githubContext.sha) {
    // Git clone it or get it
    try {
      repo = await Git.Clone.clone(settings.repoRemoteURL, settings.repoLocalPath)
    } catch (error) {
      repo = await updateRepo(error)
    }
  } else if (fs.existsSync(settings.repoLocalPath)) {
    repo = true
  }

  if (repo) {
    const rawData = await parser()

    const formattedData = await formatter(rawData)

    // TODO: Wiki-uploader goes here.

    console.log('Finished.')

    if (settings.githubContext.sha) {
      core.setOutput('time', new Date())
    }
  } else {
    if (settings.githubContext.sha) {
      core.setFailed(`Could not find repository in directory: ${settings.repoLocalPath}`)
    }
    process.exit(1)
  }
})
