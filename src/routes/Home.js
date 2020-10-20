import React, { useEffect, useState } from "react";
import { dbService, storageService } from 'fbase'
import { v4 as uuidv4} from "uuid"
import Jweet from "components/Jweet"

const Home = ({userObj}) => {
    const [jweet, setJweet] = useState("");
    const [jweets, setJweets] = useState([]);
    const [attachment, setAttachment] = useState('')
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
        let attachmentUrl = ""
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url")
            attachmentUrl = await response.ref.getDownloadURL();
        };
        const jweetObj = {
            text:jweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await dbService.collection("jweets").add(jweetObj)
        setJweet("");
        setAttachment("");
    }

    const onChange = (e) => {
        const { value } = e.target;
        setJweet(value);
    }
    const onFilechange = (e) => {
        const { files } = e.target
        const theFile = files[0]
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            console.log(finishedEvent)
            const { result } = finishedEvent.currentTarget
            setAttachment(result)
        }
        reader.readAsDataURL(theFile);
    }
    const onclearAttachment = () => setAttachment(null)

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={jweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFilechange} />
                <input type="submit" value="Jweet" />
                    {attachment && 
                        <div>
                        <img src={attachment} width="50px" height="50px" alt="" />
                        <button onClick={onclearAttachment}>Clear</button>
                        </div>    
                    }
            </form>
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