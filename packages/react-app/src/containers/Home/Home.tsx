import React, { useState } from "react";
import { Body, Button, Image } from "../../components";
import logo from "../../assets/img/ethereumLogo.png";

import { sendTransaction } from "../../utils/contractTxs";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import useWalletProvider from "../../hooks/useWalletProvider";
import useTransaction from "../../hooks/useTransaction";
import useShowcaseApi from "../../hooks/useShowcaseApi";

async function getBalance(contracts: Map<string, Contract>, account: string) {
  const ppdexContract = contracts.get("PPDEX");
  const balance = await ppdexContract.balanceOf(account);
  return balance.toString();
}

async function sendSomething(
  contracts: Map<string, Contract>,
  dispatch: any,
  provider: Web3Provider
) {
  const ppdexContract = contracts.get("PPDEX");
  return sendTransaction(
    provider,
    () => ppdexContract.stakePpblz(100),
    dispatch
  );
}

const Home: React.FC<any> = () => {
  const { wallet } = useWalletProvider();
  const { transaction, dispatchTx } = useTransaction();

  const { apiData, fetchApiData } = useShowcaseApi();
  const [loading, setLoading] = useState([]);
  const [balance, setBalance] = useState(null);

  return (
    <Body>
      <Image src={logo} alt="showcase-logo" />
      <div style={{ height: "2rem" }} />
      <Button
        disabled={!wallet.provider}
        onClick={() =>
          getBalance(wallet.contracts, wallet.account).then((result) =>
            setBalance(result)
          )
        }
      >
        Get Balance
      </Button>
      <div>Your PPDEX balance: {balance || "No data"}</div>
      <div style={{ height: "2rem" }} />
      <Button
        disabled={!wallet.provider}
        onClick={() => {
          setLoading([...loading, "test"]);
          sendSomething(
            wallet.contracts,
            dispatchTx,
            wallet.provider
          ).finally(() =>
            setLoading(loading.filter((item) => item === "test"))
          );
        }}
      >
        {loading.find((item) => item === "test")
          ? "Sending..."
          : "Send Transaction"}
      </Button>
      <div>
        <div style={{ fontWeight: "bold" }}> Transaction details: </div>
        {transaction && transaction.id ? (
          <p>{JSON.stringify(transaction)}</p>
        ) : (
          <span>
            {transaction.error
              ? JSON.stringify(transaction.error.error.message, null, 2)
              : "No transaction data"}
          </span>
        )}
      </div>
      <Button onClick={() => fetchApiData("user")}>Fetch data from API</Button>
      <div>{apiData["user"] && JSON.stringify(apiData["user"].data)}</div>
      <div>{apiData["user"] && JSON.stringify(apiData["user"])}</div>
    </Body>
  );
};

export default Home;
