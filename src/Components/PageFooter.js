import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
const PageFooter = ({
    previousRoute, nextRoute, onNextPageClick
}) => {

    return (
        <div className="PageFooter">
            <button className="PreviousButton">
                <Link to={previousRoute}>PREVIOUS STEP</Link>
            </button>
            {<button className="NextButton" onClick={() => onNextPageClick(nextRoute)}>
                NEXT
                </button>}
        </div>
    );
}

PageFooter.propTypes = {
    previousRoute: PropTypes.string.isRequired,
    nextRoute: PropTypes.string.isRequired,
    onNextPageClick: PropTypes.func.isRequired,
}
export default PageFooter;

