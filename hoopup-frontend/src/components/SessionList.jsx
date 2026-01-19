import SessionCard from './SessionCard'

function SessionList({ sessions, handleJoin, handleLeave }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>

            {sessions.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-500">No sessions yet. Be the first to post one!</p>
                </div>
            ) : (
                <div>
                    {sessions.map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            handleJoin={handleJoin}
                            handleLeave={handleLeave}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default SessionList