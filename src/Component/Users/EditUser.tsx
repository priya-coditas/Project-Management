import { useState, useEffect } from 'react';
import './CreateUser.css';
import { MdClose, MdPerson, MdEmail, MdBadge } from 'react-icons/md';
import { 
    EDIT_USER, 
    EDIT_USER_SUBTITLE, 
    FULL_NAME, 
    EMAIL_ADDRESS,
    ROLE, 
    SELECT_ROLE, 
    ADMIN, 
    SUPERADMIN, 
    USER, 
    CANCEL, 
    SAVE_CHANGES,
    UPDATING_USER,
    ENTER_FULL_NAME,
    ENTER_EMAIL_ADDRESS,
    ERROR_FULL_NAME_REQUIRED,
    ERROR_NAME_MIN_LENGTH,
    ERROR_NAME_MAX_LENGTH,
    ERROR_EMAIL_REQUIRED,
    ERROR_EMAIL_INVALID,
    ERROR_SELECT_ROLE
} from '../../Constants/string';
import api from '../../api/axios';
import { Loading } from '../Loading/Shimmer';

interface EditUserFormData {
    name: string;
    email: string;
    role: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    role?: string;
}

interface UserData {
    id: string | number;
    name: string;
    email: string;
    role: string;
}

interface EditUserProps {
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated?: () => void;
    user: UserData | null;
}

function EditUser({ isOpen, onClose, onUserUpdated, user }: EditUserProps) {
    const [formData, setFormData] = useState<EditUserFormData>({
        name: "",
        email: "",
        role: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string>('');

    // Pre-fill form data when user prop changes
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
            });
            setErrors({});
            setTouched({});
            setApiError('');
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

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
            role: validateField('role', formData.role),
        };
        
        setErrors(newErrors);
        setTouched({ name: true, email: true, role: true });
        
        return !Object.values(newErrors).some(error => error);
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", role: "" });
        setErrors({});
        setTouched({});
        setApiError('');
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        console.log(user.id);
        if (validateForm()) {
            setLoading(true);
            setApiError('');
            
            try {
                await api.patch(`/users/${user.id}`, formData);
                resetForm();
                onUserUpdated?.();
                onClose();
            } catch (err: any) {
                const errorMessage = err.response?.data?.message;
                if (Array.isArray(errorMessage)) {
                    setApiError(errorMessage.join(', '));
                } else if (typeof errorMessage === 'string') {
                    setApiError(errorMessage);
                } else {
                    setApiError('Failed to update user. Please try again.');
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
            {loading && <Loading variant="overlay" text={UPDATING_USER} />}
            
            <div className="create-user-overlay" onClick={handleClose}>
                <div className="create-user-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div className="create-user-header">
                        <div className="create-user-title">
                            <div className="create-user-icon">
                                <MdPerson size={24} />
                            </div>
                            <div>
                                <h2>{EDIT_USER}</h2>
                                <p>{EDIT_USER_SUBTITLE}</p>
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
                                {SAVE_CHANGES}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditUser;

