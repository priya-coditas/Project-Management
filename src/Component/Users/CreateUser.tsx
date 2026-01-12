import { useState } from 'react';
import './CreateUser.css';
import { MdClose, MdPerson, MdEmail, MdBadge, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { 
    CREATE_NEW_USER, 
    CREATE_USER_SUBTITLE, 
    FULL_NAME, 
    EMAIL_ADDRESS,
    PASSWORD, 
    ROLE, 
    SELECT_ROLE, 
    ADMIN, 
    SUPERADMIN, 
    USER, 
    CANCEL, 
    CREATE_USER,
    CREATING_USER,
    ENTER_FULL_NAME,
    ENTER_EMAIL_ADDRESS,
    ENTER_PASSWORD,
    ERROR_FULL_NAME_REQUIRED,
    ERROR_NAME_MIN_LENGTH,
    ERROR_NAME_MAX_LENGTH,
    ERROR_EMAIL_REQUIRED,
    ERROR_EMAIL_INVALID,
    ERROR_PASSWORD_REQUIRED,
    ERROR_PASSWORD_MIN_LENGTH,
    ERROR_PASSWORD_UPPERCASE,
    ERROR_PASSWORD_LOWERCASE,
    ERROR_PASSWORD_NUMBER,
    ERROR_PASSWORD_SPECIAL,
    ERROR_SELECT_ROLE
} from '../../Constants/string';
import api from '../../api/axios';
import { Loading } from '../Loading/Shimmer';

interface CreateUserFormData {
    name: string;
    email: string;
    password: string;
    role: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}

interface CreateUserProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated?: () => void;
}

function CreateUser({ isOpen, onClose, onUserCreated }: CreateUserProps) {
    const [formData, setFormData] = useState<CreateUserFormData>({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string>('');

    if (!isOpen) return null;

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return ERROR_FULL_NAME_REQUIRED;
                if (value.trim().length < 2) return ERROR_NAME_MIN_LENGTH;
                if (value.trim().length > 50) return ERROR_NAME_MAX_LENGTH;
                return '';
            case 'email':
                if (!value.trim()) return ERROR_EMAIL_REQUIRED;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return ERROR_EMAIL_INVALID;
                return '';
            case 'password':
                if (!value) return ERROR_PASSWORD_REQUIRED;
                if (value.length < 8) return ERROR_PASSWORD_MIN_LENGTH;
                if (!/[A-Z]/.test(value)) return ERROR_PASSWORD_UPPERCASE;
                if (!/[a-z]/.test(value)) return ERROR_PASSWORD_LOWERCASE;
                if (!/[0-9]/.test(value)) return ERROR_PASSWORD_NUMBER;
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return ERROR_PASSWORD_SPECIAL;
                return '';
            case 'role':
                if (!value) return ERROR_SELECT_ROLE;
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setApiError('');
        
        // Validate on change if field has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
            role: validateField('role', formData.role),
        };
        
        setErrors(newErrors);
        setTouched({ name: true, email: true, password: true, role: true });
        
        return !Object.values(newErrors).some(error => error);
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", password: "", role: "" });
        setErrors({});
        setTouched({});
        setShowPassword(false);
        setApiError('');
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (validateForm()) {
            setLoading(true);
            setApiError('');
            
            try {
                await api.post('/users', formData);
                resetForm();
                onUserCreated?.();
                onClose();
            } catch (err: any) {
                const errorMessage = err.response?.data?.message;
                if (Array.isArray(errorMessage)) {
                    setApiError(errorMessage.join(', '));
                } else if (typeof errorMessage === 'string') {
                    setApiError(errorMessage);
                } else {
                    setApiError('Failed to create user. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        if (loading) return; // Prevent closing while loading
        resetForm();
        onClose();
    };

    return (
        <>
            {/* Loading Overlay */}
            {loading && <Loading variant="overlay" text={CREATING_USER} />}
            
            <div className="create-user-overlay" onClick={handleClose}>
                <div className="create-user-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div className="create-user-header">
                        <div className="create-user-title">
                            <div className="create-user-icon">
                                <MdPerson size={24} />
                            </div>
                            <div>
                                <h2>{CREATE_NEW_USER}</h2>
                                <p>{CREATE_USER_SUBTITLE}</p>
                            </div>
                        </div>
                        <button className="create-user-close" onClick={handleClose} disabled={loading}>
                            <MdClose size={24} />
                        </button>
                    </div>

                    {/* Modal Form */}
                    <form onSubmit={onSubmit} className="create-user-form" noValidate>
                        {/* API Error Message */}
                        {apiError && (
                            <div className="api-error-message">
                                {apiError}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="create-user-form-group">
                            <label className="create-user-label">
                                <MdPerson size={16} />
                                {FULL_NAME}
                            </label>
                            <input
                                type="text"
                                name="name"
                                className={`create-user-input ${errors.name && touched.name ? 'input-error' : ''}`}
                                placeholder={ENTER_FULL_NAME}
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                            {errors.name && touched.name && (
                                <span className="error-message">{errors.name}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="create-user-form-group">
                            <label className="create-user-label">
                                <MdEmail size={16} />
                                {EMAIL_ADDRESS}
                            </label>
                            <input
                                type="email"
                                name="email"
                                className={`create-user-input ${errors.email && touched.email ? 'input-error' : ''}`}
                                placeholder={ENTER_EMAIL_ADDRESS}
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                            {errors.email && touched.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="create-user-form-group">
                            <label className="create-user-label">
                                <MdLock size={16} />
                                {PASSWORD}
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`create-user-input ${errors.password && touched.password ? 'input-error' : ''}`}
                                    placeholder={ENTER_PASSWORD}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <span className="error-message">{errors.password}</span>
                            )}
                        </div>

                        {/* Role */}
                        <div className="create-user-form-group">
                            <label className="create-user-label">
                                <MdBadge size={16} />
                                {ROLE}
                            </label>
                            <select
                                name="role"
                                className={`create-user-select ${errors.role && touched.role ? 'input-error' : ''}`}
                                value={formData.role}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            >
                                <option value="">{SELECT_ROLE}</option>
                                <option value="admin">{ADMIN}</option>
                                <option value="user">{USER}</option>
                                <option value="superadmin">{SUPERADMIN}</option>
                            </select>
                            {errors.role && touched.role && (
                                <span className="error-message">{errors.role}</span>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="create-user-footer">
                            <button 
                                type="button" 
                                className="create-user-btn-cancel" 
                                onClick={handleClose}
                                disabled={loading}
                            >
                                {CANCEL}
                            </button>
                            <button 
                                type="submit" 
                                className="create-user-btn-submit"
                                disabled={loading}
                            >
                                {CREATE_USER}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateUser;
