const memory = [];

module.exports = {
    getLastLine: () => {
        if(!memory.length)
            return "";
        return memory[memory.length - 1];
    },

    save: (line) => {
        memory.push(line);
    },

    getAll: () => {
        return memory;
    }
}