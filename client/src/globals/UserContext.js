import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext({
    userId: "",
    setUserId: () => {}
  });

export const UserContextProvider = (props) => {
    const [userId, setUserId] = useState("");
    const value = { userId, setUserId };
    useEffect(() => {
        fetch("/getcookie", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200 && res.success === true) return setUserId(res.userId);
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