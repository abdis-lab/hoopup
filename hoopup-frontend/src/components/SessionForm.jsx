function SessionForm({
                         locationName,
                         setLocationName,
                         date,
                         setDate,
                         startTime,
                         setStartTime,
                         endTime,
                         setEndTime,
                         note,
                         setNote,
                         handleCreateSession
                     }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Create Session</h2>

            <input
                type="text"
                placeholder="Location (e.g. LA Fitness)"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />

            <div className="grid grid-cols-3 gap-4 mb-4">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />

                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />

                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>

            <input
                type="text"
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />

            <button
                onClick={handleCreateSession}
                className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
                Post Session
            </button>
        </div>
    )
}

export default SessionForm