import { EventEmitter } from "node:events";

export interface Choice extends Record<string,any> {
}

export interface FilteredChoice extends Choice {
  indexes?:number[];
}

export interface RenderState {
  label:string;
  needle:string;

  choices:Choice[];
  filtered:FilteredChoice[];
  row?:number;
  maxChoicesVisible?:number;

  pick?:Choice;
  done?:boolean;

  busy?:number;
}

export interface KeyPressKey {
  sequence?: string;
  name?: string;
}

export interface ComputeStateOptions {
  label:string;
  needle:string;
  choiceProvider:ChoiceProvider;
  choiceLabel:string;
  maxChoicesVisible?:number;
}

export type KeyPressListener = (str:string, key:KeyPressKey) => void;

export class ComputeState extends EventEmitter {
  state:RenderState;
  onKeyPress:KeyPressListener;
}

export type ChoiceProvider = (needle:string) => Promise<Choice[]>

export interface PickListOptions {
  label:string;
  choiceProvider:ChoiceProvider;
  choiceLabel:string;
  maxChoicesVisible: number;
}

