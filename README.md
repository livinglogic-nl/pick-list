# pick-list
Pick an item from a list in the terminal.


## Features:
- fuzzy matching algorithm
- intelligent lazy choice loading

## Install
```sh
npm install pick-list
```


## Usage


### choices as a string array

```js
import { pickList } from 'pick-list';

const answer = await pickList('favourite food', [
  'pizza',
  'sushi',
  'spaghetti',
  'lasagna',
  'babi pangang',
]);

console.log(answer); // pizza
```

### choices as a complex array

```js
import pickList from 'pick-list';

const answer = await pickList('favourite food', [
  { foodName:'pizza' },
  { foodName:'sushi' },
  { foodName:'spaghetti' },
  { foodName:'lasagna' },
  { foodName:'babi pangang' },
], 'foodName');

console.log(answer);
```
