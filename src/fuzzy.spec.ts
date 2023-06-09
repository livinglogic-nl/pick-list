import { fuzzy } from "./fuzzy";

it('filters out strings that do not contain expected characters in a row', () => {
  expect(fuzzy({
    labelField: 'label',
    choices: [
      { label:'aap' },
      { label:'noot' },
    ],
    needle: 'a',
  }).map(c => c.choice)).toEqual([
    { label:'aap' },
  ])
});

it('prefers strings with matching letters close together', () => {
  expect(fuzzy({
    labelField: 'label',
    choices: [
      { label:'apa' },
      { label:'aap' },
    ],
    needle: 'aa',
  }).map(c => c.choice)).toEqual([
    { label:'aap' },
    { label:'apa' },
  ])
});

it('reports the indexes where matching characters were found', () => {
  expect(fuzzy({
    labelField: 'label',
    choices: [
      { label: 'Give every man thy ear, but few thy voice.' },
      { label: 'Uneasy lies the head that wears the crown.' },
    ],
    needle: 'eyt',
  }).map(c => c.indexes)).toEqual([
      [ 3, 9, 15 ],
      [ 2, 5, 12 ],
  ])
});

it('is case insensitive', () => {
  expect(fuzzy({
    labelField: 'label',
    choices: [
      { label: 'HELLO WORLD' },
      { label: 'hello world' },
    ],
    needle: 'wor',
  }).map(c => c.indexes)).toEqual([
      [ 6,7,8 ],
      [ 6,7,8 ],
  ])
});
