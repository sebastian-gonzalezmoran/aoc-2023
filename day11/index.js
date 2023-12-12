const fs = require("node:fs");
const path = require("node:path");

const extract = (input, expansion) => {
  let sum = 0;

  const universe = input.replace(/(\r\n|\n|\r)/gm, "");
  const universeWidth = input.indexOf("\n");
  const universeExpansion = expansion;

  const cartX = new Array(universeWidth).fill(universeExpansion);
  const cartY = new Array(universeWidth).fill(universeExpansion);

  const galaxyPositions = [...universe.matchAll(/#/g)].map((v) => v.index);
  galaxyPositions.forEach((pos) => {
    if (cartX[pos % universeWidth] === universeExpansion)
      cartX[pos % universeWidth] = 1;
    if (cartY[Math.floor(pos / universeWidth)] === universeExpansion)
      cartY[Math.floor(pos / universeWidth)] = 1;
  });

  let inc = 0;
  for (let i = 0; i < cartX.length; i++) {
    if (cartX[i] === universeExpansion) {
      inc += universeExpansion;
      cartX[i] = inc;
    } else {
      cartX[i] = cartX[i] + inc;
      inc++;
    }
  }
  inc = 0;
  for (let i = 0; i < cartY.length; i++) {
    if (cartY[i] === universeExpansion) {
      inc += universeExpansion;
      cartY[i] = inc;
    } else {
      cartY[i] = cartY[i] + inc;
      inc++;
    }
  }

  for (let i = 0; i < galaxyPositions.length; i++) {
    for (let j = i + 1; j < galaxyPositions.length; j++) {
      const G1X = cartX[galaxyPositions[i] % universeWidth];
      const G1Y = cartY[Math.floor(galaxyPositions[i] / universeWidth)];
      const G2X = cartX[galaxyPositions[j] % universeWidth];
      const G2Y = cartY[Math.floor(galaxyPositions[j] / universeWidth)];

      const XDiff = Math.abs(G1X - G2X);
      const YDiff = Math.abs(G1Y - G2Y);

      sum += XDiff + YDiff;
    }
  }
  return sum;
};

const readFile = (filename, callback) => {
  let data = fs.readFileSync(path.join(__dirname, filename), "utf8");
  callback(data);
};

const runS = (filename) => {
  const callback = (data) => {
    console.time();
    console.log(`Response Silver ${filename}: ${extract(data, 2)}`);
    console.timeEnd();
  };
  readFile(filename, callback);
};

const runG = (filename) => {
  const callback = (data) => {
    console.time();
    console.log(`Response Gold ${filename}: ${extract(data, 1000000)}`);
    console.timeEnd();
  };
  readFile(filename, callback);
};

runS("sample.txt");
runG("sample.txt");
runS("input.txt");
runG("input.txt");
