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

### supply choices as string array
```ts
import { pickList } from 'pick-list';

try {
  const answer = await pickList('favourite food', [
    'pizza',
    'sushi',
    'spaghetti',
    'lasagna',
    'babi pangang',
  ]);
  console.log(answer); // babi pangang
} catch(e) {
}

```

### supply choices as complex array
```ts
import { pickList } from 'pick-list';

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

```

### supply choices with async function
```ts
import { pickList } from 'pick-list';
import { quotes } from '../quotes.mjs';

try {
  const quote = await pickList('favourite quote', async(needle) => {
    await new Promise(ok => setTimeout(ok, 200));
    return quotes.filter(q => q.text.match(new RegExp(needle,'i')));
  },'text');
  console.log(quote); // { text: 'Action is eloquence.' }
} catch(e) {
}

```

