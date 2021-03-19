import React, { useContext, createContext } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import { UserContextProvider } from "./globals/UserContext";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <UserContextProvider>
        <BrowserRouter>
          <Header />
          <Route exact path={["/", "/home", "/home/:page"]} render={(props) => <Home {...props} />} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/calendar" component={CalendarPage} />
        </BrowserRouter>
      </UserContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
