import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AdminRoute = () => {
    const { authToken } = useAuth();
    return authToken ? <Outlet/> : <Navigate to="/login"/>;
}

export default AdminRoute