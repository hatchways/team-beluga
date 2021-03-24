import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext({
    userId: "",
    setUserId: () => {}
  });

export const UserContextProvider = (props) => {
    const [userId, setUserId] = useState("");
    const value = { userId, setUserId };
    useEffect(() => {
        let status;
        fetch("/getcookie", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (status === 200 && res.success === 'true') return setUserId(res.userId);
                else throw Error("error");
            })
            .catch(err => {
                setUserId("")
            });
    });
    return(
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}