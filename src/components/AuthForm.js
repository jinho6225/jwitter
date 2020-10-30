import { authService } from 'fbase';
import React, { useState } from 'react';

const AuthForm =() => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [newAccount, setNewAccount] = useState(true)
    const [error, setError] = useState("")    
    const toggleAccount = () => setNewAccount((prev) => !prev)
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            let data;
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                )
            } else {
                data = await authService.signInWithEmailAndPassword(
                    email, password
                )
            }
            console.log(data)
        } catch (error) {
            setError(error.message)
        }
    }
    const onChange = (e) => {
        const { name, value } = e.target
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} className="authInput"/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className="authInput"/>
                <input type="submit" className="authInput authSubmit" value={newAccount ? "Create Account" : "Log In"}/>
                {error && <span className="authError">{error}</span>}
            </form>
            <span className="authSwitch" onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
        </>
    )
}

export default AuthForm
