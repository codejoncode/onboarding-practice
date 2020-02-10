import React, { Component } from "react";
import { withRouter } from "react-router";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import PropTypes from 'prop-types';
import Selector from "./Selector";
import Countries from "../Helpers/Countries";
import UnitedStates from "../Helpers/UnitedStates";
import MailingAddressModel from "../Models/MailingAddressModel";
import ErrorPresent from "./ErrorPresent";

class MailingAddress extends Component {
    constructor(props) {
        super(props);
        this.state = new MailingAddressModel("Afghanistan", "Alabama", "", "", "");
        this.componentName = "MailingAddress";
    }

    areLettersAndNumbersPresent = (value) => {
        var isLetterPresent = false;
        var isNumberPresent = false;
        for (let i = 0; i < value.length; i++) {
            var char = value[i];
            if (char in this.props.letters) {
                isLetterPresent = true;
            }
            else if (Number(char) && Number(char) in this.props.numbers) {
                isNumberPresent = true;
            }

            if (isLetterPresent && isNumberPresent) {
                return (isLetterPresent && isNumberPresent);
            }
        }
        return (isLetterPresent && isNumberPresent);
    }

    validateCompleteAddress = async (route) => {
        const { streetAddress, city, pincode } = this.props.mailingAddressModel;
        await this.validateStreetAddress(streetAddress);
        await this.validateCity(city);
        await this.validatePincode(pincode);

        if (this.props.errorMessages.length === 0) {
            this.props.history.push(route);
        }
    }

    handleChange = (e) => {
        e.preventDefault();

        const nameToFunctionMapping = {
            streetAddress: this.validateStreetAddress,
            city: this.validateCity,
            pincode: this.validatePincode,
        }

        if (e.target.name in nameToFunctionMapping) {
            nameToFunctionMapping[`${e.target.name}`](e.target.value);
        }

        this.setState({ [e.target.name]: e.target.value }, () => this.props.mailingAddressModelChanger({ ...this.state }));
    }

    validateStreetAddress = async (value) => {
        if (!this.areLettersAndNumbersPresent(value)) {
            await this.props.validator(true, 1, 2, this.componentName);
        } else {//no errors
            this.props.validator(false, 1, 2, this.componentName);
        }
    }

    validateCity = async (value) => {
        let isErrorFound = false;
        if (value.length === 0) {
            isErrorFound = true;
        }
        // should not feature any numbers
        for (let i = 0; i < value.length; i++) {
            var char = value[i];
            if (Number(char) || Number(char) in this.props.numbers) {
                isErrorFound = true;
                break;
            }
        }
        if (isErrorFound) {
            await this.props.validator(true, 3, 4, this.componentName);
        } else {
            await this.props.validator(false, 3, 4, this.componentName);
        }
    }

    validatePincode = async (value) => {
        if (!Number(value)) {
            await this.props.validator(true, 5, 6, this.componentName);
        } else {
            await this.props.validator(false, 5, 6, this.componentName);
        }
    }

    render() {
        const {
            nextRoute, previousRoute,
            mailingAddressModel, errorMessages } = this.props;
        return (
            <div className="PageContainer">
                <PageHeader
                    icon="fas fa-mail-bulk"
                    title="Mailing Address"
                    description="Enter any mailing address for your company, this doesn't have to be a US address." />
                {errorMessages.length > 0 && <ErrorPresent errorMessages={errorMessages} />}
                <div className="MailingAddress">
                    <div className="MailingCountryStateInputs">
                        <div className="MailingInputLabels">
                            <label className="MailingInputTitle">Country</label>
                            <Selector handleChange={this.handleChange} name="country" data={Countries} value={mailingAddressModel.country} nameOfClass="MailingInputs" />
                        </div>
                        <div className="MailingInputLabels">
                            <label className="MailingInputTitle">State</label>
                            <Selector handleChange={this.handleChange} name="state" data={UnitedStates} value={mailingAddressModel.state} nameOfClass="MailingInputs" />
                        </div>
                    </div>
                    <div className="MailingStreetAddress">
                        <div className="MailingInputLabels">
                            <label className="MailingInputTitle">Street address</label>
                            <input onChange={this.handleChange} name="streetAddress" value={mailingAddressModel.streetAddress} className="MailingInputs" />
                        </div>
                    </div>
                    <div className="MailingCityPinInputs">
                        <div className="MailingInputLabels ">
                            <label className="MailingInputTitle">City</label>
                            <input onChange={this.handleChange} name="city" value={mailingAddressModel.city} className="MailingInputs" />
                        </div>
                        <div className="MailingInputLabels">

                            <label className="MailingInputTitle">Pin code</label>
                            <input onChange={this.handleChange} name="pincode" value={mailingAddressModel.pincode} className="MailingInputs" />
                        </div>
                    </div>
                    <div className="MailingDisclaimer">

                        <i className="MailingIcon fas fa-clipboard"></i>
                        <p>You can enter any address you want and this doesn't have to be in US.</p>

                    </div>
                </div>
                <PageFooter nextRoute={nextRoute} previousRoute={previousRoute} onNextPageClick={this.validateCompleteAddress} />
            </div>
        );
    }
}

MailingAddress.propTypes = {
    nextRoute: PropTypes.string.isRequired,
    previousRoute: PropTypes.string.isRequired,
    mailingAddressModel: PropTypes.object.isRequired,
    errorMessages: PropTypes.array.isRequired,
    mailingAddressModelChanger: PropTypes.func.isRequired,
    validator: PropTypes.func.isRequired,
    letters: PropTypes.object.isRequired,
    numbers: PropTypes.object.isRequired,
}
export default withRouter(MailingAddress);