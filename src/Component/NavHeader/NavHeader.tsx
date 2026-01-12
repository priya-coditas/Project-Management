import { useState, useContext } from 'react';
import './NavHeader.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DASHBOARD, PROFILE, LOGOUT } from '../../Constants/string'
import { MdDashboard, MdPerson, MdLogout, MdExpandMore, MdFolder } from 'react-icons/md';
import AuthContext from '../../store/AuthContext';
import api from '../../api/axios';
import { Loading } from '../Loading/Shimmer';

function NavHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, role, setUser, setRole } = useContext(AuthContext);

    const [showDropdown, setShowDropdown] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser('');
            setRole('');
            setLoggingOut(false);
            navigate('/');
        }
    };

    return (
        <>
            {/* Logout Loading Overlay */}
            {loggingOut && <Loading variant="overlay" text="Logging out..." />}
            
            <header className="nav-header">
            {/* Logo Section */}
            <div className="nav-logo">
                <div className="logo-icon">
                    <MdFolder size={24} />
                </div>
                <span className="logo-text">ProjectHub</span>
            </div>

            {/* Navigation Links */}
            <nav className="nav-links">
                <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                    <MdDashboard size={18} />
                    <span>{DASHBOARD}</span>
                </Link>
                <Link 
                    to="/project" 
                    className={`nav-link ${isActive('/project') ? 'active' : ''}`}
                >
                    <MdFolder size={18} />
                    <span>Projects</span>
                </Link>
            </nav>

            {/* Right Section */}
            <div className="nav-right">              

                {/* User Profile Dropdown */}
                <div 
                    className="user-profile"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="user-avatar">
                        {user ? user.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user}</span>
                        <span className="user-role">{role}</span>
                    </div>
                    <MdExpandMore size={20} className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`} />

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                <MdPerson size={18} />
                                <span>{PROFILE}</span>
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item logout-item" onClick={handleLogout}>
                                <MdLogout size={18} />
                                <span>{LOGOUT}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
        </>
    )
}

export default NavHeader;