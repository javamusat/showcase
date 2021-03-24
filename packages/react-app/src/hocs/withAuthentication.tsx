import React, { useEffect } from "react";
import useTwitterAuthentication from "../hooks/useTwitterAuthentication";
import { Overlay } from "../components";
import Modal from "../components/Modal";
import ModalContent from "../components/ModalContent";
import ModalActions from "../components/ModalActions";
import TwitterLogin from "../components/TwitterLogin/TwitterLogin";
import useFirebase from "../hooks/useFirebase";
import WalletButton from "../components/WalletButton/WalletButton";
import useWeb3Modal from "../hooks/useWeb3Modal";
import useWalletProvider from "../hooks/useWalletProvider";
import useShowcase from "../hooks/useShowcase";
import useShowcaseApi from "../hooks/useShowcaseApi";
import ModalImage from "../components/ModalImage";
import LoginStepper from "../components/LoginStepper";

export interface ShowcaseAuth {
  profile: {
    firebaseId: string;
    federatedId: string;
    email: string;
    emailVerified: boolean;
    fullName: string;
    displayName: string;
    screenName: string;
    photoUrl: string;
    oauthAccessToken: string;
    oauthTokenSecret: string;
    refreshToken: string;
    followers: string;
    friends: string;
    location: string;
  };
  wallet: {
    address: string;
    protocol: string;
  };
}

export const createAuthBody = (firebase: any, wallet: any): ShowcaseAuth => ({
  profile: {
    firebaseId: firebase.user.uid,
    federatedId: firebase.user.providerData[0].uid,
    email: firebase.user.providerData[0].email,
    emailVerified: firebase.user.emailVerified,
    fullName: firebase.additionalUserInfo.profile.name,
    displayName: firebase.user.providerData[0].displayName,
    screenName: firebase.additionalUserInfo.profile.screen_name,
    photoUrl: firebase.user.providerData[0].photoURL,
    oauthAccessToken: firebase.credential.accessToken,
    oauthTokenSecret: firebase.credential.secret,
    refreshToken: firebase.user.refreshToken,
    followers: firebase.additionalUserInfo.profile.followers_count,
    friends: firebase.additionalUserInfo.profile.friends_count,
    location: firebase.additionalUserInfo.profile.location,
  },
  wallet: {
    address: wallet.account,
    protocol: "ETH",
  },
});

const LoginModal: React.FC<any> = ({
  // isTwitterAuthenticated,
  firebase,
  wallet,
  showcase,
}) => {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  // TODO MOCK for SHOWCASE => !firebase.user = !isTwitterAuthenticated
  return (
    <Modal>
      {!firebase.user ? (
        <>
          <ModalImage />
          <LoginStepper currentStep={!firebase.user ? 2 : 1} />
          <ModalContent>
            <h2>Get rewarded for engagement</h2>
            <p>Join the social farm and start earning today!</p>
          </ModalContent>
          <ModalActions>
            <TwitterLogin />
          </ModalActions>
        </>
      ) : wallet.account ? (
        <>
          <ModalImage />
          <LoginStepper currentStep={!firebase.user ? 2 : 1} />
          <ModalContent>
            <h2>{showcase.loginFailed ? "Login failed" : "Logging in"}</h2>
            <p>
              {showcase.loginFailed ? "Failed to login" : "Fetching account..."}
            </p>
          </ModalContent>
          <ModalActions>
            <TwitterLogin />
          </ModalActions>
        </>
      ) : (
        <>
          <ModalImage />
          <LoginStepper currentStep={!firebase.user ? 2 : 1} />
          <ModalContent>
            <h2>Hi {firebase.user ? firebase.user.displayName : ""}</h2>
            <p>Connect your wallet and start earning today!</p>
          </ModalContent>
          <ModalActions>
            <WalletButton
              provider={provider}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
          </ModalActions>
        </>
      )}
    </Modal>
  );
};

function withAuthentication(WrappedComponent: React.FC) {
  return function WithAuthenticationComponent({ ...props }) {
    const isTwitterAuthenticated = useTwitterAuthentication();
    const { firebase } = useFirebase();
    const { wallet } = useWalletProvider();
    const { showcase } = useShowcase();
    const { apiData, fetchApiData } = useShowcaseApi();

    useEffect(() => {
      // TODO MOCK for SHOWCASE re-enable isTwitterAuthenticated
      if (
        // isTwitterAuthenticated &&
        wallet.account &&
        firebase.credential &&
        !showcase.jwt &&
        !showcase.loginFailed &&
        apiData["auth"] !== "pending"
      ) {
        const body = createAuthBody(firebase, wallet);
        fetchApiData("auth", body).catch((err) => console.error(err));
      }
    }, [firebase, wallet, showcase]);

    // TODO MOCK for SHOWCASE re-enable isTwitterAuthenticated
    if (
      // !isTwitterAuthenticated ||
      !firebase.user ||
      !wallet.account ||
      !showcase.jwt
    ) {
      return (
        <Overlay>
          <LoginModal
            isTwitterAuthenticated={isTwitterAuthenticated}
            firebase={firebase}
            wallet={wallet}
            showcase={showcase}
          />
        </Overlay>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthentication;
