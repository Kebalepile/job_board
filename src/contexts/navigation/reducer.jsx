import { HOME, MENU, JOBS, OPPORTUNITY, ABOUTPLATFORM } from "../types";

export default function Reducer(state, action) {
  switch (action.type) {
    case MENU:
    case JOBS:
    case OPPORTUNITY:
    case ABOUTPLATFORM:
      return { ...state, ...action.payload };
    case HOME:
    default:
      return state;
  }
}
