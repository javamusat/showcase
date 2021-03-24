import { useCallback, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Contract } from "@ethersproject/contracts";
// @ts-ignore
import { abis, addresses } from "@showcase/contracts";
import useShowcase from "./useShowcase";
import useWalletProvider from "./useWalletProvider";

const INFURA_ID = "7a9c4ff3188d481f9143904079638424";
const NETWORK_NAME = "mainnet";

function useWeb3Modal(config = {}) {
  const [provider, setProvider] = useState(null);
  const { dispatchWp } = useWalletProvider();
  const { dispatchOd } = useShowcase();
  // const [autoLoaded, setAutoLoaded] = useState(false);
  const {
    // autoLoad = true,
    infuraId = INFURA_ID,
    NETWORK = NETWORK_NAME,
  }: any = config;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = new Web3Modal({
    network: NETWORK,
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    },
    theme: "dark",
  });

  const loadContext = async (
    web3Provider: Web3Provider,
    updatedChainId: number = null
  ) => {
    if (!web3Provider) {
      return;
    }
    setProvider(web3Provider);

    let chainId = updatedChainId;
    if (!chainId) {
      const network = await web3Provider.getNetwork();
      chainId = network.chainId;
    }
    const accounts = await web3Provider.listAccounts();
    const contracts = new Map([
      [
        "PPDEX",
        new Contract(
          addresses[chainId].tokens["PPDEX"],
          abis.ppdex,
          web3Provider.getSigner()
        ),
      ],
    ]);

    return dispatchWp({
      type: "setContext",
      contracts,
      chainId,
      account: accounts[0],
      provider: web3Provider,
    });
  };

  const resetApp = async () => {
    provider && provider.close && (await provider.close());
    setProvider(null);

    await web3Modal.clearCachedProvider();
    await dispatchWp({
      type: "reset",
    });
    window.location.reload();
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("chainChanged", async (chainId: string) => {
      console.info("[PROVIDER] chain changed to ", chainId);

      const web3Provider = new Web3Provider(provider, "any");
      loadContext(web3Provider, parseInt(chainId)).then(() =>
        console.log("Contracts LOADED")
      );
    });

    provider.on("accountsChanged", async (account: string) => {
      console.info("[PROVIDER] account changed to ", account);

      const web3Provider = new Web3Provider(provider, "any");
      loadContext(web3Provider).then(() => {
        console.log("Contracts LOADED");
        dispatchOd({
          type: "reset",
        });
      });
    });
  };

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    await subscribeProvider(newProvider);
    const web3Provider = new Web3Provider(newProvider, "any");

    loadContext(web3Provider).then(() => console.log("Contracts LOADED"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await resetApp();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [web3Modal]
  );

  // TODO -> Introduces problems when using multiple wallets and lots of network switching
  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  // useEffect(() => {
  //   if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
  //     loadWeb3Modal();
  //     setAutoLoaded(true);
  //   }
  // }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
