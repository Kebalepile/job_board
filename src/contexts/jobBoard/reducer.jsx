import { PUBLIC, PRIVATE, AGENCYICONS } from "../types";
export default function Reducer(state, action) {
  switch (action.type) {
    case AGENCYICONS:
      return { ...state, AgencyIcons: action.payload };
    case PRIVATE:
    case PUBLIC:
    default:
      return state;
  }
}
