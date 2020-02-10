import React, { Component } from "react";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import PropTypes from "prop-types";
import AboutYourCompanyModel from "../Models/AboutYourCompanyModel";
import Selector from "./Selector";
import ErrorPresent from "./ErrorPresent";

class AboutYourCompany extends Component {
    constructor(props) {
        super(props);
        this.state = new AboutYourCompanyModel("", "Inc.", "");
        this.componentName = "AboutYourCompany";
    }
    validateFormData = async (nextRoute) => {
        const { companyName, description, } = this.props.aboutYourCompanyModel;
        await this.validateCompanyname(companyName);
        await this.validateBusinessDescription(description);

        if (this.props.errorMessages.length === 0) {
            this.props.history.push(nextRoute);
        }
    }

    validateBusinessDescription = async (description) => {
        if (description.length > 25) {
            await this.props.validator(false, 3, 4, this.componentName);
        } else {
            await this.props.validator(true, 3, 4, this.componentName);
        }
    }
    hasNoSpecialCharacters = (name) => {
        const specialsCharacters = { "!": 0, "@": 0, "#": 0, "$": 0, "%": 0, "^": 0, "*": 0, "&": 0, "(": 0, ")": 0, "+": 0, "=": 0 };

        for (let i = 0; i < name.length; i++) {
            var char = name[i];
            if (char in specialsCharacters) {
                return false;
            }
        }
        return true;
    }

    validateCompanyname = async (name) => {
        if (name.length > 5 && this.hasNoSpecialCharacters(name)) {
            await this.props.validator(false, 1, 2, this.componentName);
        } else {
            await this.props.validator(true, 1, 2, this.componentName);
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        const nameToFunctionsMapping = {
            companyName: this.validateCompanyname,
            description: this.validateBusinessDescription,
        };

        if (e.target.name in nameToFunctionsMapping) {
            nameToFunctionsMapping[e.target.name](e.target.value);
        }

        this.setState({ [e.target.name]: e.target.value }, () => this.props.aboutYourCompanyModelChanger({ ...this.state }));
    }


    render() {
        const { nextRoute, previousRoute, aboutYourCompanyModel, errorMessages, currentModal } = this.props;
        const message = "Your company name should be at least 5 characters and feature no special charaters.";
        const className = "AboutYourCompanyModal";
        return (
            <div className="PageContainer">
                <PageHeader
                    title="About your company"
                    icon="fas fa-building"
                    description="Details about your company's name and description."
                />
                {errorMessages.length > 0 && <ErrorPresent errorMessages={errorMessages} />}
                <div className="AboutYourCompany">
                    <label className="AYCompanyLabel">Company name      <i className="AyCompanyIcon far fa-question-circle"
                        onMouseOver={() => this.props.additionalDetailsModalOpener(message, className)}></i>{currentModal}</label>
                    <div className="AYCompanyInfo">
                        <input className="AYCompanyInfoInputLarge"
                            onChange={this.handleChange}
                            name="companyName" value={aboutYourCompanyModel.companyName}
                        />
                        <Selector
                            nameOfClass="AYCompanyInfoInputSmall"
                            value={aboutYourCompanyModel.companyType}
                            handleChange={this.handleChange}
                            data={["Inc.", "LLC"]}
                            name="companyType"
                        />
                    </div>
                    <div className="MailingDisclaimer">
                        <i className="MailingIcon fas fa-clipboard"></i>
                        <p>Inc, Incorporated, Corp or Corporation are mandatory for business names.</p>
                    </div>
                    <label className="AYCompanyLabel">Business description</label>
                    <input className="AYCompanyDescriptionInput"
                        onChange={this.handleChange}
                        name="description"
                        value={aboutYourCompanyModel.description}
                    />
                </div>
                <PageFooter nextRoute={nextRoute} previousRoute={previousRoute} onNextPageClick={this.validateFormData} />
            </div>
        );
    }
}

AboutYourCompany.propTypes = {
    aboutYourCompanyModel: PropTypes.object.isRequired,
    aboutYourCompanyModelChanger: PropTypes.func.isRequired,
    nextRoute: PropTypes.string.isRequired,
    previousRoute: PropTypes.string.isRequired,
    errorMessages: PropTypes.array.isRequired,
    validator: PropTypes.func.isRequired,
    additionalDetailsModalOpener: PropTypes.func.isRequired,
    currentModal: PropTypes.any,
}
export default AboutYourCompany;