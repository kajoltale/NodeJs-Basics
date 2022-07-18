const fs = require('fs');

function writeResult(result) {
    debugger
    result = JSON.stringify(result);

    let writeFile = new Promise(function(resolve, reject) {
        function writeResponse (error, data) {
            debugger
            if(error) {
                reject(error);
            } else {
                resolve(data);
            }
        }
    
        fs.writeFile("result.json", result, writeResponse);
    });

    writeFile
    .then(() => console.log("Success"))
    .catch(error => console.log(error));
}

function sortByProperty(a, b) {
    let property = "marks";
    if(a[property] < b[property])  
        return 1;  
    else
        return -1;  
}

function onReadFile(data) {
    debugger
    data = JSON.parse(data);
    let student = data.student;
    student.sort(sortByProperty);

    let result = [];
    
    for (let i = 0; i < 3; i++) {
        let stdRecord = student[i];
        let a = {
            "name":  stdRecord.name,
            "marks": stdRecord.marks,
            "city": stdRecord.address.city
        }
        result[i] = a;
    }
    debugger
    writeResult(result);
}

let readStdFile = new Promise(function(resolve, reject) {
    function topThreeSt (error, data) {
        debugger
        if(data) {
            resolve(data);
        } else {
            reject(error);
        }
    }

    fs.readFile('./student.json', 'utf8', topThreeSt);
});

debugger
readStdFile
.then(onReadFile)
.catch(error => {
    debugger
    console.log(error);
});