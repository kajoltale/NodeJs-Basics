const fs = require('fs');

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

    return writeFile;
}

function getThree(student) {
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

    return result;
}

function sortByProperty(a, b) {
    let property = "marks";
    if(a[property] < b[property])  
        return 1;  
    else
        return -1;  
}

async function onReadFiles(filesArray) {
    debugger
    let student = [];
    for (let i = 0; i < filesArray.length; i++) {
        student = student.concat(JSON.parse(filesArray[i]).student);
    }

    debugger
    let length = student.length;
    student.sort(sortByProperty);
    let topThree = getThree(student.slice(0, 3));
    let bottomThree = getThree(student.slice(length - 3, length));

    let writeFilesPromises = [];
    writeFilesPromises.push(writeResult(topThree, 'topThreePromise.json'));
    writeFilesPromises.push(writeResult(bottomThree, 'bottomThreePromise.json'));

    debugger
    let data = await Promise.all(writeFilesPromises).catch(e => ({"isError": true, "error": e}));

    if (data.isError) {
        console.log(data.error);
    } else {
        console.log("Write success");
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

    return readStdFile;
}

debugger
let readFilesPromises = [];
readFilesPromises.push(readFiles('./student.json'));
readFilesPromises.push(readFiles('./student1.json'));

async function startProgram() {
    debugger
    let data = await Promise.all(readFilesPromises).catch(e => e);

    if(Array.isArray(data)) {
        onReadFiles(data);
    } else {
        console.log(data);
    }
    
}

startProgram();