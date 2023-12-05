const fs = require('node:fs');
const path = require('node:path');

const extractS = (input) => {
   let sum = 0;

   const cards = [...input.matchAll(/Card[ ]*(\d+):[ ]*((?:[ ]*\d+)+)[ ]*\|[ ]*((?:[ ]*\d+[ ]*)+)/g)];
   cards.forEach((card) => {
      const winningNumbers = new Set(card[2].replace(/\s{2,}/g, ' ').split(' '));
      const myNumbers = card[3].replace(/\s{2,}/g, ' ').split(' ');

      const n = myNumbers.filter((nbr) => winningNumbers.has(nbr)).length;
      sum += Math.floor(2**(n-1));
   });
   return sum;
}

const extractG = (input) => {
   let sum = 0;

   const cards = [...input.matchAll(/Card[ ]*(\d+):[ ]*((?:[ ]*\d+)+)[ ]*\|[ ]*((?:[ ]*\d+[ ]*)+)/g)];
   const cardsMap = new Map();
   cards.forEach((card) => {
      const cardNr = Number(card[1]);
      const winningNumbers = new Set(card[2].replace(/\s{2,}/g, ' ').split(' '));
      const myNumbers = card[3].replace(/\s{2,}/g, ' ').split(' ');

      let cardRecord = cardsMap.get(cardNr);
      if(!cardRecord) cardsMap.set(cardNr, 1);
      else {
         cardRecord += 1;
         cardsMap.set(cardNr, cardRecord);
      }

      const n = myNumbers.filter((nbr) => winningNumbers.has(nbr)).length;
      for (let i = 1; i < n + 1; i++) {
         const nextCard = cardsMap.get(cardNr + i);
         if(!nextCard) cardsMap.set(cardNr + i, 1 * (cardRecord || 1));
         else {
            cardsMap.set(cardNr + i, nextCard + 1 * (cardRecord || 1));
         }
      }
   });
   
   cardsMap.forEach((value) => {
      sum += value;
   });

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
      console.log(`Response Silver ${filename}: ${extractS(data)}`);
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