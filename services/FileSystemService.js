const readLastLines = require('read-last-lines');
const fs = require('fs');

module.exports = {
    getLastLine: () => {
        return readLastLines.read(config.storage_path, 1);
    },

    save(line){
        fs.appendFileSync(config.storage_path, `\n${line}`);
    }
}