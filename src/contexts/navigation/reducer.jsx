import { HOME, MENU, JOBS } from "../types";
export default function Reducer(state, action) {
  switch (action.type) {
    case MENU:
    case JOBS:
      return { ...state, ...action.payload };
    case HOME:
    default:
      return state;
  }
}
