import TwitterLogin from "../../components/TwitterLogin/TwitterLogin";
import React from "react";

import useFirebase from "../../hooks/useFirebase";

const SideBar: React.FC<any> = () => {
  const { firebase } = useFirebase();
  return (
    <div
      style={{
        flex: "2",
        backgroundColor: "darkgray",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ margin: "2rem" }}>
        {firebase.user ? JSON.stringify(firebase.user, null, 2) : ""}
      </div>
    </div>
  );
};

export default SideBar;
