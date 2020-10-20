import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
    const onLogOutClick = () => {
        authService.signOut()
        history.push("/")
    };
    // const getMyJweets = async() => {
    //     const jweets = await dbService
    //     .collection("jweets")
    //     .where("creatorId", "==", userObj.uid)
    //     .orderBy("createdAt")
    //     .get();
    //     console.log(jweets.docs.map((doc) => doc.data()))
    // }
    // useEffect(() => {
    //     getMyJweets();
    // }, [])
    const onChange = (e) => {
        const { value } = e.target
        setNewDisplayName(value)
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            })
            refreshUser();
        }
    }
    return (
        <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display name" onChange={onChange} />
            <input type="submit" value="Update Profile" />
        </form>
            <button onClick={onLogOutClick}>Sign Out</button>
        </>
    );
};
