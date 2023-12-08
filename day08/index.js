const fs = require("node:fs");
const path = require("node:path");

const extractS = (input) => {
  const pathMap = new Map();

  const instructions = input.split('\n', 1)[0].trim();
  const paths = [...input.matchAll(/([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/g)];

  paths.forEach(path => pathMap.set(path[1], { L: path[2], R: path[3] }));

  let i = 0;
  let node = 'AAA';
  let instructionsIndex = -1;
  while (node !== 'ZZZ') {
    instructionsIndex++;
    if (instructionsIndex >= instructions.length) instructionsIndex = 0;
    node = pathMap.get(node)[instructions[instructionsIndex]];
    i++;
  }
  return i;
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
runS("input.txt");
// runG("input.txt");