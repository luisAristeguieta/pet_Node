import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    // 1. Le preguntamos a nuestro contexto si el usuario tiene un token
    const { token } = useAuth();

    // 2. Si NO hay token (no ha iniciado sesión), lo expulsamos al Login
    if (!token) {
        return <Navigate to="/login" replace />;
    } else {
        // 3. Si SÍ hay token, lo dejamos pasar a las páginas protegidas
        return <Outlet />;
    }
}

export default ProtectedRoute;