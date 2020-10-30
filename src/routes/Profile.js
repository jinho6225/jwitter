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
        <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
            <input type="text" placeholder="Display name" autoFocus onChange={onChange} className="formInput" />
            <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }} />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
    );
};
