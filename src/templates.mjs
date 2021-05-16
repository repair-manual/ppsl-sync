import fs from 'fs'

export default {
  problemTable: fs.readFileSync(new URL('./Templates/ProblemTable', import.meta.url), 'utf-8'),
  problemTableEntry: fs.readFileSync(new URL('./Templates/ProblemTableEntry', import.meta.url), 'utf-8'),
  finalOutput: fs.readFileSync(new URL('./Templates/FinalOutput', import.meta.url), 'utf-8')
}
