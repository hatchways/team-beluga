import React, { useState, createContext } from "react";

export const UserContext = createContext({
    userId: "",
    setUserId: () => {}
  });

export const UserContextProvider = (props) => {
    const [userId, setUserId] = useState("");
    const value = { userId, setUserId };
    return(
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}