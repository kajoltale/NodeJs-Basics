const fs = require('fs');

function getFormmatedObj(stdRecord, keys) {

    let obj = {};
    keys.forEach(element => {
        obj[element] = stdRecord[element];
    });
    return obj;
}

function getDeatils(data) {
    debugger
    let result = [];
    let keys = ["name", "city"];
    for (let i = 0; i < data.length; i++) {
        let stdRecord = data[i];
        result[i] = getFormmatedObj(stdRecord, keys);
    }
    return result;
}

function onReReadFile(response) {
    debugger
    let result = [];
    let writeFilesPromises = [];

    for (let i = 0; i < response.length; i++) {
        filename = "2" + response[i].filename;
        result[i] = getDeatils(JSON.parse(response[i].data));
        writeFilesPromises.push(writeResult(result[i], filename));
    }

    debugger
    Promise.all(writeFilesPromises)
    .then(data => {
        console.log("Success");
    })
    .catch(error => {
        console.log(error);
    });
    
}

function onWriteTopThree(data) {
    let reReadFilesPromise = [];
        for (let i = 0; i < data.length; i++) {
            reReadFilesPromise.push(readFiles(data[i].filename));
        }

    debugger
    Promise.all(reReadFilesPromise)
        .then(onReReadFile)
        .catch(error => {
            console.log(error);
        })
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

function writeFilesPromises(topThree, bottomThree) {
    let writeFilesPromises = [];
    writeFilesPromises.push(writeResult(topThree, 'topThreePromise.json'));
    writeFilesPromises.push(writeResult(bottomThree, 'bottomThreePromise.json'));

    debugger
    Promise.all(writeFilesPromises)
    .then(onWriteTopThree)
    .catch(error => {
        console.log(error);
    });
}

function onReadFiles(filesArray) {
    debugger
    let student = [];
    for (let i = 0; i < filesArray.length; i++) {
        student = student.concat(JSON.parse(filesArray[i].data).student);
    }

    debugger
    let length = student.length;
    student.sort(sortByProperty);
    let topThree = getThree(student.slice(0, 3));
    let bottomThree = getThree(student.slice(length - 3, length));

    writeFilesPromises(topThree, bottomThree)
}

debugger
let readFilesPromises = [];
readFilesPromises.push(readFiles('./student.json'));
readFilesPromises.push(readFiles('./student1.json'));

debugger
Promise.all(readFilesPromises)
.then(onReadFiles)
.catch(error => {
    console.log(error);
})

//////////////////////////////////////////////////////
function readFiles(filename) {
    let readStdFile = new Promise(function(resolve, reject) {
        function topThreeSt (error, data) {
            debugger
            if(data) {
                resolve({data: data, filename: filename});
            } else {
                reject(error);
            }
        }
    
        fs.readFile(filename, 'utf8', topThreeSt);
    });

    return readStdFile;
}

function writeResult(result, filename) {
    debugger
    result = JSON.stringify(result);

    let writeFile = new Promise(function(resolve, reject) {
        function writeResponse (error, data) {
            debugger
            if(error) {
                reject(error);
            } else {
                resolve({success: true, filename: filename});
            }
        }
    
        fs.writeFile(filename, result, writeResponse);
    });

    return writeFile;
}