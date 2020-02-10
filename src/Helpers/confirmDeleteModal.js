import React from "react";
import ConfirmDelete from "../Components/ConfirmDelete";

const confirmDeleteModal = (name) => {
  if (name !== null && typeof name === "string") {
    return <ConfirmDelete nameToDelete={name}
      compareInput={compareInput}
      cancel={cancel}
      error=""
    />
  } else {
    throw new Error(`Something is wrong! ${name} is type ${typeof name} required to be type string`);
  }
}
export default confirmDeleteModal;