import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";


function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("USER");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, rol })
            });

            if (!response.ok) {
                throw new Error("Could not register user. Username might already exist.");
            }

            setSuccess("User registered successfully! Redirecting to Log In...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-wrapper"> {/* Envoltura clave */}
            <div className="auth-container">
                <h1>Register New User</h1>

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

                    <div className="form-group">
                        <label>Role</label>
                        <select value={rol} onChange={(e) => setRol(e.target.value)}>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">Register</button>
                </form>

                {error && (
                    <p style={{ color: "#e63946", backgroundColor: "#ffe3e3", padding: "0.5rem", borderRadius: "4px", marginTop: "1rem" }}>
                        {error}
                    </p>
                )}
                {success && (
                    <p style={{ color: "#2b9348", backgroundColor: "#e8f5e9", padding: "0.5rem", borderRadius: "4px", marginTop: "1rem" }}>
                        {success}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Register;