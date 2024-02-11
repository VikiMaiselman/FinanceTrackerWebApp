import React from "react";
import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Modal.css";
import { CustomThemeContext } from "../contexts/CustomTheme.context";

export default function Modal({
  children,
  shouldShowModal,
  setShouldShowModal,
  isBig,
}) {
  const { theme } = React.useContext(CustomThemeContext);

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
            color="login"
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
