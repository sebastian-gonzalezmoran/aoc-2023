const fs = require("node:fs");
const path = require("node:path");

const extractS = (input) => {
  const universe = input.replace(/(\r\n|\n|\r)/gm, '');
  const universeWidth = input.indexOf('\n') - 1;
  const universeExpansion = 2;

  const cartX = new Array(universeWidth).fill(universeExpansion);
  const cartY = new Array(universeWidth).fill(universeExpansion);

  const galaxyPositions = [...universe.matchAll(/#/g)].map(v => v.index);
  galaxyPositions.forEach(pos => {
    if(cartX === universeExpansion) cartX[pos % universeWidth] = 1;
    if(cartY === universeExpansion) cartY[pos] = 1; //TODO get line
  });
  //TODO increment cartesian map

  //TODO calculate distances with cartesian map
};

const extractG = (input) => {
  
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
// runG("sample.txt");
// runS("input.txt");
// runG("input.txt");