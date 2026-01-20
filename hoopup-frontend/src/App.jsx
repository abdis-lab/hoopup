// App.jsx
// This is the "brain" of our application.
// It holds all the state and functions.
// It decides which components to show and passes them what they need.
import './App.css'
import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

// Import our components
import Login from './components/Login'
import Register from './components/Register'
import SessionForm from './components/SessionForm'
import SessionList from './components/SessionList'

function App() {
    // ============ STATE ============
    // All state lives here in the parent component.
    // We pass pieces of state down to children as needed.

    // Auth state
    const [username, setUsername] = useState(localStorage.getItem('username') || '')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [message, setMessage] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)

    // Session form state
    const [locationName, setLocationName] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [note, setNote] = useState('')

    // Sessions data
    const [sessions, setSessions] = useState([])

    // ============ FUNCTIONS ============
    // All functions live here too. We pass them down as props.

    async function handleRegister() {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })

        if (response.ok) {
            setMessage('Registration successful! Please login.')
            setIsRegistering(false)
            setUsername('')
            setEmail('')
            setPassword('')
        } else {
            const data = await response.json()
            setMessage(Object.values(data).join(', '))
        }
    }

    async function handleLogin() {
        try {
            console.log("handleLogin fired", { username });

            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.text();
            console.log("login response", response.status, data);

            if (data.startsWith("ey")) {
                setToken(data);
                setMessage("Login successful");
                fetchSessions(data);
                localStorage.setItem('token', data)
                localStorage.setItem('username', username)
            } else {
                setMessage(data);
            }
        } catch (err) {
            console.error("Login request failed:", err);
            setMessage("Login failed (network/CORS/server issue). Check console.");
        }
    }


    async function fetchSessions(authToken) {
        const response = await fetch(`${API_URL}/sessions`, {
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
        })

        const data = await response.json()
        setSessions(data)
    }

    async function handleCreateSession() {
        const response = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                locationName: locationName,
                date: date,
                startTime: startTime,
                endTime: endTime,
                note: note
            })
        })

        if (response.ok) {
            fetchSessions(token)
            setLocationName('')
            setDate('')
            setStartTime('')
            setEndTime('')
            setNote('')
        }
    }

    async function handleJoin(sessionId) {
        const response = await fetch(`${API_URL}/sessions/` + sessionId + '/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                username: username
            })
        })

        if (response.ok) {
            fetchSessions(token)
        }
    }

    async function handleLeave(sessionId) {
        const response = await fetch(`${API_URL}/sessions/` + sessionId + '/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                username: username
            })
        })

        if (response.ok) {
            fetchSessions(token)
        }
    }

    useEffect(() => {
        if (token){
            fetchSessions(token)
        }
    }, [])

    // ============ RENDER ============
    // This is much cleaner now! We can see the structure at a glance.

    return (
        <div className="min-h-screen py-8 px-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">🏀 HoopUp</h1>

            {!token ? (
                <div>
                    {isRegistering ? (
                        <Register
                            username={username}
                            setUsername={setUsername}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            handleRegister={handleRegister}
                            message={message}
                            setIsRegistering={setIsRegistering}
                        />
                    ) : (
                        <Login
                            username={username}
                            setUsername={setUsername}
                            password={password}
                            setPassword={setPassword}
                            handleLogin={handleLogin}
                            message={message}
                            setIsRegistering={setIsRegistering}
                        />
                    )}
                </div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
                        <p className="text-gray-700">Welcome, <span className="font-bold">{username}</span>!</p>
                        <button
                            onClick={() => {
                                setToken('')
                                setUsername('')
                                setPassword('')
                                localStorage.removeItem('token')
                                localStorage.removeItem('username')
                            }}
                            className="text-red-500 hover:underline"
                        >
                            Logout
                        </button>
                    </div>

                    <SessionForm
                        locationName={locationName}
                        setLocationName={setLocationName}
                        date={date}
                        setDate={setDate}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                        note={note}
                        setNote={setNote}
                        handleCreateSession={handleCreateSession}
                    />

                    <SessionList
                        sessions={sessions}
                        handleJoin={handleJoin}
                        handleLeave={handleLeave}
                    />
                </div>
            )}
        </div>
    )
}

export default App