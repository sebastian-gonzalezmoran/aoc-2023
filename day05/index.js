const fs = require('node:fs');
const path = require('node:path');

const extractS = (input) => {
   const inputSplit = input.split('\n', 1);
   const mapping  = [...input.substring(inputSplit[0].length + 1).matchAll(/(?<srcCategory>\w+)-\w+-(?<destCategory>\w+) map|(?<dest>\d+) (?<src>\d+) (?<range>\d+)/g)];

   const seedsParkour = new Map();
   const seedPos = inputSplit[0].match(/(\d+)/g).map((s) => Number(s));

   let srcCategory;
   let destCategory;
   mapping.forEach((match) => {
      const line = match.groups;

      if(line.srcCategory && line.destCategory) {
         srcCategory = line.srcCategory;
         destCategory = line.destCategory;
         if(seedsParkour.size === 0) {
            seedsParkour.set(srcCategory, [...seedPos]);
            seedsParkour.set(destCategory, []);
         } else {
            if(seedPos.length > 0) {
               seedsParkour.get(srcCategory).push(...seedPos);
            }
            seedPos.length = 0;
            seedPos.push(...seedsParkour.get(srcCategory));
            seedsParkour.set(destCategory, []);
         }
      }

      const src = Number(line.src);
      const dest = Number(line.dest);
      const range = Number(line.range);
      if(src >= 0 && dest >= 0 && range >= 0) {
         const temp = [...seedPos];
         let del = 0;
         for (let i = 0; i < temp.length; i++) {
            if(temp[i] >= src && temp[i] < (src + range)) {
               seedsParkour.get(destCategory).push(temp[i] + (dest - src));
               seedPos.splice(i - del, 1);
               del++;
            }
         }
      }
   });
   seedsParkour.get(destCategory).push(...seedPos);

   return seedsParkour;
}

const extractG = (input) => {
   const inputSplit = input.split('\n', 1);
   const mapping  = [...input.substring(inputSplit[0].length + 1).matchAll(/(?<srcCategory>\w+)-\w+-(?<destCategory>\w+) map|(?<dest>\d+) (?<src>\d+) (?<range>\d+)/g)];

   const seedsParkour = new Map();
   const seedPos = [...inputSplit[0].matchAll(/(\d+) (\d+)/g)].map((arr) => [Number(arr[1]), Number(arr[2])]);

   let srcCategory;
   let destCategory;
   mapping.forEach((match) => {
      const line = match.groups;

      if(line.srcCategory && line.destCategory) {
         srcCategory = line.srcCategory;
         destCategory = line.destCategory;
         if(seedsParkour.size === 0) {
            seedsParkour.set(srcCategory, [...seedPos]);
            seedsParkour.set(destCategory, []);
         } else {
            if(seedPos.length > 0) {
               seedsParkour.get(srcCategory).push(...seedPos);
            }
            seedPos.length = 0;
            seedPos.push(...seedsParkour.get(srcCategory));
            seedsParkour.set(destCategory, []);
         }
      }

      const src = Number(line.src);
      const dest = Number(line.dest);
      const range = Number(line.range);
      if(src >= 0 && dest >= 0 && range >= 0) {
         const temp = [...seedPos];
         let del = 0;
         for (let i = 0; i < temp.length; i++) {
            const src2 = temp[i][0];
            const range2 = temp[i][1];
            if((src + range) > src2 && (src2 + range2) > src) {
               if(src2 < src && (src2 + range2) > src ) seedsParkour.get(destCategory).push([src2 + (dest - src), Math.max(src, src2) - src2]);
               seedsParkour.get(destCategory).push([Math.max(src, src2) + (dest - src), (Math.min(src + range, src2 + range2) - Math.max(src, src2))]);
               if(src2 > src && (src2 + range2) >= (src + range)) seedsParkour.get(destCategory).push([Math.min(src + range, src2 + range2) + (dest - src), src2 + range2]);
               seedPos.splice(i - del, 1);
               del++;
            }
         }
      }
   });
   seedsParkour.get(destCategory).push(...seedPos);
   console.log(seedsParkour);

   return seedsParkour;
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
      console.log(`Response Silver ${filename}: ${Math.min(...extractS(data).get('location'))}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}

const runG = (filename) => {
   const callback = (data) => {
      console.time();
      console.log(`Response Gold ${filename}: ${Math.min(...extractG(data).get('location'))}`);
      console.timeEnd();
   };
   readFile(filename, callback);
}

runS('sample.txt');
runG('sample.txt');
runS('input.txt');
// runG('input.txt');