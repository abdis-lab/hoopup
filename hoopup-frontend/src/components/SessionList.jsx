import { useState } from 'react'

export default function SessionList({
                                        sessions,
                                        handleJoin,
                                        handleLeave,
                                        handleDeleteSession,
                                        handleUpdateSession,
                                        currentUsername
                                    }) {
    const [editingSessionId, setEditingSessionId] = useState(null)
    const [editForm, setEditForm] = useState({
        locationName: '',
        date: '',
        startTime: '',
        endTime: '',
        note: ''
    })

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

    const isUserAttending = (session) => {
        return session.attendees?.some(attendee => attendee.username === currentUsername)
    }

    const isCreator = (session) => {
        return session.creator?.username === currentUsername
    }

    const startEditing = (session) => {
        setEditingSessionId(session.id)
        setEditForm({
            locationName: session.locationName,
            date: session.date,
            startTime: session.startTime,
            endTime: session.endTime,
            note: session.note || ''
        })
    }

    const cancelEditing = () => {
        setEditingSessionId(null)
        setEditForm({
            locationName: '',
            date: '',
            startTime: '',
            endTime: '',
            note: ''
        })
    }

    const saveEdit = async (sessionId) => {
        const success = await handleUpdateSession(sessionId, editForm)
        if (success) {
            cancelEditing()
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h2>

            {sessions.map((session) => {
                const attending = isUserAttending(session)
                const creator = isCreator(session)
                const attendeeCount = session.attendees?.length || 0
                const isEditing = editingSessionId === session.id

                return (
                    <div
                        key={session.id}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                    >
                        {isEditing ? (
                            // EDIT MODE
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Session</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Court Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.locationName}
                                        onChange={(e) => setEditForm({...editForm, locationName: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.date}
                                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={editForm.startTime}
                                            onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={editForm.endTime}
                                            onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={editForm.note}
                                        onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => saveEdit(session.id)}
                                        className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={cancelEditing}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // VIEW MODE
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                                            📍 {session.locationName}
                                            {creator && (
                                                <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                                                    Your Session
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>📅 {formatDate(session.date)}</span>
                                            <span>🕐 {formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-secondary-50 px-3 py-1 rounded-full">
                                        <span className="text-sm font-medium text-secondary-700">
                                            👥 {attendeeCount} {attendeeCount === 1 ? 'player' : 'players'}
                                        </span>
                                    </div>
                                </div>

                                {session.note && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700">{session.note}</p>
                                    </div>
                                )}

                                {attendeeCount > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Players:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {session.attendees.map((attendee) => (
                                                <span
                                                    key={attendee.username}
                                                    className={`px-3 py-1 rounded-full text-sm ${
                                                        attendee.username === currentUsername
                                                            ? 'bg-primary-100 text-primary-700 font-medium'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {attendee.username === currentUsername ? '👤 ' : ''}
                                                    {attendee.username}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    {creator ? (
                                        // Creator sees Edit/Delete buttons
                                        <>
                                            <button
                                                onClick={() => startEditing(session)}
                                                className="flex-1 bg-secondary-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-secondary-600 transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSession(session.id)}
                                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    ) : attending ? (
                                        // Non-creator attendee sees Leave button
                                        <button
                                            onClick={() => handleLeave(session.id)}
                                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            Leave Session
                                        </button>
                                    ) : (
                                        // Non-attendee sees Join button
                                        <button
                                            onClick={() => handleJoin(session.id)}
                                            className="flex-1 bg-gradient-to-r from-success-500 to-success-600 text-white py-2 px-4 rounded-lg font-medium hover:from-success-600 hover:to-success-700 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Join Session
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )
            })}
        </div>
    )
}