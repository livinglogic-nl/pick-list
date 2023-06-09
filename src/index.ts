import useRenderLines from './use-render-lines';
import { computeLines } from './compute-lines';
import enableKeyPressEvents from './enable-key-press-events';
import { Choice, ChoiceProvider, PickListOptions, RenderState } from './types';
import { useComputeState } from './compute-state';

const _pickList = (options:PickListOptions) => new Promise((ok,fail) => {
  const { label } = options;
  const computeState = useComputeState({
    label,
    needle: '',
    choiceProvider: options.choiceProvider,
    choiceLabel: options.choiceLabel,
    maxChoicesVisible: options.maxChoicesVisible ?? 25,
  });

  const { close } = enableKeyPressEvents(computeState.onKeyPress);
  const renderLines = useRenderLines(process.stdout);

  const onChange = (state:RenderState) => {
    if(state.done) {
      close();
      renderLines(null);
      if(state.pick) {
        ok(state.pick.choice);
      } else {
        fail('cancel');
      }
      return;
    }
    const lines = computeLines(state);
    renderLines(lines);
  }
  computeState.on('change', onChange);
});

export const pickList =  async(prompt:string, choices:any[]|ChoiceProvider, answerKey?:string) => {
  const maxChoicesVisible = 25;

  const options = {
    label: prompt,
    maxChoicesVisible,
  }
  if(Array.isArray(choices)) {
    if(typeof(choices[0]) === 'string') {
      const result = await _pickList({
        ...options,
        choiceProvider: async() => choices.map(name => ({ name })),
        choiceLabel: 'name',
      }) as any
      return result.name;
    } else {
      const result = await _pickList({
        ...options,
        choiceProvider: async() => choices as Choice[],
        choiceLabel: answerKey,
      }) as any
      return result;
    }
  } else if(typeof(choices) === 'function') {
    const result = await _pickList({
      ...options,
      choiceProvider: choices,
      choiceLabel: answerKey,
    }) as any
    return result;
  }
}
