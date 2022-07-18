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

async function reWriteResult(response, filenames) {
    let result = [];
    let writeFilesPromises = [];
    for (let i = 0; i < response.length; i++) {
        filename = "2" + filenames[i];
        result[i] = getDeatils(JSON.parse(response[i]));
        writeFilesPromises.push(writeResult(result[i], filename));
    }

    let data = await Promise.all(writeFilesPromises).catch(e => ({"isError": true, "error": e}));

    if (data.isError) {
        console.log(data.error);
    } else {
        console.log("success");
    }
}

async function onWriteFile(filenames) {
    let readFilesPromises = [];
    for (let i = 0; i < filenames.length; i++) {
        readFilesPromises.push(readFiles(filenames[i]));
    }

    let data = await Promise.all(readFilesPromises).catch(e => ({"isError": true, "error": e}));

    if(data.isError) {
        console.log(error);
    } else {
        reWriteResult(data, filenames);
    }
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
                resolve(data);
            }
        }
    
        fs.writeFile(filename, result, writeResponse);
    });

    return writeFile;
}

async function writeFilesPromises(topThree, bottomThree) {
    let writeFilesPromises = [];
    writeFilesPromises.push(writeResult(topThree, 'topThreePromise.json'));
    writeFilesPromises.push(writeResult(bottomThree, 'bottomThreePromise.json'));

    let filenames = ['topThreePromise.json', 'bottomThreePromise.json'];

    debugger
    let data = await Promise.all(writeFilesPromises).catch(e => ({"isError": true, "error": e}));

    if (data.isError) {
        console.log(data.error);
    } else {
        onWriteFile(filenames);
    }
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

function onReadFiles(filesArray) {
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

    writeFilesPromises(topThree, bottomThree)
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

async function startProgram(filenames) {
    debugger
    let readFilesPromises = [];
    for (let i = 0; i < filenames.length; i++) {
        readFilesPromises.push(readFiles(filenames[i]));
    }

    let data = await Promise.all(readFilesPromises).catch(e => ({"isError": true, "error": e}));

    if(data.isError) {
        console.log(error);
    } else {
        onReadFiles(data);
    }
}

let filenames = ['./student.json', './student1.json'];
startProgram(filenames);