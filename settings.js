const path = require('path')
const fs = require('fs')

const core = require('@actions/core')
const github = require('@actions/github')

const defaultSettings = {
  mwEndpoint: 'https://repair.wiki/api.php',
  userAgent: 'PPSL-Sync-Bot/%s (https://github.com/repair-manual/ppsl-sync)',
  repoRemoteURL: 'https://github.com/kararty/ppsl-data.git',
  repoLocalPath: path.join(__dirname, 'ppsl-data'),
  packageJSON: JSON.parse(fs.readFileSync(path.join(__dirname, './package.json'), 'utf-8')),
  appHomepage: 'https://repair-manual.github.io/ppsl-app'
}

const settings = {
  mwEndpoint: core.getInput('mediawiki-api-endpoint') || defaultSettings.mwEndpoint,
  repoLocalPath: core.getInput('repo-local-path') || defaultSettings.repoLocalPath,
  githubContext: github.context
}

module.exports = { ...defaultSettings, ...settings }
