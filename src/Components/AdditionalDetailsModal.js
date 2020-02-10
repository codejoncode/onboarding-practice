import React, { Component } from "react";
import PropTypes from "prop-types";

class AdditionalDetailsModal extends Component {
    constructor(props){
        super(props);
        this.state = {}; 
    }
    
    additionalDetailsModalCloser = () => {
        this.props.modalChanger(null);
    }

    render(){
        const {description, className} = this.props;
        return (
            <div className={className} onMouseLeave={this.additionalDetailsModalCloser}>
                <p>{description}</p>
            </div>
        );
    }
}
AdditionalDetailsModal.propTypes = {
    description: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    modalChanger: PropTypes.func.isRequired,
    // additionalDetailsModalOpener: PropTypes.func.isRequired,
}

export default AdditionalDetailsModal;