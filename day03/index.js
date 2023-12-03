const fs = require('node:fs');
const path = require('node:path');

const extractS = (arr) => {
   let sum = 0;

   const speCharPositions = new Map();
   const numPositions = new Map();

   arr.forEach((line, index) => {
      const speCharMatch = [...line.trim().matchAll(/([^0-9\.])/g)];
      speCharMatch.forEach((m) => {
         const posSetMinus = speCharPositions.get(index - 1);
         if (posSetMinus) {
            [m.index - 1, m.index, m.index + 1].forEach(v => posSetMinus.add(v));
         }
         else speCharPositions.set(index - 1, new Set([m.index - 1, m.index, m.index + 1]));

         const posSet = speCharPositions.get(index);
         if (posSet) {
            [m.index - 1, m.index, m.index + 1].forEach(v => posSet.add(v));
         } else speCharPositions.set(index, new Set([m.index - 1, m.index, m.index + 1]));

         const posSetPlus = speCharPositions.get(index + 1);
         if (posSetPlus) {
            [m.index - 1, m.index, m.index + 1].forEach(v => posSetPlus.add(v));
         } else speCharPositions.set(index + 1, new Set([m.index - 1, m.index, m.index + 1]));
      });

      const numCharMatch = [...line.trim().matchAll(/([\d]+)/g)];
      numCharMatch.forEach((m) => {
         numPositions.set([index, m.index], m[0]);
      });
   });

   numPositions.forEach((value, key) => {
      const set = speCharPositions.get(key[0]);
      const arr = [...value];
      for (let index = 0; index < arr.length; index++) {
         if (set?.has(key[1] + index)) {
            sum += Number(value);
            break;
         }
      };
   });
   return sum;
}

const getPosAroundG = (x, y) => {
   if((x - 1) < 0) {
      if(y - 1 < 0) {
         return [
            `${x},${y}`, `${x},${y+1}`,
            , `${x+1},${y}`, `${x+1},${y+1}`];             
      }
      else {
         return [
            `${x},${y-1}`, `${x},${y}`, `${x},${y+1}`,
            `${x+1},${y-1}`, `${x+1},${y}`, `${x+1},${y+1}`];   
      }
  
   } else {
      if(y - 1 < 0) {
         return [
            `${x-1},${y}`, `${x-1},${y+1}`,
            `${x},${y}`, `${x},${y+1}`,
            `${x+1},${y}`, `${x+1},${y+1}`];
      } else {
         return [
            `${x-1},${y-1}`, `${x-1},${y}`, `${x-1},${y+1}`,
            `${x},${y-1}`, `${x},${y}`, `${x},${y+1}`,
            `${x+1},${y-1}`, `${x+1},${y}`, `${x+1},${y+1}`];
      }
   }
}

const extractG = (arr) => {
   let sum = 0;

   const speCharPositions = new Map();
   const numPositions = new Map();

   let index = 0;
   arr.forEach((line, i) => {
      const speCharMatch = [...line.trim().matchAll(/(\*)/g)];
      speCharMatch.forEach((m) => {
         speCharPositions.set(index, new Set(getPosAroundG(i, m.index)));
         index++;
      });

      const numCharMatch = [...line.trim().matchAll(/([\d]+)/g)];
      numCharMatch.forEach((m) => {
         numPositions.set(`${i},${m.index}`, `${m[0]}`);
      });
   });

   // console.log(numPositions);
   speCharPositions.forEach((speV, speK) => {
      const occ = [];
      numPositions.forEach((numV, numK) => {
         const len = numV.length;
         for (let i = 0; i < len; i++) {
            const split = numK.split(',');
            if(speV.has(`${split[0]},${Number(split[1])+i}`)) {
               occ.push(numV);
               break;
            }
         }
      });
      if(occ.length === 2) sum += occ.reduce((acc, v) => acc * Number(v), 1);
   });
   return sum;
}

const formatToArray = (input) => {
   return input.split('\n');
}

const readFile = (filename, callback) => {
   fs.readFile(path.join(__dirname, filename), 'utf8', (err, data) => {
      if (err) {
         console.error('Error:', err);
         return;
      }
      callback(data);
   });
}

const runS = (filename) => {
   const callback = (data) => {
      console.time();
      console.log(`Response Silver ${filename}: ${extractS(formatToArray(data))}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}

const runG = (filename) => {
   const callback = (data) => {
      console.time();
      console.log(`Response Gold ${filename}: ${extractG(formatToArray(data))}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}

runS('sample_silver.txt');
runG('sample_gold.txt');
runS('input.txt');
runG('input.txt');