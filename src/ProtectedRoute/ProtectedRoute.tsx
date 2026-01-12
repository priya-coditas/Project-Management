import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../store/AuthContext';

function ProtectedRoute() {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const isAuthenticated = token && user;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;