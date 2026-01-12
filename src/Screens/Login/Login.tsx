import { useState, useContext } from 'react';
import './Login.css'
import { useNavigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import api from '../../api/axios';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdFolder } from 'react-icons/md';
import { Loading } from '../../Component/Loading/Shimmer';

function Login() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const { setRole, setUser , setUserId} = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            const { access_token, user } = response.data;
            const { id, name, role } = user;

            localStorage.setItem("token", access_token);
          
            
            setUserId(id);
            setUser(name);
            setRole(role);

         
            navigate("/dashboard", { replace: true });
        } catch (err: any) {
            const errorData = err.response?.data?.message;
            
            if (Array.isArray(errorData)) {
                setErrors(errorData);
            } else if (typeof errorData === 'string') {
                setErrors([errorData]);
            } else {
                setErrors(['Login failed. Please try again.']);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            {/* Loading Overlay */}
            {loading && <Loading variant="overlay" text="Signing in..." />}

            {/* Left Side - Branding */}
            <div className="login-branding">
                <div className="branding-content">
                    <div className="brand-logo">
                        <MdFolder size={48} />
                    </div>
                    <h1>ProjectHub</h1>
                    <p>Manage your projects efficiently with our powerful dashboard</p>
                    <div className="brand-features">
                        <div className="feature-item">
                            <span className="feature-dot"></span>
                            <span>Track project progress</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-dot"></span>
                            <span>Manage team members</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-dot"></span>
                            <span>Real-time analytics</span>
                        </div>
                    </div>
                </div>
                <div className="branding-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-form-section">
                <div className="login-form-container">
                    <div className="form-header">
                        <h2>Welcome Back</h2>
                        <p>Please sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email Field */}
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-wrapper">
                                <MdEmail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <MdLock size={20} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                <span>Remember me</span>
                            </label>
                        </div>

                        {/* Error Messages */}
                        {errors.length > 0 && (
                            <div className="error-container">
                                {errors.map((error, index) => (
                                    <div key={index} className="error-message">
                                        <span>•</span> {error}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="login-btn"
                            disabled={loading}
                        >
                            Sign In
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login;