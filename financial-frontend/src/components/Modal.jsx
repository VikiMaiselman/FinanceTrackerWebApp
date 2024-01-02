import React from "react";
import "../styles/Modal.css";

export default function Modal({
  children,
  shouldShowModal,
  setShouldShowModal,
}) {
  const showHideClassName = shouldShowModal
    ? "modal display-block"
    : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setShouldShowModal(false);
          }}
        >
          Close
        </button>
      </section>
    </div>
  );
}
