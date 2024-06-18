import { PUBLIC, PRIVATE, AGENCYICONS, POSTINFO } from "../types";
export default function Reducer(state, action) {
  switch (action.type) {
    case POSTINFO:
    case AGENCYICONS:
      return { ...state, ...action.payload };
    case PRIVATE:
    case PUBLIC:
    default:
      return state;
  }
}
