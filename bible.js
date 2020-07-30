const fs = require('fs');

let initBible = function (_callback) {
    fs.readFile('./bible.json','utf8',(err,data) => {
        if(err) {
            console.log(`Failed to load bible due to error:${err}`);
        }
        else {
            let parsedData = eval(data.toString());
            console.log('Bible initialized successfully.');
            _callback(parsedData);
        }
    });
}


module.exports = {
    initBible:initBible
};