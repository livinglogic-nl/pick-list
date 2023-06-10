import { pickList } from '../../dist/mjs/index.js';
import { autoType } from '../auto-type.mjs';

autoType([
  { name:'down' },
  { name:'down' },
  's',
  { name:'return' },
]);

try {
  const answer = await pickList('favourite food', [
    { foodName:'pizza' },
    { foodName:'sushi' },
    { foodName:'spaghetti' },
    { foodName:'lasagna' },
    { foodName:'babi pangang' },
  ], 'foodName');
  console.log(answer); // { foodName: 'sushi' }
} catch(e) {
}
