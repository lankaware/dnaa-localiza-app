import { React, createContext, useState, useEffect } from 'react'
import jsonwebtoken from 'jsonwebtoken'

const Context = createContext()

function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false)
    const [username, setUsername] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const secret = process.env.REACT_APP_SECRET  
                jsonwebtoken.verify(token, secret)
                setAuthenticated(true)
                setUsername(localStorage.getItem('name'))
            } catch {
                setAuthenticated(false)
                setUsername('Anônimo')
            }
        }
    }, [])

    const userSign = (token, userName) => {
        if (token) {
            setAuthenticated(true)
            setUsername(userName)
            localStorage.setItem('token', token)
            localStorage.setItem('name', userName)

        } else {
            setAuthenticated(false)
            setUsername('Anônimo')
            localStorage.setItem('token', '')
            localStorage.setItem('name', 'Anônimo')
        }
    }
    return (
        <Context.Provider value={{ authenticated, username, userSign }}>
            {children}
        </Context.Provider>
    )
}

export { Context, AuthProvider }