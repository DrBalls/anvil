const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDirectory = './logs';
        this.logExtension = '.log';
        this.logFilename = 'app.log';
        this.createLogDirectory();
    }

    createLogDirectory() {
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
    }

    formatLogEntry(message) {
        const timestamp = new Date().toISOString();
        return `${timestamp}:${message}`;
    }

    logEvent(message) {
        const formattedEntry = this.formatLogEntry(message);
        const logPath = path.join(this.logDirectory, this.logFilename);

        fs.appendFileSync(logPath, formattedEntry + '\n');
    }
}

module.exports = Logger;