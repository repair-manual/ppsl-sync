const fs = require('fs').promises
const path = require('path')

const yaml = require('js-yaml')

const settings = require('../settings.js')

function getFileName (str = '') {
  return str + '.yaml'
}

// https://stackoverflow.com/a/48326259
function getUniques (arr1, arr2) {
  const unique1 = arr1.filter((o) => arr2.indexOf(o) === -1)
  const unique2 = arr2.filter((o) => arr1.indexOf(o) === -1)

  return unique1.concat(unique2)
}

async function retrieveLoop (arr, dir) {
  const res = []

  for (let index = 0; index < arr.length; index++) {
    const id = arr[index]
    const fileName = getFileName(id)

    const fileYAML = await fs.readFile(path.join(dir, fileName), 'utf-8')

    const json = yaml.load(fileYAML, yaml.JSON_SCHEMA)
    json._id = id

    // We don't need duplicate entries.
    if (res.findIndex(r => r._id === json._id) === -1) res.push(json)
  }

  return res
}

async function parser () {
  const productsDirPath = path.join(settings.repoLocalPath, 'Products')
  const problemsDirPath = path.join(settings.repoLocalPath, 'Problems')
  const solutionsDirPath = path.join(settings.repoLocalPath, 'Solutions')
  const linksDirPath = path.join(settings.repoLocalPath, 'Links')
  // const tagsDirPath = path.join(settings.repoLocalPath, 'Tags')

  const productsDir = await fs.readdir(productsDirPath)
  const problemsDir = await fs.readdir(problemsDirPath)
  const solutionsDir = await fs.readdir(solutionsDirPath)
  const linksDir = await fs.readdir(linksDirPath)
  // const tagsDir = await fs.readdir(productsDirPath)

  // We're removing ".yaml" because we're already adding it in the retrieveLoop.
  const products = await retrieveLoop(productsDir.map(p => p.replace('.yaml', '')), productsDirPath)
  // TODO: Tags
  //

  const problemsFlat = products.map(p => p.problems).flat()
  const problems = await retrieveLoop(problemsFlat, problemsDirPath)
  // TODO: Tags
  //

  const solutionsFlat = problems.map(p => p.solutions).flat()
  const solutions = await retrieveLoop(solutionsFlat, solutionsDirPath)
  // TODO: Tags
  //

  const linksFlat = solutions.map(s => s.links).flat()
  const links = await retrieveLoop(linksFlat, linksDirPath)
  // TODO: Tags
  //

  console.log(
    'Products (%s/%s)\nProblems (%s/%s) Unused: [%s]\nSolutions (%s/%s) Unused: [%s]\nLinks (%s/%s) Unused: [%s]',
    products.length, productsDir.length,
    problems.length, problemsDir.length, getUniques(problemsDir.map(p => p.replace('.yaml', '')), problemsFlat).join(','),
    solutions.length, solutionsDir.length, getUniques(solutionsDir.map(p => p.replace('.yaml', '')), solutionsFlat).join(','),
    links.length, linksDir.length, getUniques(linksDir.map(p => p.replace('.yaml', '')), linksFlat).join(',')
  )

  return { products, problems, solutions, links }
}

module.exports = parser
