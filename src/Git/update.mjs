import Git from 'nodegit'

import settings from '../../settings.js'

async function update (error) {
  // We only want this function to continue if the error is ENOENT.
  if (error.errno !== -4) {
    console.warn(error)
    return
  }

  // Get local copy
  const repo = await Git.Repository.open(settings.repoLocalPath)

  try {
    await repo.fetchAll('origin')
    await repo.mergeBranches('main', 'origin/main')
  } catch (error) {
    console.log(error)
    return false
  }

  return true
}

export default update