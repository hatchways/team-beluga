import React, { useContext, createContext } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route} from "react-router-dom";
import { theme } from "./themes/theme";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import { UserContextProvider } from "./globals/UserContext";
import StripeCheckout from "./pages/StripeCheckout";
import Onboarding from "./pages/Onboarding";
import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <UserContextProvider>
        <BrowserRouter>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/calendar" component={CalendarPage} />
          <Route exact path={["/", "/home", "/home/:page"]} component={Home} />
          <Route exact path={["/onboarding/profile-settings", "/onboarding/calendar-confirm", "/onboarding/availability"]} component={Onboarding} />
          <Route exact path="/checkout" component={StripeCheckout} />
        </BrowserRouter>
      </UserContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
