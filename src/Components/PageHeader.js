import React from "react";
import PropTypes from 'prop-types';

const PageHeader = ({ icon, title, description }) => {

    return (
        <div className="PageHeader">
            <i className={`HeaderIcon ${icon}`} />
            <h1 className="PageTitle">{title}</h1>
            <p className="PageDescription">{description}</p>
        </div>
    );
}

PageHeader.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}
export default PageHeader;
