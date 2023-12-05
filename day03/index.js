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

const formatToArray = (input) => {
   return input.split('\n');
}


const getNumberLeft = (i, input) => {
   let s = '';
   while(Number(input[i]) >= 0) {
      s = input[i] + s;
      i -= 1;
   }
   return s;
};
const getNumberRight = (i, input) => {
   let s = '';
   while(Number(input[i]) >= 0) {
      s = s + input[i];
      i += 1;
   }
   return s;
};
const getNumberLeftAndRight = (i, input) => {
   return getNumberLeft(i - 1, input) + input[i] + getNumberRight(i + 1, input);
} 

const extractG = (input) => {
   let sum = 0;

   let line = 0;
   let mod = 0;
   const speCharMatch = [...input.matchAll(/([\*\n])/g)];
   speCharMatch.forEach((match) => {
      const char = match[0];
      const index = match.index;
      if(char === '\n') {
         mod = (index + 1) - (mod * line);
         line++;
      } else {
         let i;
         const arr = [];

         //Left
         i = index - 1;
         if(Number(input[i] >= 0)) {
            arr.push(getNumberLeft(i, input))
         }

         //Right
         i = index + 1;
         if(Number(input[i])) {
            arr.push(getNumberRight(i, input));
         }

         //Top
         i = index - mod;
         if(Number(input[i] >= 0)) {
            arr.push(getNumberLeftAndRight(i, input));
         }
         else {
            //Left
            if(Number(input[i-1] >= 0)) {
               arr.push(getNumberLeft(i-1, input));
            }
            //Right
            if(Number(input[i+1] >= 0)) {
               arr.push(getNumberRight(i+1, input));
            }
         }

         //Bottom
         i = index + mod;
         if(Number(input[i] >= 0)) {
            arr.push(getNumberLeftAndRight(i, input));
         }
         else {
            //Left
            if(Number(input[i-1] >= 0)) {
               arr.push(getNumberLeft(i-1, input));
            }
            //Right
            if(Number(input[i+1] >= 0)) {
               arr.push(getNumberRight(i+1, input));
            }
         }
         
         if(arr.length === 2) {
            sum += arr.reduce((acc, v) => acc * Number(v), 1);
         }
      }
   })
   return sum;
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
      console.log(`Response Gold ${filename}: ${extractG(data)}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}

runS('sample.txt');
runG('sample.txt');
runS('input.txt');
runG('input.txt');