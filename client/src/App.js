import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route} from "react-router-dom";
import { theme } from "./themes/theme";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import { UserContextProvider } from "./globals/UserContext";
import Onboarding from "./pages/Onboarding";
import { AlertContextProvider } from "./globals/AlertContext";
import FlashAlert from './components/FlashAlert';
import PrivateRoute from "./components/PrivateRoute";
import Upgrade from "./pages/Upgrade";
import "./App.css";


function App() {
  
  return (
    <MuiThemeProvider theme={theme}>
      <UserContextProvider>
        <AlertContextProvider>
          <BrowserRouter>
            <FlashAlert />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/calendar" component={CalendarPage} />
            <PrivateRoute exact path={["/", "/home", "/home/:page"]} component={Home} />
            <PrivateRoute exact path={["/onboarding/profile-settings", "/onboarding/calendar-confirm", "/onboarding/availability"]} component={Onboarding} />
            <PrivateRoute exact path="/upgrade" component={Upgrade} />
          </BrowserRouter>
        </AlertContextProvider>
      </UserContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
