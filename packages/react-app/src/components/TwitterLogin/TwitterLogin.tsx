import React, { useEffect } from "react";
import { auth } from "../../services/firebase";
import useFirebase from "../../hooks/useFirebase";
import { useHistory } from "react-router-dom";
import { Button } from "../index";

const buttonList = {
  twitter: {
    visible: true,
    provider: () => auth.twitterOAuth(),
  },
};

const SocialButtonList: React.FC<any> = ({
  buttonList,
  auth,
  currentProviders = null,
}) => {
  const { firebase, dispatchFb } = useFirebase();
  const history = useHistory();

  const authHandler = (authData: any) => {
    if (authData) {
      dispatchFb({
        type: "login",
        user: authData.user,
        credential: authData.credential,
        additionalUserInfo: authData.additionalUserInfo,
      });
      if (currentProviders === null) {
        history.push("/");
      } else {
        currentProviders(authData.user.providerData);
      }
    } else {
      console.error("Error authenticating");
    }
  };

  const authenticate = (e: any, provider: any) => {
    const providerOAuth = buttonList[provider].provider();

    if (!auth().currentUser) {
      auth();
      // .signInWithPopup(providerOAuth)
      // .then(authHandler)
      // .catch((err: any) => console.error(err));
      // TODO: MOCK for SHOWCASE
      return authHandler({
        user: {
          uid: "firebaseId",
          emailVerified: true,
          displayName: "displayName",
          refreshToken: "refreshToken",
          providerData: [
            {
              uid: "providerId",
              photoUrl: "https://photo.url",
              email: "mock@email.mock",
            },
          ],
        },
        credential: {
          accessToken: "accessToken",
          secret: "tokenSecret",
        },
        additionalUserInfo: {
          profile: {
            name: "my name",
            screen_name: "screenName",
            followers_count: 100,
            friends_count: 50,
            location: "Pluto",
          },
        },
      });
    } else {
      auth().signOut();
      dispatchFb({ type: "logout" });
    }
  };

  const renderButtonList = (provider: any) => {
    // TODO: MOCK for SHOWCASE
    return (
      <Button key={provider} onClick={(e) => authenticate(e, provider)}>
        {/*{!auth().currentUser ? "Sign up with Twitter" : "Restart"}*/}
        {!firebase.user ? "Sign up with Twitter" : "Logout"}
      </Button>
    );
  };

  return <div>{Object.keys(buttonList).map(renderButtonList)}</div>;
};

const TwitterLogin: React.FC<any> = () => {
  const { firebase, dispatchFb } = useFirebase();

  // TODO find out what changed.. user is null shortly after authentication all of the sudden
  // useEffect(() => {
  //     // @ts-ignore
  //     auth.getAuth().onAuthStateChanged((user: any) => {
  //         dispatchFb({ type: 'currentUser', user })
  //     });
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    if (
      firebase.user &&
      (!firebase.credential || !firebase.additionalUserInfo)
    ) {
      auth.getAuth().signOut();
    }
  }, [firebase.user, firebase.credential, firebase.additionalUserInfo]);

  return (
    <SocialButtonList buttonList={buttonList} auth={(auth as any).getAuth} />
  );
};

export default TwitterLogin;
