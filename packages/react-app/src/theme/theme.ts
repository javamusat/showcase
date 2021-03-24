import { black, green, grey, red, white, yellow, blue } from "./colors";

const theme = {
  borderRadius: 12,
  breakpoints: {
    mobile: 576,
    tablet: 768,
    desktop: 992,
    ultra: 1200,
  },
  color: {
    black,
    grey,
    yellow,
    blue,
    primary: {
      light: red[200],
      main: red[500],
    },
    secondary: {
      main: green[500],
    },
    white,
    red,
    green,
    0: "#d94351",
    1: "#E63946",
    2: "#F1FAEE",
    3: "#A8DADC",
    4: "#207CF4",
    5: "#1D3557",
  },
  siteWidth: 1200,
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
  },
  topBarSize: 72,
};

export default theme;
