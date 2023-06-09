import { WriteStream } from 'tty';

const trimLine = (str:string, max:number) => {
  if(str.length <= max) { return str; }

  if(!str.includes('<')) {
    return str.substring(0,max);
  }

  let count = 0;
  const parts = str.split('<');

  let result = '';
  parts.forEach(part => {
    let [tag,text] = part.split('>');
    if(text === undefined) {
      text = tag;
      tag = '';
    }
    if(tag.length) {
      if(text !== undefined) {
        result += `<${tag}>`
      }
    }
    if(text) {
      const room = max - count;
      const piece = room >= text.length ? text : text.substring(0,room);
      count += piece.length;
      result += piece;
    }
  });
  return result;
}

const CURSOR_TAG = '<cursor/>';

const processInverse = (line:string) => line.replace(/<inv>/g, '\x1b[7m').replace(/<\/inv>/g, '\x1b[27m');
const processUnderline = (line:string) => line.replace(/<u>/g, '\x1b[4m').replace(/<\/u>/g, '\x1b[24m');

let busyIndex = -1;
const busyFrames = [ '⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷' ]
const processBusy = (line:string) => {
  if(!line.includes('±')) { return line; }
  busyIndex++;

  return line.replace('±', busyFrames[busyIndex%busyFrames.length]);
}


export default (output:WriteStream) => {
  let prevLines:string[] = [];
  const [ maxColumns ] = output.getWindowSize() ?? [ 80 ];

  let cursor = {
    row: 0,
    col: 0,
  }
  let resetLine = 0;
  return (lines:string[]|null) => {
    if(lines === null) {
      output.write('\x1b[2K'); // clear line of current prompt
      const clearLines = prevLines.length;
      for(let i=0; i<clearLines; i++) {
        output.write('\x1b[1E'); // move down a line
        output.write('\x1b[2K'); // erase content of this line
      }
      output.write('\x1b[' + clearLines + 'F'); // move back up
      return;
    }
    if(resetLine !== 0) {
      output.write('\x1b[' + resetLine + 'F');
    }

    const numRows = Math.max(lines.length, prevLines.length);
    for(let i=0; i<numRows; i++) {
      output.write('\x1b[1G\x1b[K');
      if(i >= lines.length) {
        output.write('\n');
        continue;
      }
      let line = lines[i];
      if(line.includes(CURSOR_TAG)) {
        cursor.row = i;
        cursor.col = line.indexOf(CURSOR_TAG);
        line = line.replace(CURSOR_TAG, '');
      }
      line = trimLine(line,maxColumns);
      line = processInverse(line);
      line = processUnderline(line);
      line = processBusy(line);
      output.write(line + '\n');
    }

    // move cursor
    output.write('\x1b[' + (numRows-cursor.row) + 'F');
    output.write('\x1b[' + (cursor.col) + 'C');
    prevLines = lines.concat();

    resetLine = cursor.row;
  }
}


