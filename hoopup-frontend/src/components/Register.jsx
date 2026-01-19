function Register({ username, setUsername, email, setEmail, password, setPassword, handleRegister, message, setIsRegistering }) {
    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />

            <button
                onClick={() => handleRegister()}
                className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
                Register
            </button>

            {message && (
                <p className="mt-4 text-center text-green-500">{message}</p>
            )}

            <p className="mt-6 text-center text-gray-600">
                Already have an account?{' '}
                <button
                    onClick={() => setIsRegistering(false)}
                    className="text-blue-500 hover:underline"
                >
                    Login
                </button>
            </p>
        </div>
    )
}

export default Register