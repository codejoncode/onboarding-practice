import React, { Component, } from "react";
import PropTypes from "prop-types";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import ErrorPresent from "./ErrorPresent";


class BoardOfDirectors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
        }
        this.componentName = "BoardOfDirectors";
    }

    validateFirstName = async (name) => {
        await this.props.validator(false, 5, 0, this.componentName);
        if (name.length === 0) {
            await this.props.validator(false, 1, 2, this.componentName);
            return;
        }
        var onlyLetters = await this.props.hasLettersOnly(name);
        var isErrorPresent = onlyLetters !== true || name.length < 2;
        if (isErrorPresent === true) {
            await this.props.validator(true, 1, 2, this.componentName);
        } else if (isErrorPresent === false) {
            await this.props.validator(false, 1, 2, this.componentName);
        } else {
            throw Error(`Something went wrong isErrorPresent is not a boolean. isErrorPresent is type 
            ${typeof isErrorPresent} with a value of ${isErrorPresent}`);
        }
    }

    validateLastName = async (name) => {
        await this.props.validator(false, 6, 0, this.componentName);
        if (name.length === 0) {
            await this.props.validator(false, 3, 4, this.componentName);
            return;
        }
        var onlyLetters = await this.props.hasLettersOnly(name);
        var isErrorPresent = onlyLetters !== true || name.length < 2;
        if (isErrorPresent === true) {
            await this.props.validator(true, 3, 4, this.componentName);
        } else if (isErrorPresent === false) {
            await this.props.validator(false, 3, 4, this.componentName);
        } else {
            throw Error(`Something went wrong isErrorPresent is not a boolean. isErrorPresent is type 
            ${typeof isErrorPresent} with a value of ${isErrorPresent}`);
        }
    }

    deleteDirector = async (index) => {
        if (this.props.currentModal === null) {
            await this.props.modalManager("confirmDelete", index);
        }
    }

    addDirector = async () => {
        await this.props.clearErrorMessage();

        await this.validateFirstName(this.state.firstName);
        await this.validateLastName(this.state.lastName);

        if (this.props.errorMessages.length === 0 && this.state.firstName.length > 1 && this.state.lastName.length > 1) {
            const newDirector = {};
            newDirector.firstName = this.state.firstName;
            newDirector.lastName = this.state.lastName;
            await this.props.boardOfDirectorsListChanger([...this.props.boardOfDirectorsList, newDirector]);
            this.setState({ firstName: "", lastName: "" });
        }
    }

    handleChangeHelper = async (name, value) => {
        const nameToValidatorMapping = {
            firstName: this.validateFirstName,
            lastName: this.validateLastName,
        };
        if (name in nameToValidatorMapping) {
            await nameToValidatorMapping[name](value);
        } else {
            throw Error(`Something went wrong ${name} does not exist in the nameToValidatorMapping object`);
        }

        this.setState({ [name]: value });
    }

    handleChange = (e) => {
        e.preventDefault();
        this.handleChangeHelper(e.target.name, e.target.value);
    }

    nextPage = async (route) => {
        if (this.state.firstName.length === 0 && this.state.lastName.length === 0) {
            this.props.history.push(route);
            return
        }
        await this.props.clearErrorMessage(this.componentName);
        if (this.state.firstName.length > 0) {
            await this.props.validator(true, 1, 5, this.componentName);
        }
        if (this.state.lastName.length > 0) {
            await this.props.validator(true, 3, 6, this.componentName);
        }
    }
    render() {
        const { boardOfDirectorsList,
            nextRoute,
            previousRoute,
            errorMessages,
            currentModal
        } = this.props;
        return (
            <div className="PageContainer">
                <PageHeader
                    icon="fas fa-address-book"
                    title="Board of Directors"
                    description="Details about your company directors, include all of your directors name here."
                />
                {errorMessages.length > 0 && <ErrorPresent errorMessages={errorMessages} />}
                {currentModal}
                <div className="BoardOfDirectors">
                    {boardOfDirectorsList.map((director, index) => {
                        return (
                            <div className="BODList" key={index}>
                                <div className="BODListFirstName">
                                    <label className="MailingInputTitle">First name</label>
                                    <input className="MailingInputs"
                                        name="firstName"
                                        value={director.firstName}
                                        readOnly
                                    />
                                </div>
                                <div className="BODListLastName">
                                    <label className="MailingInputTitle">Last name</label>
                                    <input className="MailingInputs"
                                        name="lastName"
                                        value={director.lastName}
                                        readOnly
                                    />
                                    <i id="BODDelete" className="far fa-times-circle"
                                        onClick={() => this.deleteDirector(index)}
                                    ></i>
                                </div>

                            </div>)
                    })}
                    <div className="BODList">
                        <div className="BODListFirstName">
                            <label className="MailingInputTitle">First name</label>
                            <input className="MailingInputs"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="BODListLastName">
                            <label className="MailingInputTitle">Last name</label>
                            <input className="MailingInputs"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>

                    <div className={errorMessages.length === 0 ? "BODAddDirector" : "BODAddDirector NotAllowed"} onClick={this.addDirector}><i className="fas fa-plus"></i> ADD DIRECTOR</div>
                </div>
                <PageFooter nextRoute={nextRoute} previousRoute={previousRoute} onNextPageClick={this.nextPage} />
            </div>
        );
    }
}

BoardOfDirectors.propTypes = {
    boardOfDirectorsList: PropTypes.array.isRequired,
    nextRoute: PropTypes.string.isRequired,
    previousRoute: PropTypes.string.isRequired,
    boardOfDirectorsListChanger: PropTypes.func.isRequired,
    errorMessages: PropTypes.array.isRequired,
    clearErrorMessage: PropTypes.func.isRequired,
    modalManager: PropTypes.func.isRequired,
    currentModal: PropTypes.any,
    validator: PropTypes.func.isRequired,
}
export default BoardOfDirectors;