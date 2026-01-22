import './App.css'
import { useState, useEffect } from "react"
import toast, { Toaster } from 'react-hot-toast'

// Import our components
import Login from './components/Login'
import Register from './components/Register'
import SessionForm from './components/SessionForm'
import SessionList from './components/SessionList'

const API_URL = import.meta.env.VITE_API_URL

function App() {
    // ============ STATE ============
    // Auth state
    const [username, setUsername] = useState(localStorage.getItem('username') || '')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [message, setMessage] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)

    // Loading states
    const [isLoading, setIsLoading] = useState(false)
    const [sessionsLoading, setSessionsLoading] = useState(false)

    // Session form state
    const [locationName, setLocationName] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [note, setNote] = useState('')

    // Sessions data
    const [sessions, setSessions] = useState([])

    // ============ FUNCTIONS ============

    async function handleRegister() {
        setIsLoading(true)
        try {
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
                toast.success('Registration successful! Please login.')
                setIsRegistering(false)
                setUsername('')
                setEmail('')
                setPassword('')
                setMessage('')
            } else {
                const data = await response.json()
                const errorMsg = Object.values(data).join(', ')
                setMessage(errorMsg)
                toast.error(errorMsg)
            }
        } catch (err) {
            console.error('Registration failed:', err)
            toast.error('Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleLogin() {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.text()

            if (data.startsWith("ey")) {
                setToken(data)
                setMessage("")
                localStorage.setItem('token', data)
                localStorage.setItem('username', username)
                toast.success(`Welcome back, ${username}!`)
                fetchSessions(data)
            } else {
                setMessage(data)
                toast.error(data)
            }
        } catch (err) {
            console.error("Login request failed:", err)
            toast.error("Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchSessions(authToken) {
        setSessionsLoading(true)
        try {
            const response = await fetch(`${API_URL}/sessions`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
            })

            if (response.ok) {
                const data = await response.json()
                setSessions(data)
            } else {
                toast.error('Failed to load sessions')
            }
        } catch (err) {
            console.error('Failed to fetch sessions:', err)
            toast.error('Failed to load sessions')
        } finally {
            setSessionsLoading(false)
        }
    }

    async function handleCreateSession() {
        if (!locationName || !date || !startTime || !endTime) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
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
                toast.success('Session created successfully!')
                fetchSessions(token)
                setLocationName('')
                setDate('')
                setStartTime('')
                setEndTime('')
                setNote('')
            } else {
                toast.error('Failed to create session')
            }
        } catch (err) {
            console.error('Failed to create session:', err)
            toast.error('Failed to create session')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleJoin(sessionId) {
        try {
            const response = await fetch(`${API_URL}/sessions/${sessionId}/join`, {
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
                toast.success('Joined session!')
                fetchSessions(token)
            } else {
                toast.error('Failed to join session')
            }
        } catch (err) {
            console.error('Failed to join session:', err)
            toast.error('Failed to join session')
        }
    }

    async function handleLeave(sessionId) {
        try {
            const response = await fetch(`${API_URL}/sessions/${sessionId}/leave`, {
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
                toast.success('Left session')
                fetchSessions(token)
            } else {
                toast.error('Failed to leave session')
            }
        } catch (err) {
            console.error('Failed to leave session:', err)
            toast.error('Failed to leave session')
        }
    }




    async function handleDeleteSession(sessionId) {
        if (!window.confirm('Are you sure you want to delete this session?')) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })

            if (response.ok) {
                toast.success('Session deleted successfully!')
                fetchSessions(token)
            } else {
                const errorMsg = await response.text()
                toast.error(errorMsg || 'Failed to delete session')
            }
        } catch (err) {
            console.error('Failed to delete session:', err)
            toast.error('Failed to delete session')
        }
    }

    async function handleUpdateSession(sessionId, updatedData) {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(updatedData)
            })

            if (response.ok) {
                toast.success('Session updated successfully!')
                fetchSessions(token)
                return true
            } else {
                const errorMsg = await response.text()
                toast.error(errorMsg || 'Failed to update session')
                return false
            }
        } catch (err) {
            console.error('Failed to update session:', err)
            toast.error('Failed to update session')
            return false
        } finally {
            setIsLoading(false)
        }
    }





    function handleLogout() {
        setToken('')
        setUsername('')
        setPassword('')
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        toast.success('Logged out successfully')
    }

    useEffect(() => {
        if (token) {
            fetchSessions(token)
        }
    }, [])

    // ============ RENDER ============

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <Toaster position="top-center" />

            <h1 className="text-5xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                    🏀 Hoopsesh
                </span>
            </h1>

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
                            isLoading={isLoading}
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
                            isLoading={isLoading}
                        />
                    )}
                </div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
                        <p className="text-gray-700">Welcome, <span className="font-bold text-primary-600">{username}</span>!</p>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-700 font-medium transition-colors"
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
                        isLoading={isLoading}
                    />

                    {sessionsLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <div className="text-6xl mb-4">🏀</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No sessions yet</h3>
                            <p className="text-gray-500">Be the first to create a basketball session!</p>
                        </div>
                    ) : (
                        <SessionList
                            sessions={sessions}
                            handleJoin={handleJoin}
                            handleLeave={handleLeave}
                            handleDeleteSession={handleDeleteSession}
                            handleUpdateSession={handleUpdateSession}
                            currentUsername={username}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default App