const { mwn } = require('mwn')

/**
 *
 * @param {mwn} bot
 * @param {[{ title: '', content: '' }]} formattedData
 * @returns
 */
async function uploader (bot, formattedData) {
  const articles = []

  for (let index = 0; index < formattedData.length; index++) {
    const data = formattedData[index]
    const title = `${data.title}/ppsl-data`

    let article = await bot.read(title)

    // Create it if missing.
    if (article.missing) {
      article = await bot.create(title, data.content)
      const token = await bot.getCsrfToken()

      await bot.request({
        title,
        action: 'protect',
        protections: 'edit=sysop|edit=bot|move=sysop',
        expiry: 'infinite',
        token
      })
    } else {
      // Check if an edit is required.

      const dataText = data.content.substring(data.content.indexOf('\n') + 1).replace(/\r/g, '')
      let articleText = article.revisions ? article.revisions[0].content : ''

      if (articleText.length > 0) {
        articleText = articleText.substring(article.revisions[0].content.indexOf('\n') + 1).replace(/\r/g, '')
      }

      if (dataText !== articleText) {
        // Upload it!

        await bot.edit(title, rev => {
          return {
            text: data.content
          }
        })

        articles.push(title)
      }
    }
  }

  return articles
}

module.exports = uploader
