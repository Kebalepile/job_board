import React, { useReducer } from "react";
import NavContext from "./context";
import PropTypes from "prop-types";
import Reducer from "./reducer";

export default function NavProvider({ children }) {
  const initialState = {
    MENU: false,
    JOBS: false
  };
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { MENU, JOBS } = state;
  const Display = (type) => {
    dispatch({
      type,
      payload: { [type]: !state[type] }
    });
  };
  return (
    <NavContext.Provider
      value={{
        Display,
        JOBS,
        MENU
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

NavProvider.propTypes = {
  children: PropTypes.node.isRequired
};
