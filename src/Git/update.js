const simpleGit = require('simple-git').default

const settings = require('../../settings')

/**
 *
 * @param {simpleGit} git
 */
async function update (git, error) {
  // We only want this function to continue if the error isn't ENOENT.
  if (!error.message.includes('already exists and is not an empty directory.')) {
    console.warn(error)
    return false
  }

  // Get local copy
  const repo = git(settings.repoLocalPath)

  await repo.init()

  try {
    await repo.checkout()
    await repo.reset(['--hard', 'origin/main'])
  } catch (error) {
    console.error(error)
    return false
  }

  return repo
}

module.exports = update
