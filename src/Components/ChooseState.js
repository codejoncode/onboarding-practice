import React from "react";
import { withRouter } from "react-router";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import PropTypes from "prop-types";
import UnitedStates from "../Helpers/UnitedStates";



const ChooseState = ({
    nextRoute, previousRoute,
    companyState, companyStateChanger,
    index, indexChanger, history
}) => {
    const moveToNextState = (update = false) => {
        /*The objective of this function is to display the current next state and update the current state when neccessary.*/
        if (typeof index !== "number") {
            throw Error("Index should be a number");
        }

        if (index < 0 || index > UnitedStates.length) {
            throw Error(`Index out of bounds should be between 0 and UnitedStates array length ${UnitedStates.length}`);
        }

        var nextIndex = (index + 1) % UnitedStates.length;
        if (nextIndex < 0 || nextIndex > UnitedStates.length) {
            throw Error(`${index} + 1 = ${nextIndex} and is out of bounds`);
        }

        if (update) {
            indexChanger(nextIndex);
            companyStateChanger(UnitedStates[nextIndex].toUpperCase());
        } else {
            return UnitedStates[nextIndex].toUpperCase();
        }
    }

    return (
        <div className="PageContainer">
            <PageHeader
                icon="fas fa-map-marked-alt"
                title="Choose the state"
                description="Select the state in which you want to incorporate your new company." />
            <div className="ChooseState">
                <div className="CurrentState">
                    <div className="">
                        <div className="CurrentInnerState">
                            <img alt="state" />

                        </div>
                        <h3 className="StateName">{companyState}</h3>
                        <i className="fas fa-arrow-right ChooseStateArrow" onClick={() => moveToNextState(true)}></i>
                    </div>
                </div>
                <div className="NextState">
                    <div className="">
                        <div className="NextInnerState">
                            <img alt="state" />
                        </div>
                        <h3 className="StateName">{moveToNextState()}</h3>
                    </div>
                </div>
            </div>
            <PageFooter
                previousRoute={previousRoute}
                nextRoute={nextRoute}
                isErrorPresent={false}
                onNextPageClick={() => history.push(nextRoute)}
            />
        </div>

    );
}

ChooseState.propTypes = {
    nextRoute: PropTypes.string.isRequired,
    previousRoute: PropTypes.string.isRequired,
    companyState: PropTypes.string.isRequired,
    companyStateChanger: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    indexChanger: PropTypes.func.isRequired,
}
export default withRouter(ChooseState);