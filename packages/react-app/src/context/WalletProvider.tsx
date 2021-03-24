import React, { useReducer } from "react";

const initial = {
  account: null,
  chainId: null,
  contracts: new Map([]),
  provider: null,
} as any;
export const WalletContext = React.createContext(null);

export const WalletProvider: React.FC = ({ children }) => {
  const showcaseReducer = (state: any, action: any) => {
    switch (action.type) {
      case "setContext":
        const newState = {
          provider: action.provider,
          account: action.account,
          chainId: action.chainId,
          contracts: action.contracts,
        };
        // @ts-ignore
        window.showcase = newState;
        return newState;
      case "resetContext":
        const initialState = {
          ...initial,
        };
        // @ts-ignore
        window.showcase = initialState;
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(showcaseReducer, initial);

  return (
    <WalletContext.Provider value={[state, dispatch]}>
      {children}
    </WalletContext.Provider>
  );
};
