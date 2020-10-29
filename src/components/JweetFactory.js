import { dbService, storageService } from 'fbase';
import React, { useState } from "react";
import { v4 as uuidv4} from "uuid"

const JweetFactory = ({ userObj }) => {
    const [jweet, setJweet] = useState("");
    const [attachment, setAttachment] = useState('')

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
    )
}

export default JweetFactory;