const readLastLines = require('read-last-lines');
const fs = require('fs');

module.exports = {
    getLastLine: () => {
        return readLastLines.read(config.storage_path, 1)
            .catch((e) => {
                if(e.toString() === 'Error: file does not exist') // If file does not exist, return empty string.
                    return "";
                throw e;
            });
    },

    save: (line) => {
        fs.appendFileSync(config.storage_path, `${line}\n`); // If file does not exist, it will be created.
    },

    getAll: () => {
        try{
            const result = fs.readFileSync(config.storage_path).toString().split('\n').filter(line => !_.isEmpty(line));
            return result;
        }
        catch(e){
            console.log(e);
            return [];
        }
    },

    clean: () => {
        if(fs.existsSync(config.storage_path))
            fs.unlinkSync(config.storage_path);
    }
}