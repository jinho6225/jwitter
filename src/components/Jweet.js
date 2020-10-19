import { dbService, storageService } from "fbase";
import React, {useState} from "react";
import { isElement } from "react-dom/test-utils";

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
        <div >
{
    editing 
    ? 
    (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit your jweet" value={newJweet} required onChange={onChange}/>
                <input type="submit" value="Update Jweet"/>
            </form>
            <button onClick={toggleEditing}>Cancel</button>
        </>
    )
    : 
    (
        <>
            <h4>{jweetObj.text}</h4>
            {jweetObj.attachmentUrl && <img src={jweetObj.attachmentUrl} width="50px" height="50px"/>}
            {isOwner && (
                <>
                    <button onClick={onDeleteClick}>Delete Jweet</button>
                    <button onClick={toggleEditing}>Edit Jweet</button>
                </>
            )}
        </>
    )}
        </div>
    )
}

export default Jweet;