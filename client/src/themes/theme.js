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
        main: "#1f1f1f",
    },
    muted: {
        main: "rgba(16, 16, 16, 0.3)",
    },
    light: {
        main: "#cfcee0",
        light: "#ededf5",
        deepLight: "#f5f5fa"      
    },
    shadow: {
        card: "0px 0px 15px 0px rgba(215,214,235,1)"
    }
  },

  error: "#d8000c",
  bgcolor: "#ffffff"
});
