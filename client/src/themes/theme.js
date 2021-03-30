import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto",

    // h5 used for homepage title
    h5: {
        fontWeight:500,
        fontSize:30
    },

    // body1 used in upgrade page card subtitle
    body1: {
      fontWeight:500,
      fontSize:17
    }

  },

  palette: {
    primary: {
        light:"#ffb987",
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
        light: "#ededf5",
        deepLight: "#f5f5fa",
        minorLight: "#9a9a9a"  
    },
    purple: {
      main: "#963aff"
    },
    green: {
      main: "#8fbc1b"
    },
    shadow: {
        card: "0px 0px 15px 0px rgba(215,214,235,1)"
    }
  },

  error: "#d8000c",
  bgcolor: "#ffffff"
});
