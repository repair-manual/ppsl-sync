const simpleGit = require('simple-git')

const settings = require('../../settings')

/**
 *
 * @param {simpleGit.default} git
 * @returns
 */
async function update (git, error) {
  // We only want this function to continue if the error isn't ENOENT.
  if (!error.message.includes('already exists and is not an empty directory.')) {
    console.warn(error)
    return
  }

  // Get local copy
  const repo = git(settings.repoLocalPath)

  await repo.init()

  try {
    await repo.checkout()
    await repo.reset(['--hard', 'origin/main'])
  } catch (error) {
    console.log(error)
    return false
  }

  return repo
}

module.exports = update
