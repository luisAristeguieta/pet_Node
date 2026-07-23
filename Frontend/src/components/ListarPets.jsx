import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";


function ListarPets({ pets, onDelete }) {
    const [photoUrls, setPhotoUrls] = useState({});
    const { token } = useAuth();

    useEffect(() => {
        const createdUrls = [];

        const downloadPhotos = async () => {
            for (const pet of pets) {
                try {
                    // Fetching manejando imagen: 
                    const res = await fetch(`${API_BASE_URL}/auth/pets/${pet.id}/photo`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        const blob = await res.blob();
                        const localUrl = URL.createObjectURL(blob);

                        createdUrls.push(localUrl);

                        // lógica funcional para actualizar el estado inmediatamente:

                        setPhotoUrls((prev) => ({
                            ...prev,
                            [pet.id]: localUrl
                        }));
                    }
                } catch (error) {
                    console.error("CRITICAL: Failed to stream pet binary photo payload: ", error);
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

    return (
        <div>
            <h2>Registered Pets Matrix</h2>
            {pets.length === 0 ? (
                <p>No pet assets recorded in the current database context cluster.</p>
            ) : (
                <ul>
                    {pets.map((pet) => (
                        <li key={pet.id}>
                            <h3>Name: {pet.name}</h3>
                            <p>Breed: {pet.breed}</p>
                            <p>MimeType: {pet.mimeType}</p>

                            {photoUrls[pet.id] && (
                                <img src={photoUrls[pet.id]} alt="Pet asset rendering trace" width="150" />
                            )}

                            <button onClick={() => onDelete(pet.id)}>Terminate Resource</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListarPets;