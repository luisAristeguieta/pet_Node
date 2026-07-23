import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";


function ManagePets() {
    const [pets, setPets] = useState([]);

    const [photoUrls, setPhotoUrls] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [file, setFile] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editBreed, setEditBreed] = useState("");
    const [editFile, setEditFile] = useState(null);

    const { token } = useAuth();

    const fetchPetsList = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/pets`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Failed to pull pets resource registry from server storage clusters.");
            }

            const data = await response.json();
            setPets(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPetsList();
        }
    }, [token]);

    useEffect(() => {
        const createdUrls = [];

        const downloadPhotos = async () => {
            for (const pet of pets) {
                try {
                    const res = await fetch(`${API_BASE_URL}/auth/pets/${pet.id}/photo`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const blob = await res.blob();
                        const localUrl = URL.createObjectURL(blob);
                        createdUrls.push(localUrl);

                        setPhotoUrls((prev) => ({
                            ...prev,
                            [pet.id]: localUrl
                        }));
                    }
                } catch (err) {
                    console.error("Failed to download image stream context: ", err);
                }
            }
        };

        if (pets && pets.length > 0) {
            downloadPhotos();
        }

        return () => {
            for (const url of createdUrls) {
                URL.revokeObjectURL(url);
            }
        };
    }, [pets, token]);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        setError("");
        setSuccess("");

        if (!file) {
            setError("Validation failed: A valid photo file attachment stream is required.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("breed", breed);
        formData.append("file", file);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/pets/register`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Server rejected multipart submission pipeline processing requests.");
            }

            setSuccess("Pet asset successfully recorded within active persistence nodes!");
            setName("");
            setBreed("");
            setFile(null);
            document.getElementById("creationFileInput").value = "";

            fetchPetsList();
        } catch (err) {
            setError(err.message);
        }
    };

    const initiateEditState = (pet) => {
        setEditingId(pet.id);
        setEditName(pet.name);
        setEditBreed(pet.breed);
        setEditFile(null);
    };

    const cancelEditState = () => {
        setEditingId(null);
        setEditFile(null);
    };

    const handleUpdateSubmit = async (e, id) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("name", editName);
        formData.append("breed", editBreed);
        if (editFile) {
            formData.append("file", editFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/pets/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Target asset mutation process rejected by persistence layer pipelines.");
            }

            setSuccess("Pet attributes updated successfully.");
            setEditingId(null);
            setEditFile(null);

            fetchPetsList();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm("Are you sure you want to completely erase this asset lifecycle context?")) return;
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/pets/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Backend infrastructure failed to drop target reference index row.");
            }

            setSuccess("Resource context dropped successfully.");
            fetchPetsList();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="crud-container">
            <h1>Pet Management System</h1>

            {error && <p className="alert-error">{error}</p>}
            {success && <p className="alert-success">{success}</p>}

            {/* Creation Form Area */}
            <form onSubmit={handleRegisterSubmit} className="creation-form">
                <h2>Register New Pet Target</h2>
                <div className="form-field">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-field">
                    <label>Breed</label>
                    <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} required />
                </div>
                <div className="form-field">
                    <label>Photo Attachment</label>
                    <input id="creationFileInput" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn-submit">Save Asset Record</button>
            </form>

            {/* Cards Grid Section */}
            <h2>Registered Pets Matrix</h2>
            {pets.length === 0 ? (
                <p style={{ color: "#64748b", fontStyle: "italic" }}>No pet assets recorded in the current database context cluster.</p>
            ) : (
                <div className="pet-grid">
                    {pets.map((pet) => (
                        <div key={pet.id} className="pet-card">
                            {editingId === pet.id ? (
                                <form onSubmit={(e) => handleUpdateSubmit(e, pet.id)} className="inline-mutation-form">
                                    <h4>Inline Update Menu</h4>
                                    <div className="mutation-field">
                                        <label>Name:</label>
                                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                                    </div>
                                    <div className="mutation-field">
                                        <label>Breed:</label>
                                        <input type="text" value={editBreed} onChange={(e) => setEditBreed(e.target.value)} required />
                                    </div>
                                    <div className="mutation-field">
                                        <label>Replace Photo (Optional):</label>
                                        <input type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files[0])} />
                                    </div>
                                    <div className="card-actions">
                                        <button type="submit" className="btn-save">Save</button>
                                        <button type="button" onClick={cancelEditState} className="btn-cancel">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {photoUrls[pet.id] ? (
                                        <img src={photoUrls[pet.id]} alt={pet.name} className="pet-card-img" />
                                    ) : (
                                        <div className="pet-card-img-placeholder">Streaming Data Image...</div>
                                    )}

                                    <div className="pet-card-body">
                                        <h3>{pet.name}</h3>
                                        <p><strong>Breed:</strong> {pet.breed}</p>
                                        <span className="pet-card-meta">Format: {pet.mimeType}</span>
                                        
                                        <div className="card-actions">
                                            <button onClick={() => initiateEditState(pet)} className="btn-edit">Edit Asset</button>
                                            <button onClick={() => handleDeleteClick(pet.id)} className="btn-terminate">Terminate</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManagePets;