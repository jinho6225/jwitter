import { dbService, storageService } from 'fbase';
import React, { useState } from "react";
import { v4 as uuidv4} from "uuid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const JweetFactory = ({ userObj }) => {
    const [jweet, setJweet] = useState("");
    const [attachment, setAttachment] = useState('')

    const onSubmit = async (e) => {
        if (jweet === "") {
            return;
          }
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
    const onclearAttachment = () => setAttachment("")


    return (
        <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            value={jweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        
                        <input 
                                id="attach-file"
                                type="file"
                                accept="image/*"
                                onChange={onFilechange}
                                style={{
                                  opacity: 0,
                                }}
                        />

                    {attachment && (
                        <div className="factoryForm__attachment">
                            <img
                            src={attachment}
                            style={{
                                backgroundImage: attachment,
                            }}
                            />
                            <div className="factoryForm__clear" onClick={onclearAttachment}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                            </div>      
                        </div>    
                    )}
        </form>
    )
}

export default JweetFactory;