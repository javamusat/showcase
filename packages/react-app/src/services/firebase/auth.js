import firebase from "./firebase";

export const getAuth = () => {
  return firebase.auth();
};

export const twitterOAuth = () => {
  return new firebase.firebase_.auth.TwitterAuthProvider();
};
