const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.scss')) results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Users/karma/Downloads/Horizontal Learning Platform/frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    if (!content.includes('-webkit-text-stroke: 1.5px currentColor;')) {
        content = content.replace(/font-weight:\s*900;/g, 'font-weight: 900;\n  -webkit-text-stroke: 1.5px currentColor;');
    }
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});
