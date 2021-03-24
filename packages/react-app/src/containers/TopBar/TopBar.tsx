import TwitterLogin from "../../components/TwitterLogin/TwitterLogin";
import React from "react";

import useFirebase from "../../hooks/useFirebase";
import { Header } from "../../components";

const TopBar: React.FC<any> = () => {
  const { firebase } = useFirebase();
  return (
    <Header>
      {firebase.user && <TwitterLogin />}
      <div style={{ marginRight: "2rem" }}>
        {firebase.user ? firebase.user.displayName : ""}
      </div>
    </Header>
  );
};

export default TopBar;
