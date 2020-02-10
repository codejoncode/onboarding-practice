import React, {Component} from "react";
import PropTypes from "prop-types";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import BusinessDetailsModel from "../Models/BusinessDetailsModel";
import Selector from "./Selector";
import ErrorPresent from "./ErrorPresent";

class BusinessDetails extends Component{
    constructor(props){
       super(props);
       this.state = new BusinessDetailsModel("Sole Proprietorship", "", "");
       this.errorBank = {
           shareCount: [1,2],
           perValue: [3,4]
       }
       this.minimum = {
           shareCount: 1000,
           perValue : 1
       }
       this.componentName = "BusinessDetails";
    }

    nextPage = async (route) => {
      await this.validateInput("shareCount", this.props.businessDetailsModel.shareCount); 
      await this.validateInput("perValue", this.props.businessDetailsModel.perValue);

      if(this.props.errorMessages.length === 0){
        await this.props.history.push(route);
      }
    }

    addCommas = (value) => {
        var storage = {};
        let isDecimalPresent = false; 
        let noCommasString = ""; 
        var char; 
        for(let i = 0; i<value.length; i++){
          char = value[i];
          storage[char] = i; 
        if(char === '.'){
            isDecimalPresent = true;
            break; 
        } else if (char !== ','){
            noCommasString += char; 
        }
        }
    
        var newValue = "";
        let charCount = 0; 
        var previousChar = "";
        if(isDecimalPresent === true){
        var decimalIndex = storage['.'];
        for(let i = noCommasString.length-1; i > -1; i--){
            char = noCommasString[i];
            if(charCount % 3 === 0 
            && char !== ','
            && previousChar !== '.'
            && charCount > 0){
                newValue =  char + ',' + newValue;
            } else {
                newValue = char + newValue;  
                }
                charCount += 1; 
                previousChar = char;
        }

        for(let i = decimalIndex; i < value.length; i++){
            newValue += value[i];
        }
        } else {
        for(let i = noCommasString.length-1; i> -1; i--){
            char = noCommasString[i];
            if(char !== ','){
            if(charCount % 3 === 0 
                && char !== ','
                && previousChar !== '.'
                && charCount > 0){
                newValue =  char + ',' + newValue;
            } else {
                newValue = char + newValue;  
                }
                charCount += 1; 
                previousChar = char; 
            }
        }
        }
        return newValue;
    }

   validateInput = async (name, value) => {
    if(typeof value !== "string"){
        throw new Error(`value argument = ${value} and is type ${typeof value} should be of type string`);
    }
    var [errorIndex1, errorIndex2] = this.errorBank[name];

    var onlyNumbers = await this.props.hasNumbersOnly(value,false);
    if(onlyNumbers === false){
         await this.props.validator(true, errorIndex1, errorIndex2, this.componentName);
         return; 
    }

    var meetsminmum = Number.parseFloat(value) >= this.minimum[name];
    if(meetsminmum === false){
        await this.props.validator(true, errorIndex1, errorIndex2, this.componentName);
        return;
    }

    if(onlyNumbers === true && meetsminmum === true){
        await this.props.validator(false, errorIndex1, errorIndex2, this.componentName);
    }
   }

   handleChange = (e) => {
        const nameToValidationMapping = {
            shareCount: this.validateInput,
            perValue: this.validateInput,
        }
        if(e.target.name in nameToValidationMapping){
            nameToValidationMapping[e.target.name](e.target.name, e.target.value);
        }
        this.setState({[e.target.name]: e.target.value}, () => this.props.businessDetailsModelChanger(this.state));
    }
    handleOpenModal = () => {
        const className = "BusinessDetailsModal";
        const message = "You may to look at your business paper work regarding the type of your corporation";
        this.props.additionalDetailsModalOpener(message, className);
    }
    handleCloseModal = () => {
        this.props.modalChanger(null);
    }

    render() {
       const  {
            businessDetailsModel,
            nextRoute, previousRoute,
            errorMessages, currentModal
        } = this.props; 
        const data = ["Sole Proprietorship", "Parnership", "Corporation", "Limited Liability Company", "Cooperative"];
        var shareCountDisplay = this.addCommas(businessDetailsModel.shareCount);
        var perValueDisplay =  this.addCommas(businessDetailsModel.perValue);
        
        return (
            <div className="PageContainer">
                <PageHeader 
                    icon="fas fa-file-invoice-dollar"
                    title="Business details"
                    description="Details about your business corporation and shares."
                />
                {errorMessages.length > 0 && <ErrorPresent errorMessages={errorMessages} />}
                <div className="BusinessDetails">
                    <label className="BDCorpLabel">Type of corporation  <i className="AyCompanyIcon far fa-question-circle" onMouseOver={this.handleOpenModal} onMouseOut={this.handleCloseModal}></i>{currentModal}</label>
                    <Selector 
                        nameOfClass="BDCorpSelect"
                        name="corpType"
                        value={businessDetailsModel.corpType}
                        handleChange={this.handleChange}
                        data={data}
                    />
                    
                    <div className="BDShareInformation">
                        <label className="BDNumberOfShares">Number of shares</label>
                        <label className="BDPerValue">Per value</label>
                        <input className="BDSharesInput"
                            name="shareCount"
                            value={shareCountDisplay}
                            onChange={this.handleChange}
                        />
                        <input className="BDValueInput" 
                            name="perValue"
                            value={perValueDisplay}
                            onChange={this.handleChange}
                        /> 
                    </div>
                    <div className="MailingDisclaimer">                    
                        <i className="MailingIcon fas fa-clipboard"></i>
                        <p>These are the standard values for number of shares and per value in many top tier companies choose to get started.</p>         
                    </div>
                </div>
                <PageFooter 
                nextRoute={nextRoute}
                previousRoute={previousRoute}
                onNextPageClick={this.nextPage}
                />
            </div>
        );
    }
}

BusinessDetails.propTypes = {
    nextRoute: PropTypes.string.isRequired,
    previousRoute: PropTypes.string.isRequired,
    businessDetailsModel: PropTypes.object.isRequired,
    businessDetailsModelChanger : PropTypes.func.isRequired,
    errorMessages: PropTypes.array.isRequired,
    hasNumbersOnly: PropTypes.func.isRequired,
    validator: PropTypes.func.isRequired,
    additionalDetailsModalOpener: PropTypes.func.isRequired,
    currentModal: PropTypes.any,
    modalChanger: PropTypes.func.isRequired,
}

export default BusinessDetails;
