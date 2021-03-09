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
    },
    secondary: {
        main: "#1f1f1f",
    }
  },

  error: "#d8000c",
  bgcolor: "#ffffff"
});
