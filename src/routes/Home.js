import React, { useEffect, useState } from "react";
import { dbService } from 'fbase'
import Jweet from "components/Jweet"
import JweetFactory from "components/JweetFactory";

const Home = ({userObj}) => {
    const [jweets, setJweets] = useState([]);

    useEffect(() => {
        dbService.collection("jweets").onSnapshot(snapshot => {
            const jweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setJweets(jweetArray)
        })
    }, [])


    return (
        <div className="container">
        <JweetFactory userObj={userObj}></JweetFactory>
        <div style={{ marginTop: 30 }}>
                {jweets.map(jweet => (
                    <Jweet 
                    key={jweet.id} 
                    jweetObj={jweet} 
                    isOwner={jweet.creatorId === userObj?.uid} 
                    />
                ))}
            </div>
        </div>
    )
}
export default Home;