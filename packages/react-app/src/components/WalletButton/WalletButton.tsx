import React from "react";
import { Button } from "../index";

const WalletButton: React.FC<any> = ({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
}: any) => {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect with Metamask" : "Disconnect Wallet"}
    </Button>
  );
};

export default WalletButton;
