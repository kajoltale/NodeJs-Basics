const fs = require('fs');
let combineData = [];
let count = 0;

function writeResult(result, filename) {
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
    
        fs.writeFile(filename, result, writeResponse);
    });

    writeFile
    .then(() => console.log("Success"))
    .catch(error => console.log(error));
}

function getThree(student, filename) {
    let result = [];
    for (let i = 0; i < student.length; i++) {
        let stdRecord = student[i];
        let a = {
            "name":  stdRecord.name,
            "marks": stdRecord.marks,
            "city": stdRecord.address.city
        };
        result[i] = a;
    }
    writeResult(result, filename);
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
    count++;
    combineData = combineData.concat(JSON.parse(data).student);
    let student = combineData;
    let length = student.length;
    student.sort(sortByProperty);
    if (count == 2) {
        console.log(student);

        getThree(student.slice(0, 3), 'topThreePromise.json');
        getThree(student.slice(length - 3, length), 'bottomThreePromise.json');
    }
}

function readFiles(filename) {
    let readStdFile = new Promise(function(resolve, reject) {
        function topThreeSt (error, data) {
            debugger
            if(data) {
                resolve(data);
            } else {
                reject(error);
            }
        }
    
        fs.readFile(filename, 'utf8', topThreeSt);
    });

    debugger
    readStdFile
    .then(onReadFile)
    .catch(error => {
        debugger
        console.log(error);
    });
}

readFiles('./student.json');
readFiles('./student1.json');