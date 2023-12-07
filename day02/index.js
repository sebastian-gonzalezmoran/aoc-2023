const fs = require('node:fs');
const path = require('node:path');

const extractS = (arr, totalCubes) => {
   let goodGames = 0;
   arr.forEach((l, index) => {
      const games = [...l.matchAll(/(\d+ \w+)/g)];
      let isGG = true;
      for (let index = 0; index < games.length; index++) {
         const cube = games[index][0].match(/(\d+) (\w+)/).slice(1,3);
         if(+cube[0] > totalCubes.get(cube[1])) {
            isGG = false;
            break;
         }
      }
      if(isGG) goodGames += (index + 1);
   });
   return goodGames;
}

const extractG = (arr, totalCubes) => {
   let sum = 0;
   arr.forEach((l, index) => {
      const games = [...l.matchAll(/(\d+ \w+)/g)];
      const minCubes = totalCubes;
      minCubes.forEach((value, key, map) => {
         map.set(key, 0);
      });
      for (let index = 0; index < games.length; index++) {
         const cube = games[index][0].match(/(\d+) (\w+)/).slice(1,3);
         if(minCubes.get(cube[1]) < +cube[0]) {
            minCubes.set(cube[1], +cube[0]);
         }
      }
      let temp = 1;
      minCubes.forEach((value) => {
         temp *= value;
      });
      sum += temp;
   });
   return sum;
}

const formatToArray = (input) => {
   return input.split('\n');
}


const readFile = (filename, callback) => {
   let data  = fs.readFileSync(path.join(__dirname, filename), "utf8");
   callback(data);
 };

const runS = (filename, totalCubes) => {
   const callback = (data) => {
      console.time();
      console.log(`Response Silver ${filename}: ${extractS(formatToArray(data), totalCubes)}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}
const runG = (filename, totalCubes) => {
   const callback = (data) => {
      console.time();
      console.log(`Response Gold ${filename}: ${extractG(formatToArray(data), totalCubes)}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}

runS('sample.txt', new Map([['red',12], ['green', 13], ['blue', 14]]));
runG('sample.txt', new Map([['red',12], ['green', 13], ['blue', 14]]));
runS('input.txt', new Map([['red',12], ['green', 13], ['blue', 14]]));
runG('input.txt', new Map([['red',12], ['green', 13], ['blue', 14]]));