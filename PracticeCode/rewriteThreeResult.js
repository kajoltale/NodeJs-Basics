
const fs = require('fs');
const { report } = require('process');
let readCount1 = 0;
let studentArr = [];

function onWriteResult(filename) {
    console.log("Write2 success ", filename);
}

function getDeatils(data) {
    filename = "2" + data.filename;
    data = JSON.parse(data.data);
    //console.log(data);
    let result = [];
    for (let i = 0; i < data.length; i++) {
        let stdRecord = data[i];
        let a = {
            "name":  stdRecord.name,
            "city": stdRecord.city
        };
        result[i] = a;
    }
    writeResult(result, filename, onWriteResult);
}

function onWriteFiles(filename) {
    readStdFile(filename, getDeatils);
}

function writeResult(result, filename, cbFn) {
    result = JSON.stringify(result);
    fs.writeFile(filename, result, (err, response) => {
        if (err) {
            console.log(err);
            cbFn(err);
        } else {
            console.log("Write success: " + filename);
            // readStdFile(filename, false);
            cbFn(filename);
        }
    });
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
    writeResult(result, filename, onWriteFiles);
}

function sortByProperty(a, b) {
    let property = "marks";
    if(a[property] < b[property])  
        return 1;  
    else
        return -1;  
}

function onAllFilesRead () {
    let student = studentArr;
    let length = student.length;
    student.sort(sortByProperty);

    getThree(student.slice(0, 3), 'topThree.json');
    getThree(student.slice(length - 3, length), 'bottomThree.json');
}

function onReadFile(resp) {
    debugger
    readCount1++;
    if (resp.success) {
        studentArr = studentArr.concat(JSON.parse(resp.data).student);
        if (readCount1 == 2) {
            onAllFilesRead();
        } 
    } else {
        console.log(resp.error)
    }
}

function readStdFile(filename, cbFn) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            cbFn({success: false, error: err});
        } else {
            console.log("Read success: ", filename);
            cbFn({success: true, data: data, filename: filename});
        }
    });
}

readStdFile('./student.json', onReadFile);
readStdFile('./student1.json', onReadFile);