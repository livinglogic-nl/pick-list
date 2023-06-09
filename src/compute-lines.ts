import { RenderState } from './types';
const underline = (str:string, indexes?:number[]) => {
  if(indexes === undefined) { return str; }

  let result = '';
  let c = 0;
  for(let i=0; i<indexes.length; i++) {
    const idx = indexes[i];
    result += str.substring(c, idx);
    result += '<u>' + str.substring(idx, idx+1) + '</u>';
    c = idx+1;
  }
  result += str.substring(c);
  return result.replace(/<\/u><u>/g, '');

}



export const computeLines = (state:RenderState) => {
  const { maxChoicesVisible } = state;
  const busy = state.busy > 0 ? '±' : ' ';
  const lines = [
    `${state.label}: ${state.needle}<cursor/>`,
    `${state.filtered.length} results ${busy}`,
  ];

  let sliceStart = 0;
  let sliceEnd = sliceStart + maxChoicesVisible;

  if(state.row >= sliceEnd) {
    sliceEnd = state.row + 1;
    sliceStart = sliceEnd - maxChoicesVisible;
  }

  state.filtered.slice(sliceStart, sliceEnd).forEach((filteredChoice,i) => {
    let line = underline(filteredChoice.label, filteredChoice.indexes);
    if(sliceStart + i === state.row) {
      line = `<inv>${line}</inv>`;
    }
    lines.push(`  ${line}`);
  });
  return lines;
}
