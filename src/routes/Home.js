import React, { useEffect, useState } from "react";
import { dbService } from 'fbase'

const Home = ({userObj}) => {
    const [jweet, setJweet] = useState("");
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

    const onSubmit = async (e) => {
        e.preventDefault();
        let data = await dbService.collection("jweets").add({
            text:jweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        })
        console.log(data)
        setJweet("")
    }

    const onChange = (e) => {
        const { value } = e.target;
        setJweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={jweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Jweet" />
            </form>
            <div>
                {jweets.map(jweet => (
                <div key={jweet.id}>
                    <h4>{jweet.text}</h4>
                </div>
                ))}
            </div>
        </div>
    )
}
export default Home;