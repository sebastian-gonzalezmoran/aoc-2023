const fs = require('node:fs');

const extract = (arr) => {
   const nbStrMap = new Map([['zero','0'], ['one', '1'], ['two', '2'], ['three', '3'], ['four', '4'], ['five', '5'], ['six', '6'], ['seven', '7'], ['eight', '8'], ['nine', '9']]);
   return arr.map((s) => s.match(/((zero|one|two|three|four|five|six|seven|eight|nine|[0-9]).*(zero|one|two|three|four|five|six|seven|eight|nine|[0-9]))|(zero|one|two|three|four|five|six|seven|eight|nine|[0-9])/))
      .reduce((acc, v) => acc + Number(v[2] ? (nbStrMap.get(v[2]) || v[2]) + (nbStrMap.get(v[3]) || v[3]) : (nbStrMap.get(v[4]) || v[4]).repeat(2)), 0)
}

const formatToArray = (input) => {
   return input.split('\n');
}

const readFile = (path, callback) => {
   fs.readFile(path, 'utf8', (err, data) => {
     if (err) {
       console.error('Error:', err);
       return;
     }
     callback(data);
   });
}

const run = (path) => {
   const callback = (data) => {
      console.time();
      console.log(`Response: ${extract(formatToArray(data))}`);
      console.timeEnd();
   };
   readFile(path, callback);
}

run('./day01/sample_silver.txt');
run('./day01/sample_gold.txt');
run('./day01/input.txt');