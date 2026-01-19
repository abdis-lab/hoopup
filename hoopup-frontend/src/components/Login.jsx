function Login({ username, setUsername, password, setPassword, handleLogin, message, setIsRegistering }) {

    function testClick() {
        alert("Button works!")
        handleLogin()
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                type="button"
                onClick={handleLogin}   // or onClick={handleLogin}
                className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
                Login
            </button>
            {message && (
                <p className="mt-4 text-center text-red-500">{message}</p>
            )}

            <p className="mt-6 text-center text-gray-600">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={() => {
                        alert("Switching to register!")
                        setIsRegistering(true)
                    }}
                    className="text-blue-500 hover:underline"
                >
                    Register
                </button>
            </p>
        </div>
    )
}

export default Login