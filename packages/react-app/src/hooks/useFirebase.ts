import { useContext } from "react";
import { FirebaseContext } from "../context/FirebaseProvider";

const useFirebase = () => {
  const [firebase, dispatchFb] = useContext(FirebaseContext);
  return { firebase, dispatchFb };
};

export default useFirebase;
