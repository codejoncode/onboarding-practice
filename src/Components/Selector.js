import React from "react";
import PropTypes from "prop-types";

const Selector = ({ data, nameOfClass, name, handleChange, value }) => {

    return (
        <select className={nameOfClass} onChange={handleChange} name={name} value={value}>
            {data.map((opt) => <option value={opt} key={opt}>{opt}</option>)}
        </select>
    );
}

Selector.propTypes = {
    data: PropTypes.array.isRequired,
    nameOfClass: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    handleChange: PropTypes.func.isRequired,

}
export default Selector; 