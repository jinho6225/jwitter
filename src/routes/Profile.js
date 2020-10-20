import { authService, dbService } from "fbase";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default ({ userObj }) => {
    const history =useHistory();
    const onLogOutClick = () => {
        authService.signOut()
        history.push("/")
    };
    const getMyJweets = async() => {
        const jweets = await dbService
        .collection("jweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt")
        .get();
        console.log(jweets.docs.map((doc) => doc.data()))
    }
    useEffect(() => {
        getMyJweets();
    }, [])
    return (
        <>
            <button onClick={onLogOutClick}>Sign Out</button>
        </>
    );
};
