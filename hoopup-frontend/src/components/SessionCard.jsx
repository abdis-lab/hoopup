function SessionCard({ session, handleJoin, handleLeave }) {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{session.locationName}</h3>
                    <p className="text-gray-600 mt-1">
                        📅 {session.date} &nbsp; ⏰ {session.startTime} - {session.endTime}
                    </p>
                    {session.note && (
                        <p className="text-gray-500 mt-2 italic">"{session.note}"</p>
                    )}
                </div>

                <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {session.attendees ? session.attendees.length : 0} going
                    </span>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => handleJoin(session.id)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                >
                    I'm in!
                </button>
                <button
                    onClick={() => handleLeave(session.id)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                    Leave
                </button>
            </div>
        </div>
    )
}

export default SessionCard