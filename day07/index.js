const fs = require("node:fs");
const path = require("node:path");


const extractS = (input) => {
  const cardsRank = new Map([['A', 13], ['K', 12], ['Q', 11], ['J', 10], ['T', 9], ['9', 8], ['8', 7], ['7', 6], ['6', 5], ['5', 4], ['4', 3], ['3', 2], ['2', 1]]);
  const rankSort = (a, b) => {
    const aCards = a[0];
    const bCards = b[0];
    let i = 0;
    while (aCards[i] === bCards[i] && i < 4) i++;

    return i > 4 ? 0 : cardsRank.get(aCards[i]) < cardsRank.get(bCards[i]) ? -1 : 1;
  }

  let sum = 0;
  const rank = [];

  const fiveOfKind = [];
  const fourOfKind = [];
  const fullHouse = [];
  const threeOfKind = [];
  const twoPair = [];
  const onePair = [];
  const highCard = [];

  const arr = [...input.matchAll(/(?<cards>[2-9AKQJT]{5}) (?<bet>\d+)/g)];
  arr.forEach((line) => {
    const cards = line.groups.cards;
    const bet = Number(line.groups.bet);

    //OPTIMIZE? PROBABLY MATHS
    const sortedCards = cards.split('').sort();
    if (sortedCards[0] === sortedCards[4]) { //FIVE OF A KIND XXXXX
      fiveOfKind.push([cards, bet]);
    }
    else if (sortedCards[0] === sortedCards[3] || sortedCards[1] === sortedCards[4]) { //FOUR OF KIND XXXXY YXXXX
      fourOfKind.push([cards, bet]);
    }
    else if (sortedCards[0] === sortedCards[2]) { //THREE OF KIND OR FULLHOUSE XXXYY
      if (sortedCards[3] === sortedCards[4]) fullHouse.push([cards, bet]);
      else threeOfKind.push([cards, bet]);
    }
    else if (sortedCards[2] === sortedCards[4]) { //THREE OF KIND OR FULLHOUSE YYXXX
      if (sortedCards[0] === sortedCards[1]) fullHouse.push([cards, bet]);
      else threeOfKind.push([cards, bet]);
    }
    else if (sortedCards[1] === sortedCards[3]) { //THREE OF KIND YXXXY
      threeOfKind.push([cards, bet]);
    }
    else if (
      (sortedCards[0] === sortedCards[1] && (sortedCards[2] === sortedCards[3] || sortedCards[3] === sortedCards[4])) || //TWO PAIRS XXYYZ XXZYY
      (sortedCards[1] === sortedCards[2] && sortedCards[3] === sortedCards[4]) //TWO PAIRS ZXXYY
    ) {
      twoPair.push([cards, bet]);
    }
    else if (
      sortedCards[0] === sortedCards[1] || //ONE PAIR XXYYY 
      sortedCards[1] === sortedCards[2] || //ONE PAIR YXXYY
      sortedCards[2] === sortedCards[3] || //ONE PAIR YYXXY
      sortedCards[3] === sortedCards[4] //ONE PAIR YYYXX
    ) {
      onePair.push([cards, bet]);
    }
    else { //FLUSH
      highCard.push([cards, bet]);
    }
  });

  rank.push(...highCard.sort(rankSort));
  rank.push(...onePair.sort(rankSort));
  rank.push(...twoPair.sort(rankSort));
  rank.push(...threeOfKind.sort(rankSort));
  rank.push(...fullHouse.sort(rankSort));
  rank.push(...fourOfKind.sort(rankSort));
  rank.push(...fiveOfKind.sort(rankSort));

  rank.forEach((v, i) => {
    sum += v[1] * (i + 1);
  });
  return sum;
};

const extractG = (input) => {
  const cardsRank = new Map([['A', 13], ['K', 12], ['Q', 11], ['T', 10], ['9', 9], ['8', 8], ['7', 7], ['6', 6], ['5', 5], ['4', 4], ['3', 3], ['2', 2], ['J', 1]]);
  const rankSort = (a, b) => {
    const aCards = a[0];
    const bCards = b[0];
    let i = 0;
    while (aCards[i] === bCards[i] && i < 4) i++;
    return i > 4 ? 0 : cardsRank.get(aCards[i]) < cardsRank.get(bCards[i]) ? -1 : 1;
  }

  let sum = 0;
  const rank = [];

  const fiveOfKind = [];
  const fourOfKind = [];
  const fullHouse = [];
  const threeOfKind = [];
  const twoPair = [];
  const onePair = [];
  const highCard = [];

  const arr = [...input.matchAll(/(?<cards>[2-9AKQJT]{5}) (?<bet>\d+)/g)];
  arr.forEach((line) => {
    const cards = line.groups.cards;
    const bet = Number(line.groups.bet);

    const sortedCards = cards.split('').sort();
    if (sortedCards[0] === sortedCards[4]) { //FIVE OF A KIND XXXXX
      fiveOfKind.push([cards, bet]);
    }
    else if(sortedCards[0] === sortedCards[3]) { //FOUR OF KIND XXXXY
      if (sortedCards[0] === 'J' || sortedCards[4] === 'J')
        fiveOfKind.push([cards, bet]);
      else 
        fourOfKind.push([cards, bet]);
    }
    else if (sortedCards[1] === sortedCards[4]) { //FOUR OF KIND YXXXX
      if (sortedCards[0] === 'J' || sortedCards[4] === 'J')
        fiveOfKind.push([cards, bet]);
      else 
        fourOfKind.push([cards, bet]);
    }
    else if (sortedCards[0] === sortedCards[2]) { //THREE OF KIND OR FULLHOUSE XXXYY
      if (sortedCards[3] === sortedCards[4]) { //FULLHOUSE
        if (sortedCards[0] === 'J' || sortedCards[4] === 'J')
          fiveOfKind.push([cards, bet]);
        else
          fullHouse.push([cards, bet]);
      }
      else { //THREE OF A KIND
        if (sortedCards[0] === 'J' || sortedCards[3] === 'J' || sortedCards[4] === 'J')
          fourOfKind.push([cards, bet]);
        else
          threeOfKind.push([cards, bet]);
      }
    }
    else if (sortedCards[2] === sortedCards[4]) { //THREE OF KIND OR FULLHOUSE YYXXX
      if (sortedCards[0] === sortedCards[1]) { //FULLHOUSE
        if (sortedCards[0] === 'J' || sortedCards[4] === 'J')
          fiveOfKind.push([cards, bet]);
        else
          fullHouse.push([cards, bet]);
      }
      else { //THREE OF A KIND
        if (sortedCards[0] === 'J' || sortedCards[1] === 'J' || sortedCards[4] === 'J')
          fourOfKind.push([cards, bet]);
        else
          threeOfKind.push([cards, bet]);
      }
    }
    else if (sortedCards[1] === sortedCards[3]) { //THREE OF KIND YXXXZ
      if (sortedCards[0] === 'J' || sortedCards[1] === 'J' || sortedCards[4] === 'J')
        fourOfKind.push([cards, bet]);
      else
        threeOfKind.push([cards, bet]);
    }
    else if (sortedCards[0] === sortedCards[1] && sortedCards[2] === sortedCards[3]) { //TWO PAIRS XXYYZ
      if (sortedCards[0] === 'J' || sortedCards[2] === 'J')
        fourOfKind.push([cards, bet]);
      else if (sortedCards[4] === 'J')
        fullHouse.push([cards, bet]);
      else
        twoPair.push([cards, bet]);
    }
    else if (sortedCards[0] === sortedCards[1] && sortedCards[3] === sortedCards[4]) { //TWO PAIRS XXZYY
      if (sortedCards[0] === 'J' || sortedCards[3] === 'J')
        fourOfKind.push([cards, bet]);
      else if (sortedCards[2] === 'J')
        fullHouse.push([cards, bet]);
      else
        twoPair.push([cards, bet]);
    }
    else if (sortedCards[1] === sortedCards[2] && sortedCards[3] === sortedCards[4]) { //TWO PAIRS ZXXYY
      if (sortedCards[1] === 'J' || sortedCards[3] === 'J')
        fourOfKind.push([cards, bet]);
      else if (sortedCards[0] === 'J')
        fullHouse.push([cards, bet]);
      else
        twoPair.push([cards, bet]);
    }
    else if (sortedCards[0] === sortedCards[1]) { //ONE PAIR XXYYY
      if (sortedCards[0] === 'J' || sortedCards[2] === 'J' || sortedCards[3] === 'J' || sortedCards[4] === 'J')
        threeOfKind.push([cards, bet]);
      else
        onePair.push([cards, bet]);
    }
    else if (sortedCards[1] === sortedCards[2]) { //ONE PAIR YXXYY
      if (sortedCards[0] === 'J' || sortedCards[1] === 'J' || sortedCards[3] === 'J' || sortedCards[4] === 'J')
        threeOfKind.push([cards, bet]);
      else
        onePair.push([cards, bet]);
    }
    else if (sortedCards[2] === sortedCards[3]) { //ONE PAIR YYXXY
      if (sortedCards[0] === 'J' || sortedCards[1] === 'J' || sortedCards[2] === 'J' || sortedCards[4] === 'J')
        threeOfKind.push([cards, bet]);
      else
        onePair.push([cards, bet]);
    }
    else if (sortedCards[3] === sortedCards[4]) { //ONE PAIR YYYXX
      if (sortedCards[0] === 'J' || sortedCards[1] === 'J' || sortedCards[2] === 'J' || sortedCards[3] === 'J')
        threeOfKind.push([cards, bet]);
      else
        onePair.push([cards, bet]);
    }
    else { //FLUSH
      if (sortedCards[0] === 'J' || sortedCards[1] === 'J' || sortedCards[2] === 'J' || sortedCards[3] === 'J' || sortedCards[4] === 'J')
        onePair.push([cards, bet]);
      else
        highCard.push([cards, bet]);
    }
  });

  rank.push(...highCard.sort(rankSort));
  rank.push(...onePair.sort(rankSort));
  rank.push(...twoPair.sort(rankSort));
  rank.push(...threeOfKind.sort(rankSort));
  rank.push(...fullHouse.sort(rankSort));
  rank.push(...fourOfKind.sort(rankSort));
  rank.push(...fiveOfKind.sort(rankSort));

  rank.forEach((v, i) => {
    sum += v[1] * (i + 1);
  });
  return sum;
};

const readFile = (filename, callback) => {
  let data = fs.readFileSync(path.join(__dirname, filename), "utf8");
  callback(data);
};

const runS = (filename) => {
  const callback = (data) => {
    console.time();
    console.log(`Response Silver ${filename}: ${extractS(data)}`);
    console.timeEnd();
  };
  readFile(filename, callback);
};

const runG = (filename) => {
  const callback = (data) => {
    console.time();
    console.log(`Response Gold ${filename}: ${extractG(data)}`);
    console.timeEnd();
  };
  readFile(filename, callback);
};

runS("sample.txt");
runG("sample.txt");
runS("input.txt");
runG("input.txt");