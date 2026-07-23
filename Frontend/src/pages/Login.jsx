import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext.jsx";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error("Invalid username or password. Please try again.");
            }

            const data = await response.json();

            login(data.token, data.username);

            navigate("/profile");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-wrapper"> {/* Envoltura clave */}
            <div className="auth-container">
                <h1>Log in</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p style={{ color: "#e63946", backgroundColor: "#ffe3e3", padding: "0.5rem", borderRadius: "4px" }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="btn-primary">Log In</button>
                </form>
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;