import * as readline from 'node:readline';
import { KeyPressKey, KeyPressListener } from './types';

export default (onKeyPress:KeyPressListener) => {
  const input = process.stdin;
  const rlInterface = readline.createInterface ({ input, escapeCodeTimeout: 50 });
  readline.emitKeypressEvents(input);
  input.setRawMode(true);

  const handler = (str:string, key:KeyPressKey) => {
    if(key.sequence === '\x03') { process.exit(); }
    onKeyPress(str,key);
  }
  input.on('keypress', handler);
  const close = () =>  {
    input.off('keypress', handler);
    rlInterface.close();
  }
  return {
    close,
  }
}
