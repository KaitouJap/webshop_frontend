import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NavBar = () => {
    const { authToken, setAuthToken } = useAuth();
    const navigate = useNavigate();
    // Effect to check the token when the app loads

    const handleLogout = () => {
        setAuthToken(null); // Remove token on logout
        navigate('/'); // Redirect to home page (or login page)
    };
    
    return(
        <>
            <nav>
                <Link to="/">Home</Link> | 
                {authToken ? (
                <>
                    <Link to="/admin">Admin</Link> | 
                    <button onClick={handleLogout}>Logout</button>
                </>
                ) : (
                <Link to="/login">Login</Link>
                )}
            </nav>
        </>
    );
}

export default NavBar;