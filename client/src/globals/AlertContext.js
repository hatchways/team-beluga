import React, { useState, createContext } from "react";

export const AlertContext = createContext();

export const AlertContextProvider = (props) => {
    const [alertStatus, setAlertStatus] = useState({
        isOpen:false,
        message:"",
        type:""
    });
    const value = { alertStatus, setAlertStatus };
    return(
        <AlertContext.Provider value={value}>
            {props.children}
        </AlertContext.Provider>
    );
}