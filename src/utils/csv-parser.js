const fs = require('fs');
const path = require('path');
const setNestedProperty = (obj, path, value) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        
        current = current[key];
    }

    current[keys[keys.length - 1]] = value.trim();
};

const csvToJson = (filePath) => {
    
    const fileContent = fs.readFileSync(path.resolve(filePath), 'utf8');
    
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 2) { 
        return [];
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    
    const result = [];

    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        const values = line.split(','); 
        
        if (values.length !== headers.length) {
            console.warn(`Skipping line ${i + 1} due to inconsistent column count: Expected ${headers.length}, got ${values.length}.`);
            continue;
        }

        let userObject = {};
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            const value = values[j];
            
            setNestedProperty(userObject, header, value); 
        }

        result.push(userObject);
    }

    return result;
};

module.exports = {
    setNestedProperty,
    csvToJson,
};