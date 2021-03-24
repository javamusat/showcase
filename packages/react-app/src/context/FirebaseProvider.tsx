import React, { useReducer } from "react";

const initial = {
  user: null,
  credential: null,
  additionalUserInfo: null,
} as any;
export const FirebaseContext = React.createContext(null);

export const FirebaseProvider: React.FC = ({ children }) => {
  const firebaseReducer = (state: any, action: any) => {
    switch (action.type) {
      case "login":
        return {
          credential: action.credential,
          additionalUserInfo: action.additionalUserInfo,
          user: action.user,
        };
      case "logout":
        return {
          ...initial,
        };
      case "currentUser":
        return action.user
          ? {
              ...state,
              user: action.user,
            }
          : {
              ...initial,
            };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(firebaseReducer, initial);

  return (
    <FirebaseContext.Provider value={[state, dispatch]}>
      {children}
    </FirebaseContext.Provider>
  );
};
