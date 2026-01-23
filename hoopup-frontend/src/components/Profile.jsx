import { useState, useEffect } from 'react'


export default function Profile({ token, onClose }) {
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchProfile()
    }, [])

    async function fetchProfile() {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/api/profile`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })

            if (response.ok) {
                const data = await response.json()
                setProfileData(data)
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            👤 {profileData?.username}'s Profile
                        </h1>
                        <p className="text-gray-600">{profileData?.email}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                        ← Back to Sessions
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-lg shadow-md text-white">
                    <div className="text-4xl mb-2">🏀</div>
                    <div className="text-3xl font-bold mb-1">{profileData?.totalCreated}</div>
                    <div className="text-primary-100">Sessions Created</div>
                </div>

                <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 p-6 rounded-lg shadow-md text-white">
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-3xl font-bold mb-1">{profileData?.totalAttending}</div>
                    <div className="text-secondary-100">Sessions Attending</div>
                </div>
            </div>

            {/* Created Sessions */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Created Sessions</h2>

                {profileData?.sessionsCreated.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">You haven't created any sessions yet</p>
                ) : (
                    <div className="space-y-3">
                        {profileData?.sessionsCreated.map((session) => (
                            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">📍 {session.locationName}</h3>
                                        <div className="text-sm text-gray-600 mt-1">
                                            📅 {formatDate(session.date)} • 🕐 {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                        </div>
                                        {session.note && (
                                            <p className="text-sm text-gray-600 mt-2">{session.note}</p>
                                        )}
                                    </div>
                                    <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                                        👥 {session.attendees?.length || 0} players
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Attending Sessions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sessions You're Attending</h2>

                {profileData?.sessionsAttending.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">You're not attending any sessions yet</p>
                ) : (
                    <div className="space-y-3">
                        {profileData?.sessionsAttending.map((session) => (
                            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-secondary-300 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">📍 {session.locationName}</h3>
                                        <div className="text-sm text-gray-600 mt-1">
                                            📅 {formatDate(session.date)} • 🕐 {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                        </div>
                                        {session.creator && (
                                            <p className="text-sm text-gray-500 mt-1">Created by: {session.creator.username}</p>
                                        )}
                                    </div>
                                    <div className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                                        👥 {session.attendees?.length || 0} players
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}