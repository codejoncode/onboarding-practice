import { useState } from "react";

const helper = (initializeState) => {
    return useState(initializeState);
}

//the args will except an unlimited number of arguments 
// arugments should represent the initial state. 
//and return the variable followed by a function to update that variable. 
//purpose of this function is so that state can be generated for a component all together


let useGenerateState = (...args) => {

    var length = args.length;
    const returning = [];
    for (let i = 0; i < length; i++) {
        var [x, y] = helper(args[i])// is the part that would be the problem. 
        returning.push(x);
        returning.push(y);
    }

    return returning;
}
export { useGenerateState };