import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Header from "./components/Header";
import Home from "./pages/Home";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Header/>
        <Route exact path={["/", "/home", "/home/:page"]} render={(props) => <Home {...props} />} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
