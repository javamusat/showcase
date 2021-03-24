import { auth } from "../services/firebase";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const useTwitterAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    auth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        return setIsAuthenticated(true);
      }
      history.push("/");

      // TODO find out what changed.. user is null shortly after authentication (all of the sudden)
      // return setIsAuthenticated(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isAuthenticated;
};

export default useTwitterAuthentication;
