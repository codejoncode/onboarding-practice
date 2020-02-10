import React, { Component } from "react";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import PropTypes from "prop-types";
import AboutYouModel from "../Models/AboutYouModel";
import ErrorPresent from "./ErrorPresent";

class AboutYou extends Component{
    constructor(props){
        super(props);
        this.state = new AboutYouModel("", "", "", "", "false");
        this.nameToErrorIndexs = {
            firstName: [1, 2],
            lastName: [3,4],
            phoneNumber: [5,6],
            ssnOrItin: [8,9],
            IdentifierQuestion: [7,10],
        }
        this.specialVariable = {
            phoneNumber: "phone",
            ssnOrItin: "ssn"
        }
        this.componentName = "AboutYou";
        this.question = false; 
        this.input = false; 
    }

    addDash = (numberString) => {
        if((typeof numberString) !== "string"){
            throw TypeError(`Argument numberString not of type 'String' received ${typeof numberString}`);
        }
        numberString += "-";
        return numberString; 
    }

    formatNumber = (numberString, index1, index2) => {
        if((typeof numberString) !== "string" ){
          throw TypeError(`numberSting argument is not of type string. numberSting is type ${typeof numberString}`)
        }
      
        if((typeof index1) !== "number"){
          throw TypeError(`index1 argument is not of type number index1 is type ${typeof index1}`);
        }
          if((typeof index2) !== "number"){
          throw TypeError(`index2 argument is not of type number index2 is type ${typeof index2}`);
        }
        var newString = "";
      
        for(let i = 0; i<numberString.length; i++){
          var char = numberString[i];
          if(i === index1 || i === index2){
              if(char !== '-'){
                  newString += "-";
              }
          }
          newString += char; 
        }
        return newString;
      }

    validateNames = async (name, errorIndex1, errorIndex2) => {
        var isErrorPresent = false; 
     
        if(typeof name !== "string"){
            throw new TypeError(`The argument name has a type of ${typeof name} and should be of type string`);
        }   
        if((typeof errorIndex1) !== "number"){
            throw new TypeError(`errorIndex1 argument of type ${typeof errorIndex1} should be type number`);
        }
        if((typeof errorIndex2) !== "number"){
            throw new TypeError(`errorIndex2 argument of type ${typeof errorIndex2} should be type number`);
        }

        if(name.length < 2){
            isErrorPresent = true; 
        }

        var lettersOnly = await this.props.hasLettersOnly(name);
        if( lettersOnly === false){
            isErrorPresent = true; 
        }
        if(isErrorPresent === false){
            await this.props.validator(false, errorIndex1, errorIndex2, this.componentName);
        }else if (isErrorPresent === true){
            await this.props.validator(true, errorIndex1, errorIndex2,this.componentName);
        }else {
            throw new Error(`There is a problem isErrorPresent flag is neither true or false. Result = ${isErrorPresent}`);
        }
        return isErrorPresent; 
    }

    validatePhone = async (numberString, errorIndex1, errorIndex2, phoneOrSSN) => { 
        if((typeof numberString) !== "string"){
            throw new TypeError(`numberString argument of type ${typeof numberString} should be type string`);
        }
        if((typeof errorIndex1) !== "number"){
            throw new TypeError(`errorIndex1 argument of type ${typeof errorIndex1} should be type number`);
        }
        if((typeof errorIndex2) !== "number"){
            throw new TypeError(`errorIndex2 argument of type ${typeof errorIndex2} should be type number`);
        }
        if((typeof phoneOrSSN) !== "string"){
            throw new TypeError(`phoneOrSSN argument of type ${typeof phoneOrSSN} should be type string`);
        }
        if(phoneOrSSN !== "phone" && phoneOrSSN !== "ssn"){
            throw new Error(`phoneOrSSN argument should equal 'phone' or 'ssn' but equals ${phoneOrSSN}`);
        }
        
        var isErrorPresent = false; 
        
        if(phoneOrSSN === "phone" && numberString.length !== 12){
            isErrorPresent = true; 
        }
        
        if(phoneOrSSN === "ssn" && numberString.length !== 11){
            isErrorPresent = true; 
        }

        var numbersOnly = await this.props.hasNumbersOnly(numberString);
        if( numbersOnly === false ){
            isErrorPresent = true; 
        }

        if(isErrorPresent === false){
            await this.props.validator(isErrorPresent, errorIndex1, errorIndex2,this.componentName);
        }
        
        else if (isErrorPresent === true){
            await this.props.validator(isErrorPresent, errorIndex1, errorIndex2, this.componentName);
        }
        else {
            throw new Error(`Something went wrong. isErrorPresent is not true or false. isErrorPresent = ${isErrorPresent}`);
        }
    }

    validateQuestion = async (hasInfo, errorIndex1, errorIndex2) => {
        if((typeof hasInfo) !== "string"){
            throw TypeError(`Argument ${Object.keys({hasInfo})[0]} is not of type ${Object.keys({hasInfo})[0]} has value of ${typeof hasInfo}`);
        }                               
        if((typeof errorIndex1) !== "number"){
            throw TypeError(`Argument ${Object.keys({errorIndex1})[0]} is not of type ${Object.keys({errorIndex1})[0]} has value of ${typeof errorIndex1}`);
        }
        if((typeof errorIndex2) !== "number"){
            throw TypeError(`Argument ${Object.keys({errorIndex2})[0]} is not of type ${Object.keys({errorIndex2})[0]} has value of ${typeof errorIndex2}`);
        }

        if(hasInfo === "true"){
            await this.props.validator(false, errorIndex1, errorIndex2, this.componentName);
        }else if (hasInfo === "false"){
            await this.props.validator(true, errorIndex1, errorIndex2, this.componentName); 
        } else {
            throw Error(`Something is wrong! Argument hasInfo not equal to  'true' or 'false'`);
        }
    }
    
    validateForm = async (nextRoute) => {
        const {aboutYouModel} = this.props;
        const {firstName, lastName, phoneNumber, ssnOrItin, IdentifierQuestion} = aboutYouModel;
        const [firstNameError1, firstNameError2] = this.nameToErrorIndexs["firstName"];
        const [lastNameError1, lastNameError2] = this.nameToErrorIndexs["lastName"];
        const [questionError1, questionError2] = this.nameToErrorIndexs["IdentifierQuestion"];
        const [phoneError1, phoneError2] = this.nameToErrorIndexs["phoneNumber"];
        const [ssnError1, ssnError2] = this.nameToErrorIndexs["ssnOrItin"];
        await this.validateNames(firstName, firstNameError1, firstNameError2);
        await this.validateNames(lastName, lastNameError1, lastNameError2);
        await this.validateQuestion(IdentifierQuestion, questionError1, questionError2);
        await this.validatePhone(phoneNumber, phoneError1, phoneError2, "phone");
        await this.validatePhone(ssnOrItin, ssnError1, ssnError2, "ssn");

        if(this.props.errorMessages.length === 0){
            this.props.history.push(nextRoute);
        }
    }

    handleChange = (e) => {
        if(e.target.name !== "IdentifierQuestion"){
            e.preventDefault();
        }

        const nameToFunctionMapping = {
            firstName : this.validateNames,
            lastName: this.validateNames,
            phoneNumber: this.validatePhone,
            ssnOrItin: this.validatePhone,
            IdentifierQuestion: this.validateQuestion,
        }

        if(e.target.name in nameToFunctionMapping){
            if(e.target.name in this.nameToErrorIndexs){
                var [errorIndex1, errorIndex2] = this.nameToErrorIndexs[e.target.name];
                if(e.target.name in this.specialVariable){
                    var phoneOrSsn = this.specialVariable[e.target.name];
                    nameToFunctionMapping[e.target.name](e.target.value, errorIndex1, errorIndex2, phoneOrSsn)

                } else {
                    nameToFunctionMapping[e.target.name](e.target.value, errorIndex1, errorIndex2)
                }
            }else {
                nameToFunctionMapping[e.target.name](e.target.value)
            }
        }
        this.setState({[e.target.name] : e.target.value}, () => this.props.aboutYouModelChanger({...this.state}));
    }

    handleQuestionModal = () => {
        const ssnMessage = "If you have a S-Corporation an SSN number is mandatory in the format XXX-XX-XXXX";
        const className = "AboutYouModalSsnQuestion";

        //Not sure I want this on state, my state currently is modeled to the inptus.
        this.question = true;  
        this.props.additionalDetailsModalOpener(ssnMessage, className);
    }

    handleInputModal = () => {
        const ssnMessage = "If you have a S-Corporation an SSN number is mandatory in the format XXX-XX-XXXX";
        const className = "AboutYouModalSsn";
        this.input = true;
        this.props.additionalDetailsModalOpener(ssnMessage, className);
    }
    handleCloseModal = () => {
        this.question = false; 
        this.input = false; 
        this.props.modalChanger(null);
    }

    render() {
        const {
            nextRoute, previousRoute,
            aboutYouModel,
            errorMessages,
            currentModal
        } = this.props;
     
        var displayPhone = aboutYouModel && this.formatNumber(aboutYouModel.phoneNumber, 3, 7);
        var displaySsn = aboutYouModel.ssnOrItin && this.formatNumber(aboutYouModel.ssnOrItin, 3, 6);
        return(
            <div className="PageContainer">
                <PageHeader 
                icon="fas fa-scroll"
                title="About you"
                description="A bit of personal details about you."
                />
                {errorMessages.length > 0 && <ErrorPresent errorMessages={errorMessages} />}
                <div className="AboutYou">
                    <div className="AboutYouNameInputs">
                        <div className="AboutYouFirstName">
                            <label className="AYCompanyLabel">First name</label>
                            <input className="AboutYouInput"
                            name="firstName"
                            value={aboutYouModel.firstName}
                            onChange={this.handleChange}
                            />
                        </div>
                        <div className="AboutYouLastName">
                            <label className="AYCompanyLabel">Last name</label>
                            <input  className="AboutYouInput"
                            name="lastName"
                            value={aboutYouModel.lastName}
                            onChange={this.handleChange}
                            
                            />
                        </div>
                    </div>
                    <div className="AboutYouPhoneNumber">
                        <label className="AYCompanyLabel">Phone</label>
                        <input className="AboutYouInput"
                        name="phoneNumber"
                        value={ displayPhone || ""}
                        onChange={this.handleChange}                   
                        />
                    </div>
                    <div className="AboutYouIdentifierQuestion">
                    <label className="AYCompanyLabel">Do you have SSN or ITIN?      <i className="AyCompanyIcon far fa-question-circle" onMouseOver={this.handleQuestionModal} onMouseOut={this.handleCloseModal}></i>
                      {this.question && currentModal}
                    </label>
                    <div>
                        <input onChange ={this.handleChange} type="radio" name="IdentifierQuestion" value={true}/> Yes<br></br>
                    </div>
                    <div>
                        <input onChange={this.handleChange} type="radio" name="IdentifierQuestion" value={false}/>  No<br></br>
                    </div>
                    </div>
                    <div className="AboutYouIdentifier">
                        <label className="AYCompanyLabel">Enter SSN or ITIN number    <i className="AyCompanyIcon far fa-question-circle" onMouseOver={this.handleInputModal} onMouseOut={this.handleCloseModal}></i>
                        {this.input && currentModal}
                        </label>
                        <input className="AboutYouInput" placeholder="XXX-XXX-XXX"
                        name="ssnOrItin"
                        value={displaySsn || ""}
                        onChange={this.handleChange}
                        />
                    </div>

                </div>
                <PageFooter nextRoute={nextRoute} previousRoute={previousRoute} onNextPageClick={this.validateForm}/>

            </div>
        );
    }
}
AboutYou.propTypes = {
    nextRoute: PropTypes.string.isRequired,
    previousRoute: PropTypes.string.isRequired,
    aboutYouModel: PropTypes.object.isRequired,
    aboutYouModelChanger: PropTypes.func.isRequired,
    errorMessages: PropTypes.array.isRequired,
    validator: PropTypes.func.isRequired,
    hasNumbersOnly: PropTypes.func.isRequired,
    additionalDetailsModalOpener: PropTypes.func.isRequired,
    currentModal: PropTypes.any,
    modalChanger : PropTypes.func.isRequired,
}

export default AboutYou;