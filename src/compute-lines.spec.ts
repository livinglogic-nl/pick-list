import { computeLines } from './compute-lines';

describe('compute lines', () => {
  it('shows a prompt', () => {
    expect(computeLines({
      filtered: [],
      choices: [],
      label: 'please pick',
      needle: '',
    })).toContain('please pick: <cursor/>')
  });

  it('shows a prompt, including needle', () => {
    expect(computeLines({
      filtered: [],
      choices: [],
      label: 'please pick',
      needle: 'a',
    })).toContain('please pick: a<cursor/>')
  });

  it('shows list of matches', () => {
    const lines = computeLines({
      filtered: [
        { label: 'a matching line' },
        { label: 'another match' },
      ],
      choices: [],
      label: 'please pick',
      needle: 'match',
      maxChoicesVisible: 2,
      row: 0,
    });
    expect(lines).toContain('  <inv>a matching line</inv>');
    expect(lines).toContain('  another match');
  });

  it('highlights the matching characters', () => {
    const lines = computeLines({
      filtered: [
        { label: 'a matching line', indexes: [2,3,4,5,6] },
        { label: 'another match', indexes: [8,9,10,11,12] },
      ],
      choices: [],
      label: 'please pick',
      needle: 'match',
      maxChoicesVisible: 2,
      row: 0,
    });
    expect(lines).toContain('  <inv>a <u>match</u>ing line</inv>');
    expect(lines).toContain('  another <u>match</u>');
  });


  it('shows no more than maxChoicesVisible lines', () => {
    const lines = computeLines({
      filtered: [
        { label: 'line 1' },
        { label: 'line 2' },
        { label: 'line 3' },
      ],
      choices: [],
      label: 'please pick',
      needle: 'match',
      maxChoicesVisible: 2,
      row: 0,
    });

    expect(lines).toContain('  <inv>line 1</inv>');
    expect(lines).toContain('  line 2');
    expect(lines).not.toContain('  line 3');
  });

  it('prefers not to scroll', () => {
    const lines = computeLines({
      filtered: [
        { label: 'line 1' },
        { label: 'line 2' },
        { label: 'line 3' },
      ],
      choices: [],
      label: 'please pick',
      needle: 'match',
      maxChoicesVisible: 2,
      row: 1,
    });

    expect(lines).toContain('  line 1');
    expect(lines).toContain('  <inv>line 2</inv>');
    expect(lines).not.toContain('  line 3');
  });

  it('does scroll when necessary', () => {
    const lines = computeLines({
      filtered: [
        { label: 'line 1' },
        { label: 'line 2' },
        { label: 'line 3' },
      ],
      choices: [],
      label: 'please pick',
      needle: 'match',
      maxChoicesVisible: 2,
      row: 2,
    });
    expect(lines).not.toContain('  line 1');
    expect(lines).toContain('  line 2');
    expect(lines).toContain('  <inv>line 3</inv>');
  });
});
