import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";


function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState("");

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Dispatches a GET request to recover system authorization token info metadata.
         */
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/perfil`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error("Cannot load account metadata settings, please try again.");
                }

                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } catch (err) {
            console.error("Network error while trying to revoke the token session block: " + err);
        } finally {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="profile-container">
            <h1>User Profile</h1>

            {error && (
                <p style={{ color: "#e63946", backgroundColor: "#ffe3e3", padding: "0.5rem", borderRadius: "5px", textAlign: "center" }}>
                    {error}
                </p>
            )}

            {profileData ? (
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.8rem", margin: "1rem 0" }}>
                    <p style={{ fontStyle: "italic", color: "#627d98" }}>
                        {profileData.message}
                    </p>
                    <h2 style={{ fontSize: "1.4rem", color: "#102a43", margin: "0.5rem 0" }}>
                        👤 {profileData.username}
                    </h2>
                    <span style={{ display: "inline-block", alignSelf: "center", backgroundColor: "#cbd5e1", color: "#102a43", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
                        Role: {profileData.detected_role}
                    </span>
                    <p style={{ color: "#2b9348", fontWeight: "600" }}>
                        ✓ {profileData.status}
                    </p>
                </div>
            ) : (
                <p style={{ textAlign: "center", color: "#627d98" }}>Loading profile data...</p>
            )}

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
                <button onClick={handleLogout} style={{ backgroundColor: "#e63946", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Log Out
                </button>
                <button onClick={() => navigate("/pet")} style={{ backgroundColor: "#102a43", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Manage Pets
                </button>
            </div>
        </div>
    );
}

export default Profile;