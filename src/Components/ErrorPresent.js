import React from "react";
import PropTypes, { string } from "prop-types";

const ErrorPresent = ({ errorMessages }) => {

    return (
        <div className="ErrorPresent">
            <h2 className="ErrorPresentHeader">Please correct the following issues:</h2>
            <ul className="ErrorPresentList">
                {errorMessages.map((errorMessage, index) => <li key={index} className="ErrorPresentListItem">{errorMessage}</li>)}
            </ul>
        </div>
    );
}

ErrorPresent.propTypes = {
    errorMessages: PropTypes.arrayOf(string).isRequired
}
export default ErrorPresent; 