import { pickList } from '../../dist/mjs/index.js';
import { quotes } from '../quotes.mjs';
import { autoType } from '../auto-type.mjs';

autoType([
  'f', 'l', 'y', ' ', 'u', 'p',
  { name:'backspace' },
  { name:'backspace' },
  { name:'backspace' },
  { name:'return' },
]);

try {
  const quote = await pickList('favourite quote', async(needle) => {
    await new Promise(ok => setTimeout(ok, 200));
    return quotes.filter(q => q.text.match(new RegExp(needle,'i')));
  },'text');
  console.log(quote);
} catch(e) {
  console.log(e);
}
