import React, { useReducer } from "react";
import jwt from "jsonwebtoken";

const initial = {
  jwt: null,
  existingAccount: false,
} as any;
export const ShowcaseContext = React.createContext(null);

export const ShowcaseProvider: React.FC = ({ children }) => {
  const showcaseReducer = (state: any, action: any) => {
    switch (action.type) {
      case "setJWT":
        return {
          jwt: action.jwt,
          profile: jwt.verify(action.jwt, process.env.REACT_APP_SECRET),
          existingAccount: action.existingAccount,
          loginFailed: action.loginFailed,
        };
      case "reset":
        return {
          ...initial,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(showcaseReducer, initial);

  return (
    <ShowcaseContext.Provider value={[state, dispatch]}>
      {children}
    </ShowcaseContext.Provider>
  );
};
