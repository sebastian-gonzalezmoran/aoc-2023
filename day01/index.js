const fs = require('node:fs');
const path = require('node:path');

const extract = (arr) => {
   const nbStrMap = new Map([['zero','0'], ['one', '1'], ['two', '2'], ['three', '3'], ['four', '4'], ['five', '5'], ['six', '6'], ['seven', '7'], ['eight', '8'], ['nine', '9']]);
   return arr.map((s) => s.match(/((zero|one|two|three|four|five|six|seven|eight|nine|[0-9]).*(zero|one|two|three|four|five|six|seven|eight|nine|[0-9]))|(zero|one|two|three|four|five|six|seven|eight|nine|[0-9])/))
      .reduce((acc, v) => acc + Number(v[2] ? (nbStrMap.get(v[2]) || v[2]) + (nbStrMap.get(v[3]) || v[3]) : (nbStrMap.get(v[4]) || v[4]).repeat(2)), 0)
}

const formatToArray = (input) => {
   return input.split('\n');
}

const readFile = (filename, callback) => {
   let data  = fs.readFileSync(path.join(__dirname, filename), "utf8");
   callback(data);
 };

const run = (filename) => {
   const callback = (data) => {
      console.time();
      console.log(`Response: ${extract(formatToArray(data))}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}

run('sample_silver.txt');
run('sample_gold.txt');
run('input.txt');