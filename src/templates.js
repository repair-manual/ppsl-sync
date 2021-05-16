const fs = require('fs')
const path = require('path')

module.exports = {
  problemTable: fs.readFileSync(path.join(__dirname, './Templates/ProblemTable'), 'utf-8'),
  problemTableEntry: fs.readFileSync(path.join(__dirname, './Templates/ProblemTableEntry'), 'utf-8'),
  finalOutput: fs.readFileSync(path.join(__dirname, './Templates/FinalOutput'), 'utf-8')
}
