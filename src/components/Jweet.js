import { dbService, storageService } from "fbase";
import React, {useState} from "react";
import { isElement } from "react-dom/test-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Jweet = ({jweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false)
    const [newJweet, setNewJweet] = useState(jweetObj.text)
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this jweet?");
        if (ok) {
            await dbService.doc(`jweets/${jweetObj.id}`).delete();
            await storageService.refFromURL(jweetObj.attachmentUrl).delete();
        } 
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (e) => {
        e.preventDefault()
        await dbService.doc(`jweets/${jweetObj.id}`).update({
            text: newJweet
        })
        setEditing(false)
    }
    const onChange = (e) => {
        const { value } = e.target
        setNewJweet(value)
    }
    return (
        <div className="nweet">

{
    editing 
    ? 
    (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
                <input type="text" placeholder="Edit your jweet" value={newJweet} required autoFocus onChange={onChange} className="formInput"/>
                <input type="submit" value="Update Jweet" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>        </>
    )
    : 
    (
        <>
            <h4>{jweetObj.text}</h4>
            {jweetObj.attachmentUrl && <img src={jweetObj.attachmentUrl} />}
            {isOwner && (
                <div className="nweet__actions">
                    <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                </div>
            )}
        </>
    )}
        </div>
    )
}

export default Jweet;