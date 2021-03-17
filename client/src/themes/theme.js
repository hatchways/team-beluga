import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto",

    // h5 used for homepage title
    h5: {
        fontWeight: "500",
        fontSize: "30px"
    }
  },

  palette: {
    primary: {
        main:"#fc6c04",
        dark:"#c95400"
    },
    secondary: {
        main: "#000000",
    },
    muted: {
        main: "rgba(16, 16, 16, 0.3)",
    },
    light: {
        main: "#cfcee0",
        light: "#ededf5"        
    }
  },

  error: "#d8000c",
  bgcolor: "#ffffff"
});
