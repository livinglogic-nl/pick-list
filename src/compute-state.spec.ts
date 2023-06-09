import { useComputeState } from './compute-state';

it('updates needle by adding characters', async() => {
  const computeState = useComputeState({
    label: 'please pick',
    needle: '',
    choiceProvider: async() => [],
    choiceLabel: 'label',
  });
  computeState.onKeyPress('a', {});
  expect(computeState.state.needle).toBe('a');

  computeState.onKeyPress('s', {});
  expect(computeState.state.needle).toBe('as');
});

it('updates needle by removing characters', async() => {
  const computeState = useComputeState({
    label: 'please pick',
    needle: 'as',
    choiceProvider: async() => [],
    choiceLabel: 'label',
  });

  const backspace = () => {
    computeState.onKeyPress('', { name:'backspace' });
  }

  backspace();
  expect(computeState.state.needle).toBe('a');

  backspace();
  expect(computeState.state.needle).toBe('');

  backspace();
  expect(computeState.state.needle).toBe('');
});

it('updates row when pressing down and up', async() => {
  const computeState = useComputeState({
    label: 'please pick',
    needle: 'opt',
    choiceProvider: async() => [ { label:'option a' }, { label:'option b' } ],
    choiceLabel: 'label',
  });

  await new Promise(ok => { setTimeout(ok, 0); });

  computeState.onKeyPress('', { name:'down' });
  expect(computeState.state.row).toBe(1);

  computeState.onKeyPress('', { name:'up' });
  expect(computeState.state.row).toBe(0);

});

