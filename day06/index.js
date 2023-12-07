const fs = require("node:fs");
const path = require("node:path");

const extractS = (input) => {
  let mult = 1;
  const split = input.split("\n");

  const times = split[0].match(/(\d+)/g);
  const distances = split[1].match(/(\d+)/g);

  for (let i = 0; i < times.length; i++) {
    const time = Number(times[i]);
    const distance = Number(distances[i]);

    const minTimeToWait = Math.floor(
      (-time + Math.sqrt(time ** 2 - 4 * distance)) / -2
    );
    const maxTimeToWait = Math.ceil(
      (-time - Math.sqrt(time ** 2 - 4 * distance)) / -2
    );

    mult *= maxTimeToWait - minTimeToWait - 1;
  }
  return mult;
};

const extractG = (input) => {
  let mult = 1;
  const split = input.split("\n");

  const time = Number(split[0].match(/(\d+)/g).join(""));
  const distance = Number(split[1].match(/(\d+)/g).join(""));

  const minTimeToWait = Math.floor(
    (-time + Math.sqrt(time ** 2 - 4 * distance)) / -2
  );
  const maxTimeToWait = Math.ceil(
    (-time - Math.sqrt(time ** 2 - 4 * distance)) / -2
  );

  return maxTimeToWait - minTimeToWait - 1;
};

const readFile = (filename, callback) => {
  let data  = fs.readFileSync(path.join(__dirname, filename), "utf8");
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
