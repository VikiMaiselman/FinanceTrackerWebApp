import React from "react";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Modal.css";

const theme = createTheme({
  palette: {
    close: {
      main: "#3f3f3f",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
  },
});

export default function Modal({
  children,
  shouldShowModal,
  setShouldShowModal,
  isBig,
}) {
  const showHideClassName = shouldShowModal
    ? "modal display-block"
    : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className={isBig ? "modal-main-big" : "modal-main"}>
        {children}

        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="close"
            onClick={(event) => {
              event.preventDefault();
              setShouldShowModal(false);
            }}
          >
            <CloseIcon />
            Close
          </Button>
        </ThemeProvider>
      </section>
    </div>
  );
}
