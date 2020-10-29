import React, { useEffect, useState } from "react";
import { dbService, storageService } from 'fbase'
import Jweet from "components/Jweet"
import JweetFactory from "components/JweetFactory";

const Home = ({userObj}) => {
    const [jweets, setJweets] = useState([]);
    const getJweets = async () => {
        const dbjweets = await dbService.collection("jweets").get()
        dbjweets.forEach(document => {
            const jweetObect = {
                ...document.data(),
                id: document.id,
            }
            setJweets((prev) => [jweetObect, ...prev])
        })
    }
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
        <div>
            <JweetFactory userObj={userObj}></JweetFactory>
            <div>
                {jweets.map(jweet => (
                    <Jweet 
                    key={jweet.id} 
                    jweetObj={jweet} 
                    isOwner={jweet.creatorId === userObj.uid} 
                    />
                ))}
            </div>
        </div>
    )
}
export default Home;