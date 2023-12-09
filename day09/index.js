const fs = require("node:fs");
const path = require("node:path");

const getNextSequence = (seq) => {
  let allZeroes = true;
  let newSeq = [];
  let  diff;
  for (let i = 1; i < seq.length; i++) {
    diff = seq[i] - seq[i-1];
    allZeroes = allZeroes && (diff === 0);
    newSeq.push(diff);
  }
  if(!allZeroes) {
    let next = getNextSequence(newSeq);
    return seq[seq.length - 1] + next;
  }
  else return seq[seq.length - 1];
}

const extractS = (input) => {
  let sum = 0;
  
  const lines = input.split('\n');
  lines.forEach(line => {
    const sequence =  line.split(' ').map(v => Number(v));
    const nexNode = getNextSequence(sequence);
    sum += nexNode;
  });
  return sum;
};

const extractG = (input) => {
  let sum = 0;
  
  const lines = input.split('\n');
  lines.forEach(line => {
    const sequence =  line.split(' ').map(v => Number(v)).reverse();
    const nexNode = getNextSequence(sequence);
    sum += nexNode;
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