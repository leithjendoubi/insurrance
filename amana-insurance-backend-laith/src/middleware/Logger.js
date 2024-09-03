import { v4 as uuid } from 'uuid'
import fs from 'fs'
const fsPromises = fs.promises
import path from 'path'
import { format } from 'date-fns'
import { fileURLToPath } from 'url'

const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd/tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(
            path.join(__dirname, '..', 'logs', logFileName),
            logItem
        )
    } catch {
        ;(err) => console.log('Error: ' + err)
    }
}
const logger = (req, res, next) => {
    const message = `${req.method}\t${req.url}\t${req.headers.origin}`
    logEvents(message, 'reqLog.log')
    console.log(`${req?.method} ${req?.path}`)
    next()
}
export { logger, logEvents }