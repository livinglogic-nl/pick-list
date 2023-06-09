import { fuzzy } from './fuzzy';
import { ComputeState, ComputeStateOptions, KeyPressKey, RenderState } from './types';
import { emitBusyUpdates } from './emit-busy-updates';

export const useComputeState = (options:ComputeStateOptions):ComputeState => {
  const computeState = new ComputeState();

  let firstNeedleWithLimitedChoices:string|null = null;
  const maxChoicesVisible = options.maxChoicesVisible ?? 25;


  const renderState:RenderState = {
    needle: options.needle,
    label: options.label,
    filtered: [],
    row: 0,
    maxChoicesVisible,

    pick: null,
    done: false,
    choices: [],
    busy: 0,
  }

  const constrainRow = () => {
    renderState.row = Math.max(0, Math.min(renderState.filtered.length-1, renderState.row));
  }

  const needsChoiceUpdate = (nv:RenderState,ov:RenderState) => {
    if(ov === null) { return true; }
    if(ov.needle === nv.needle) { return false; }
    if(nv.needle.startsWith(firstNeedleWithLimitedChoices)) {
      return false;
    }
    return true;
  }

  const updateFiltered = () => {
    renderState.filtered = fuzzy({
      needle: renderState.needle,
      choices: renderState.choices,
      labelField:options.choiceLabel,
    });
    constrainRow();
    computeState.emit('change', renderState);
  }

  let choiceCancel:Function = () => {};
  const updateChoices = async(needle:string) => {
    firstNeedleWithLimitedChoices = null;
    choiceCancel();

    const cancel = new Promise(ok => {
      choiceCancel = () => {
        ok(null);
      }
    });

    renderState.busy++;
    emitBusyUpdates(renderState, computeState);

    const choices:any = await Promise.race([
      cancel,
      options.choiceProvider(needle),
    ]);

    renderState.busy--;
    emitBusyUpdates(renderState, computeState);

    if(choices !== null) {
        renderState.choices = choices;
        if(!firstNeedleWithLimitedChoices && choices.length < maxChoicesVisible) {
          firstNeedleWithLimitedChoices = needle;
        }
        updateFiltered();
    }
  }

  const onStateUpdate = async(nv:RenderState, ov:RenderState) => {
    if(needsChoiceUpdate(nv,ov)) {
      updateChoices(nv.needle);
    }
    if(!ov || nv.needle !== ov.needle) {
      updateFiltered();
    } else {
      constrainRow();
      computeState.emit('change', renderState);
    }
  }

  const keymap:Record<string,Function> = {
    backspace: () => {
      if(renderState.needle.length > 0) {
        renderState.needle = renderState.needle.substring(0,renderState.needle.length-1);
      }
    },
    up: () => {
      renderState.row--;
    },
    down: () => {
      renderState.row++;
    },
    return: () => {
      renderState.pick = renderState.filtered[renderState.row];
      renderState.done = true;
    },
    escape: () => {
      renderState.done = true;
    },
  }

  computeState.onKeyPress = (str:string, key:KeyPressKey) => {
    const oldState = { ...renderState }
    const func = keymap[key.name];
    if(func) {
      func();
    } else if(str.length === 1) {
      renderState.needle += str;
    }
    onStateUpdate(renderState, oldState);
  }
  computeState.state = renderState;
  onStateUpdate(renderState, null);

  return computeState;
}

