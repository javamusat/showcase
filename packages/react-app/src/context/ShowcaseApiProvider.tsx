import React, { useReducer } from "react";

export const ShowcaseApiContext = React.createContext(null);

export const ShowcaseApiProvider: React.FC = ({ children }) => {
  const showcaseApiReducer = (state: any, action: any) => {
    return {
      ...state,
      [action.method]: action.data,
    };
  };

  const [state, dispatch] = useReducer(showcaseApiReducer, {});

  return (
    <ShowcaseApiContext.Provider value={[state, dispatch]}>
      {children}
    </ShowcaseApiContext.Provider>
  );
};
