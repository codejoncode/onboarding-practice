import React, { Component } from "react";
import PropTypes from "prop-types";

class ConfirmDelete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            error: ""
        }
    }
    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }
    compareInput = () => {
        if (this.state.name === this.props.nameToDelete) {
            this.deleteDirector();
        } else {
            this.setState({
                error: `Please type in ${this.props.nameToDelete} 
            including a space between the first and last name`});
        }
    }
    cancel = () => {
        this.props.currentModalChanger(null);
    }

    deleteDirector = async () => {
        const newDirectorList = [];
        for (let i = 0; i < this.props.boardOfDirectorsList.length; i++) {
            if (i !== this.props.index) {
                newDirectorList.push(this.props.boardOfDirectorsList[i]);
            }
        }

        await this.props.boardOfDirectorsListChanger([...newDirectorList]);
        await this.cancel();
    }

    render() {
        const { nameToDelete } = this.props;
        return (
            <div className="Modal ConfirmDelete">
                <div>
                    <h2>Are you sure you want to delete {nameToDelete}?</h2>
                    <h3>Enter there name below to confirm.</h3>
                    <h5 className="ConfirmDeleteError">{this.state.error}</h5>
                    <div className="ConfirmDeleteSection">
                        <input
                            className="ConfirmDeleteInput"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                        <div className="ConfirmDeleteButtons">
                            <button className="NextButton ConfirmDeleteButton" onClick={this.compareInput}>Confirm</button>
                            <button className="NextButton ConfirmDeleteButton" onClick={this.cancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ConfirmDelete.propTypes = {
    nameToDelete: PropTypes.string.isRequired,
    boardOfDirectorsList: PropTypes.array.isRequired,
    boardOfDirectorsListChanger: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    currentModalChanger: PropTypes.func.isRequired,
}
export default ConfirmDelete; 