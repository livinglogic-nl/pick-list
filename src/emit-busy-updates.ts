import { ComputeState, RenderState } from "./types";

let interval:any = 0;
export const emitBusyUpdates = (renderState: RenderState, computeState: ComputeState) => {
  const needsUpdates = renderState.busy > 0;
  if(needsUpdates && interval === 0) {
    interval = setInterval(() => {
      computeState.emit('change', renderState);
    }, 80);
  } else if(!needsUpdates && interval !== 0) {
    clearInterval(interval);
    interval = 0;
  }
}

