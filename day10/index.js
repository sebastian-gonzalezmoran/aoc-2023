const fs = require("node:fs");
const path = require("node:path");

const checkTop = (position, maze, mazeWidth) => {
  return (position - mazeWidth) >= 0
    && ['|', 'F', '7', 'S'].includes(maze[position - mazeWidth]);
};
const checkRight = (position, maze, mazeWidth) => {
  return (position + 1) % mazeWidth
    && ['-', '7', 'J', 'S'].includes(maze[position + 1]);
};

const checkBottom = (position, maze, mazeWidth) => {
  return (position + mazeWidth) < maze.length
    && ['|', 'L', 'J', 'S'].includes(maze[position + mazeWidth]);
};

const checkLeft = (position, maze, mazeWidth) => {
  return position % mazeWidth
    && ['-', 'F', 'L', 'S'].includes(maze[position - 1]);
};

const findMaxPath = (position, maze, mazeWidth) => {
  let i = 0;
  let prevPosition;

  let minpos = position;
  let maxpos = position;
  let allpos = [];
  do {
    switch(maze[position]) {
      case 'S':
        if(checkTop(position, maze, mazeWidth)) {
          prevPosition = position;
          position = position - mazeWidth;
        }
        else if(checkRight(position, maze, mazeWidth)) {
          prevPosition = position;
          position = position + 1;
        }
        else if(checkBottom(position, maze, mazeWidth)) {
          prevPosition = position;
          position = position + mazeWidth;
        }
        else if(checkLeft(position, maze, mazeWidth)) {
          prevPosition = position;
          position = position - 1;
        }
        break;
      case 'F':
        if(prevPosition === position + 1) {
          if(checkBottom(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position + mazeWidth;
          }
        }
        else {
          if(checkRight(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position + 1;
          }
        }
        break;
      case '-':
        if(prevPosition === position - 1) {
          if(checkRight(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position + 1;
          }
        }
        else {
          if(checkLeft(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position - 1;
          }
        }
        break;
      case '7':
        if(prevPosition ===  position - 1)  {
          if(checkBottom(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position + mazeWidth;
          }
        }
        else {
          if(checkLeft(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position - 1;
          }
        }
        break;
      case '|':
        if(prevPosition === position + mazeWidth) {
          if(checkTop(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position - mazeWidth;
          }
        }
        else {
          if(checkBottom(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position + mazeWidth;
          }
        }
        break;
      case 'J':
        if(prevPosition === position - 1) {
          if(checkTop(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position - mazeWidth;
          }
        }
        else {
          if(checkLeft(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position - 1;
          }
        }
        break;
      case 'L':
        if(prevPosition === position + 1) {
          if(checkTop(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position - mazeWidth;
          }
        }
        else {
          if(checkRight(position, maze, mazeWidth)) {
            prevPosition = position;
            position = position + 1;
          }
        }
        break;
      default:
        throw new Error('Pipe does not exist');
    }
    i++;
    if(minpos > position) minpos = position;
    if(maxpos < position) maxpos = position;
    allpos.push(position);
  } while(maze[position] !== 'S');

  return [i, minpos, maxpos, allpos.sort((a,b) => a-b)];
};

const extractS = (input) => {
  const maze = input.replace(/(\r\n|\n|\r)/gm, '');
  const mazeWidth = input.indexOf('\n') - 1;
  const startPosition = maze.indexOf('S');

  return Math.ceil(findMaxPath(startPosition, maze, mazeWidth)[0] / 2);
};

const extractG = (input) => {
  const maze = input.replace(/(\r\n|\n|\r)/gm, '');
  const mazeWidth = input.indexOf('\n') - 1;
  const startPosition = maze.indexOf('S');

  const tuple = findMaxPath(startPosition, maze, mazeWidth);
  const minpos = tuple[1] - (tuple[1] % mazeWidth);
  const maxpos = tuple[2] - (tuple[2] % mazeWidth);
  const allpos = tuple[3];
  
  let tiles = 0;
  let circTitle = allpos.shift();
  let isBetween = false;
  for (let i = minpos; i < maxpos && allpos.length > 0; i++) {
    if(i === circTitle) {
      if(!isBetween) {
        switch(maze[i]){
          case 'S':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = true;
            break;
          case 'F':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = true;
            break;
          case '|':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = true;
            break;
          case '7':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = true;
            break;
        }
      } else {
        switch(maze[i]){
          case 'S':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = false;
            break;
          case 'F':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = false;
            break;
          case '|':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = false;
            break;
          case '7':
            if(['|','L','J','L','S'].includes(maze[i + mazeWidth]) && allpos.includes(i + mazeWidth)) isBetween = false;
            break;
        }
      }
      circTitle = allpos.shift();
    } else if(isBetween) {
      tiles++;
    }
  }
  return tiles;
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