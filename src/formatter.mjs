import templates from './templates.mjs'

function noWikiLabels (str = '') {
  return str.replace(/(:|;|\*)/g, '<nowiki>$1</nowiki>')
}

function trimDescription (str = '') {
  return str.replace(/\n\n/g, '\n').trim().replace(/\n/g, '\n:')
}

async function formatter ({ products, problems, solutions, links }) {
  const formattedTemplates = []

  for (let i = 0; i < products.length; i++) {
    const product = products[i]

    const linksRef = []

    // Problems
    const problemsFormatted = []
    for (let ii = 0; ii < product.problems.length; ii++) {
      const problem = problems.find(problem => problem._id === product.problems[ii])

      // Solutions
      const solutionsFormatted = []
      for (let iii = 0; iii < problem.solutions.length; iii++) {
        const solution = solutions.find(solution => solution._id === problem.solutions[iii])

        // Links
        const linksFormatted = []
        for (let iiii = 0; iiii < solution.links.length; iiii++) {
          const link = links.find(link => link._id === solution.links[iiii])
          const linkDescriptionFormat = noWikiLabels(link.description).replace(/\n\n/g, '\n').trim()

          let ref = linksRef.find(ref => ref.url === link.url)

          if (!ref) {
            ref = { ...link, _id: `link-${linksRef.length}` }
            linksRef.push(ref)
            linksFormatted.push(`<ref name="${ref._id}">[${link.url} "${link.label}"]${linkDescriptionFormat.length > 0 ? ` ${linkDescriptionFormat}` : ''}</ref>`)
          } else {
            linksFormatted.push(`<ref name="${ref._id}" />`)
          }
        }

        const solutionLabelFormat = noWikiLabels(solution.label)
        const solutionDescriptionFormat = trimDescription(solution.description).length > 0 ? trimDescription(solution.description) : undefined

        solutionsFormatted.push(`;${solutionLabelFormat}${linksFormatted.length > 0 ? ` ${linksFormatted.join(' ')}` : ''}${solutionDescriptionFormat ? `\n:${solutionDescriptionFormat}` : ''}`)
      }

      const problemLabelFormat = noWikiLabels(problem.label)
      const problemDescriptionFormat = trimDescription(problem.description).length > 0 ? trimDescription(problem.description) : undefined
      const problemTE = templates.problemTableEntry
        .replace(/%n/g, ii + 1)
        .replace('%problem', `;${problemLabelFormat}${problemDescriptionFormat ? `\n:${problemDescriptionFormat}` : ''}`)
        .replace('%solutions', solutionsFormatted.join('\n'))

      problemsFormatted.push(problemTE)
    }

    const problemTableFormatted = templates.problemTable
      .replace('%problemTableEntries', problemsFormatted.join('\n'))

    const template = {
      title: product._id,
      content: problemTableFormatted
    }

    formattedTemplates.push(template)
  }

  return formattedTemplates
}

export default formatter
