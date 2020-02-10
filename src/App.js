import React, { useState } from 'react';
import './App.css';
import ChooseState from './Components/ChooseState';
import MailingAddress from './Components/MailingAddress';
import AboutYourCompany from './Components/AboutYourCompany';
import AboutYou from './Components/AboutYou';
import BoardOfDirectors from './Components/BoardOfDirectors';
import BusinessDetails from './Components/BusinessDetails';
import {Route, Switch} from "react-router"; 
import { BrowserRouter as Router} from "react-router-dom";
import MailingAddressModel from './Models/MailingAddressModel';
import AboutYourCompanyModel from './Models/AboutYourCompanyModel';
import AboutYouModel from "./Models/AboutYouModel";
import BusinessDetailsModel from './Models/BusinessDetailsModel';
import ConfirmDelete from "./Components/ConfirmDelete";
import AdditionalDetailsModal from './Components/AdditionalDetailsModal';

const onboardMapping = {
  "/chooseState" : {next: "/mailingAddress", previous: "/businessDetails"},
  "/mailingAddress": {next: "/aboutYourCompany", previous: "/chooseState"},
  "/aboutYourCompany": {next: "/aboutYou" , previous: "/mailingAddress"},
  "/aboutYou" : {next: "/boardOfDirectors" , previous: "/aboutYourCompany"},
  "/boardOfDirectors"  : {next: "/businessDetails" , previous: "/aboutYou"},
  "/businessDetails" : {next: "/chooseState" , previous: "/boardOfDirectors"},
}

const letters = {a: 'a',
b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g', h: 'h', i: 'i', j: 'j',
k: 'k', l: 'l', m: 'm', n: 'n', o: 'o', p: 'p', q: 'q', r: 'r', s: 's',
t: 't', u: 'u', v: 'v', w: 'w', x: 'x', y: 'y', z: 'z', '-': '-', };
const numbers = {0:0, 1: 1, 2: 2, 3: 3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9};

const errorsCurrentlyLogged = {
  BusinessDetails: {},
  MailingAddress: {},
  AboutYourCompany: {},
  AboutYou: {},
  BoardOfDirectors: {},
};

const errorMessageBank = {
   BusinessDetails: {
     1 : "There is a problem with the number of shares input.",
     2 : "Should only be number and a minimum of 1000 shares.", 
     3 : "There is a problem with the per value input.", 
     4 : "Should only be a number and a minimum of $1.00",
   },
   MailingAddress:{
    1: "The Street address appears incorrect.",
    2: "The Street Address should include letters and numbers.",
    3: "The City appears incorrect.",
    4: "The City should only contain letters.",
    5: "The Pin code appears incorrect.",
    6: "The Pin code should feature all numbers.",
   },
   AboutYourCompany: {
    1: "The Company name appears incorrect",
    2: "The Company name should only include letters and numbers and should be at least 5 characters.",
    3: "The Business description appears incorrect.",
    4: "The Business description should only include letters adn numbers and be at least 25 characters long.",
   },
   AboutYou: {
    1: "There appears to be an issue with First Name.",
    2: "First Name cannot contain any special characters.",
    3: "There appears to be an issue with Last Name.",
    4: "Last Name cannot contain any special characters",
    5: "There appears to be an issue with Phone number.",
    6: "Phone number should only feature numbers.",
    7: "Please answer the question Do you have SSN or ITIN",
    8: "There appears to be an issue with SSN/ITIN.",
    9: "If you have answered yes to having a SSN or ITIN please enter it in.",
    10: "You need to have a SSN or ITIN",
   },
   BoardOfDirectors : {
    1: "There is an issue with the First name",
    2: "First name should be longer and not include any special characters",
    3: "There is an issue with the Last name",
    4: "Last name should be longer and not include any special characters",      
    5: "First name has input remove it or finish adding the director",
    6: "Last name has input remove it or finish adding the director"
   }
}

const hasLettersOnly = (name) => { 
  if(typeof name !== "string"){
      throw new TypeError(`The argument name has a type of ${typeof name} and should be of type string`);
  }
  var notAnError = true; 
  for(let i = 0; i< name.length; i++){
      var char = name[i].toLowerCase(); 
      if(char !== ' '){
        if( (char in letters) === false){
            notAnError = false; 
            return notAnError; 
        }
      }
  }
  return notAnError;
}

const removeDecimalComma = (number) => {
  if(typeof number !== "string"){
    throw new TypeError(`The argument number has a type of ${typeof number} and should be of type string`);
  }

  var newNumber = "";
  var decimalCount = 0; 

  for(let i = 0; i<number.length; i++){
    var char = number[i];
    if(char === '.'){
      decimalCount += 1;
    } else if (char === ","){
    } else {
      newNumber += char; 
    }
  }
  return [newNumber, decimalCount <= 1]; 
}

const hasNumbersOnly = (number, phone=true) => {
  var [newNumber, notAnError] = removeDecimalComma(number);

  if(typeof newNumber !== "string"){
      // throw new TypeError(`The argument number has a type of ${typeof newNumber} and should be of type string`);  used for developing only
      return false;
  }
  if(notAnError === false){
    return true; 
  }

  let dashCount = 0;
  if(notAnError === true){
    for(let i = 0; i<newNumber.length; i++){
        var char = newNumber[i]; 
        if(char !== '-'){
            if(isNaN(Number(char))){
                return false; 
            }
        }else if(char === '-'){
            dashCount += 1; 
            if(dashCount > 2 && phone === true){
                return false;
            } else if (dashCount > 2 && phone === false){
                return false;
            }
        } else{
            throw new TypeError(`${char} should not be in the phone number`);
        }
    }
  }
  return true;
}



function App() {
  /*Begining of Choose State Component State*/
  const chooseStateComponentState = {};
  [chooseStateComponentState.companyState, chooseStateComponentState.companyStateChanger] = useState("ALABAMA");
  [chooseStateComponentState.index, chooseStateComponentState.indexChanger] = useState(0);
  /*End of Choose State Component State*/

  /*Begining of Mailing Address Component State*/
  const mailingAddressComponentState = new MailingAddressModel("Afghanistan", "Alabama", "", "", "");
  const [mailingAddressModel, mailingAddressModelChanger] = useState(mailingAddressComponentState);
  /*End of Mailing Address Component State*/

  /*Begining of About your Company Component State*/
  const aboutYourCompanyComponentState = new AboutYourCompanyModel("", "Inc.", "");
  const [aboutYourCompanyModel, aboutYourCompanyModelChanger] = useState(aboutYourCompanyComponentState);
  /*End of About your Company Component State*/

  /*Begining of About you Component State*/
  const aboutYouComponentState = new AboutYouModel("", "", "", "", "false");
  const [aboutYouModel, aboutYouModelChanger] = useState(aboutYouComponentState);
  /*Begining of About you Component State*/

  /*Begining of Board of Directors Company Component State*/
  const [boardOfDirectorsList, boardOfDirectorsListChanger] = useState([{firstName: "Jonathan", lastName: "Doe"}]);
  /*End of Board of Directors Company Component State*/

  /*Begining of Business Details Component State*/
  const businessDetailsComponentState = new BusinessDetailsModel("Sole Proprietorship", "", "");
  const [businessDetailsModel, businessDetailsModelChanger] = useState(businessDetailsComponentState);
  /*End of Business Details Component State*/

  /*Begining of Error Present Component props*/
  const [errorMessages, errorMessagesChanger] = useState([]);

  const addErrorMessage = async (message) => {
    await errorMessagesChanger([...errorMessages, message]);
  }

  const addMultipleMessages = async (messages) => {
    await errorMessagesChanger([...errorMessages, ...messages]);
  }

  const clearErrorMessage = async (componentName = null) => {
    await errorMessagesChanger([]);
    if(componentName && componentName in errorsCurrentlyLogged){
      errorsCurrentlyLogged[componentName] = {};
    }
  }

  const deleteErrorMessage = async (newErrorMessages) => {
    await errorMessagesChanger(newErrorMessages);
  }
  /*End of Error Present Component props*/

  /*Begining Modal Mapping*/
  const [currentModal, currentModalChanger] = useState(null);
  
  const confirmDeleteModal = (index) => {
    if(index !== null && typeof index === "number"){
      var nameObject = boardOfDirectorsList[index];
      var name = `${nameObject.firstName} ${nameObject.lastName}`;
      return <ConfirmDelete nameToDelete={name}
      boardOfDirectorsList={boardOfDirectorsList}
      boardOfDirectorsListChanger={boardOfDirectorsListChanger}
      index={index}
      currentModalChanger={currentModalChanger}
      />
    } else {
      throw new Error(`Something is wrong! ${index} is type ${typeof index} required to be type number`);
    }
  }
  const additionalDetailsModalOpener = (description, className) => {
    console.log("Inside of the modal opener");
    currentModalChanger(<AdditionalDetailsModal
      modalChanger={currentModalChanger}
      description={description}
      className={`AdditionalDetailsModal ${className}`}
    />);
  }

  const displayNoModal = () => {
    return null; 
  }

  
  /*Used for all apps*/
  const modalManager = (key, value=null) => {
    const modalMapping = {
      confirmDelete: confirmDeleteModal,
      displayNoModal: displayNoModal,
    }

    if(key in modalMapping){
      if(value !== null){
        currentModalChanger(modalMapping[key](value));

      } else {
        currentModalChanger(modalMapping[key]());
      }
    } else {
      throw new Error(`The key argument has a value of ${key} and is not present in the modal mapping object`);
    }
  }
  
  const validator = async (isErrorPresent, errorIndex1, errorIndex2, bankKey) => {
    if(isErrorPresent === false){
        if((errorIndex1 in errorsCurrentlyLogged[bankKey])){
            delete errorsCurrentlyLogged[bankKey][errorIndex1];
        }
        if((errorIndex2 in errorsCurrentlyLogged[bankKey] )){
            delete errorsCurrentlyLogged[bankKey][errorIndex2];
        }
       
        var newErrormessages = []; 
        for(let i = 0; i<errorMessages.length; i++){
            var error = errorMessages[i];
            if(error !== errorMessageBank[bankKey][errorIndex1]
                && error !== errorMessageBank[bankKey][errorIndex2]){
                    newErrormessages.push(error);
                }
        }
        await deleteErrorMessage(newErrormessages);
    }
    else if (isErrorPresent === true){
        if((errorIndex1 in errorsCurrentlyLogged[bankKey]) === false 
          && (errorIndex2 in errorsCurrentlyLogged[bankKey]) === false){
            var messageOne = errorMessageBank[bankKey][errorIndex1];
            var messageTwo = errorMessageBank[bankKey][errorIndex2];
            var messages = [messageOne,messageTwo];
            errorsCurrentlyLogged[bankKey][errorIndex1] = messageOne;
            errorsCurrentlyLogged[bankKey][errorIndex2] = messageTwo;
            await addMultipleMessages(messages);
          }
        else if((errorIndex1 in errorsCurrentlyLogged[bankKey] ) === false){
            errorsCurrentlyLogged[bankKey][errorIndex1] = errorMessageBank[bankKey][errorIndex1];
            await addErrorMessage(errorMessageBank[bankKey][errorIndex1]);
        }
        else if((errorIndex2 in errorsCurrentlyLogged[bankKey] ) === false){
            errorsCurrentlyLogged[bankKey][errorIndex2] = errorMessageBank[bankKey][errorIndex2];
            await addErrorMessage(errorMessageBank[bankKey][errorIndex2]);
        }
    }
    else {
        throw new Error(`Something went wrong. isErrorPresent is not true or false. isErrorPresent = ${isErrorPresent}`);
    }
  }
  /*Used for all apps*/
  
  /*End Modal Mapping*/
  return (
    <Router>
    <div className="App">
        {/* {currentModal} */}
        <Switch>
          <Route exact path="/chooseState" render={(props) => <ChooseState {...props} 
          nextRoute={onboardMapping["/chooseState"].next} 
          previousRoute={onboardMapping["/chooseState"].previous} 
          companyStateChanger={chooseStateComponentState.companyStateChanger}
          companyState={chooseStateComponentState.companyState}
          index={chooseStateComponentState.index}
          indexChanger={chooseStateComponentState.indexChanger}
          />}/>
          <Route path="/mailingAddress" render={(props) => <MailingAddress {...props} 
          nextRoute={onboardMapping["/mailingAddress"].next} 
          previousRoute={onboardMapping["/mailingAddress"].previous} 
          mailingAddressModel={mailingAddressModel}
          mailingAddressModelChanger={mailingAddressModelChanger}
          errorMessages={errorMessages}
          validator={validator}
          letters={letters}
          numbers={numbers}
          /> }/>
          <Route path="/aboutYourCompany" render={(props) => <AboutYourCompany  {...props} 
          nextRoute={onboardMapping["/aboutYourCompany"].next}
          previousRoute={onboardMapping["/aboutYourCompany"].previous} 
          aboutYourCompanyModel={aboutYourCompanyModel}
          aboutYourCompanyModelChanger={aboutYourCompanyModelChanger}
          errorMessages={errorMessages}
          validator={validator}
          additionalDetailsModalOpener={additionalDetailsModalOpener}
          currentModal={currentModal}
          />}/>
          <Route path="/aboutYou" render={(props) => <AboutYou  {...props}
          nextRoute={onboardMapping["/aboutYou"].next}
          previousRoute={onboardMapping["/aboutYou"].previous}
          aboutYouModel={aboutYouModel}
          aboutYouModelChanger={aboutYouModelChanger}
          errorMessages={errorMessages}
          hasLettersOnly={hasLettersOnly }
          validator={validator}
          hasNumbersOnly={hasNumbersOnly}
          additionalDetailsModalOpener={additionalDetailsModalOpener}
          currentModal={currentModal}
          modalChanger={currentModalChanger}
          />}/>
          <Route path="/boardOfDirectors" render={(props) => <BoardOfDirectors {...props}
          nextRoute={onboardMapping["/boardOfDirectors"].next}
          previousRoute={onboardMapping["/boardOfDirectors"].previous} 
          boardOfDirectorsList={boardOfDirectorsList}
          boardOfDirectorsListChanger={boardOfDirectorsListChanger}
          errorMessages={errorMessages}
          clearErrorMessage={clearErrorMessage}
          hasLettersOnly={hasLettersOnly}
          modalManager={modalManager}
          currentModal={currentModal}
          validator={validator}
          />}/>
          <Route path="/businessDetails" render={(props) => <BusinessDetails {...props}
          nextRoute={onboardMapping["/businessDetails"].next}
          previousRoute={onboardMapping["/businessDetails"].previous}
          businessDetailsModel={businessDetailsModel}
          businessDetailsModelChanger={businessDetailsModelChanger}
          errorMessages={errorMessages}
          validator={validator}
          hasNumbersOnly={hasNumbersOnly}
          additionalDetailsModalOpener={additionalDetailsModalOpener}
          currentModal={currentModal}
          modalChanger={currentModalChanger}
          />}/>
        </Switch>
        
    </div>
    </Router>
  );
}

export default App;