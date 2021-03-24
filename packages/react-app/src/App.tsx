import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { WalletProvider } from "./context/WalletProvider";
import { TransactionProvider } from "./context/TransactionProvider";
import { FirebaseProvider } from "./context/FirebaseProvider";
import ModalProvider from "./context/ModalProvider";
import { ThemeProvider } from "styled-components";
import withAuthentication from "./hocs/withAuthentication";
import Home from "./containers/Home/Home";
import TopBar from "./containers/TopBar/TopBar";
import theme from "./theme/theme";
import { ShowcaseApiProvider } from "./context/ShowcaseApiProvider";
import { ShowcaseProvider } from "./context/ShowcaseProvider";
import SideBar from "./containers/SideBar/SideBar";

const HomeWithAuth = withAuthentication(Home);

function App() {
  return (
    <Providers>
      <Router>
        <TopBar />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <SideBar />
          <div style={{ flex: 10 }}>
            <Switch>
              <Route path="/" exact component={HomeWithAuth} />
              <Route path="/hack" component={Home} />
            </Switch>
          </div>
        </div>
      </Router>
    </Providers>
  );
}

const Providers: React.FC<any> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ShowcaseProvider>
        <ShowcaseApiProvider>
          <WalletProvider>
            <FirebaseProvider>
              <TransactionProvider>
                <ModalProvider>{children}</ModalProvider>
              </TransactionProvider>
            </FirebaseProvider>
          </WalletProvider>
        </ShowcaseApiProvider>
      </ShowcaseProvider>
    </ThemeProvider>
  );
};

export default App;
