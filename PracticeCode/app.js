
const fs = require('fs');
let combineData = [];
let errorArr = [];
let count = 0;

function writeResult(result, filename) {
    result = JSON.stringify(result);
    fs.writeFile(filename, result, (err, response) => {
        if (err)
            console.log(err);
        else {
            console.log("Write success: " + filename);
        }
    });
}

function sortByProperty(a, b) {
    let property = "marks";
    if(a[property] < b[property])  
        return 1;  
    else
        return -1;  
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

function onAllFilesRead () {
    let student = combineData;
    let length = student.length;
    student.sort(sortByProperty);

    getThree(student.slice(0, 3), 'topThree.json');
    getThree(student.slice(length - 3, length), 'bottomThree.json');
}

function topThreeSt (error, data) {
    count++;
    if(data) {
        combineData = combineData.concat(JSON.parse(data).student)
    } else {
        errorArr.push(error);
        console.log(error);
    }

    if (count == 2) {
        if (errorArr.length == 0) {
            onAllFilesRead();
        } else {
            console.log(errorArr);
        }  
    } 
}

function readStdFile() {
    //const fs = require('fs');
    fs.readFile('./student.json', 'utf8', topThreeSt);
    fs.readFile('./student1.json', 'utf8', topThreeSt);
}

readStdFile();