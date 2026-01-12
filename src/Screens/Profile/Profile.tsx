import { useEffect, useState } from 'react';
import { MdPerson, MdEmail, MdBadge, MdCalendarToday, MdEdit, MdSecurity } from 'react-icons/md';
import api from '../../api/axios';
import { ProfileShimmer } from '../../Component/Loading/Shimmer';
import './Profile.css';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/users/me');
            setProfile(response.data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message;
            if (Array.isArray(errorMessage)) {
                setError(errorMessage.join(', '));
            } else if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to load profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'superadmin':
                return 'role-badge role-superadmin';
            case 'admin':
                return 'role-badge role-admin';
            default:
                return 'role-badge role-user';
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'superadmin':
                return 'Super Admin';
            case 'admin':
                return 'Admin';
            default:
                return 'User';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return <ProfileShimmer />;
    }

    if (error) {
        return (
            <div className="profile-error-container">
                <div className="profile-error-card">
                    <div className="profile-error-icon">
                        <MdPerson size={48} />
                    </div>
                    <h3>Unable to Load Profile</h3>
                    <p>{error}</p>
                    <button className="profile-retry-btn" onClick={fetchProfile}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="profile-page">
            {/* Profile Header Card */}
            <div className="profile-header-card">
                <div className="profile-header-bg"></div>
                <div className="profile-header-content">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            {getInitials(profile.name)}
                        </div>
                        <div className="profile-avatar-glow"></div>
                    </div>
                    <div className="profile-identity">
                        <h1 className="profile-name">{profile.name}</h1>
                        <p className="profile-email">{profile.email}</p>
                        <span className={getRoleBadgeClass(profile.role)}>
                            <MdSecurity size={14} />
                            {getRoleDisplayName(profile.role)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Details Section */}
            <div className="profile-details-grid">
                {/* Personal Information Card */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <MdPerson size={20} />
                        </div>
                        <h2>Personal Information</h2>
                    </div>
                    <div className="profile-card-content">
                        <div className="profile-info-item">
                            <div className="info-icon">
                                <MdPerson size={18} />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{profile.name}</span>
                            </div>
                        </div>
                        <div className="profile-info-item">
                            <div className="info-icon">
                                <MdEmail size={18} />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Email Address</span>
                                <span className="info-value">{profile.email}</span>
                            </div>
                        </div>
                        <div className="profile-info-item">
                            <div className="info-icon">
                                <MdBadge size={18} />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Role</span>
                                <span className="info-value">{getRoleDisplayName(profile.role)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information Card */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <MdSecurity size={20} />
                        </div>
                        <h2>Account Information</h2>
                    </div>
                    <div className="profile-card-content">
                        <div className="profile-info-item">
                            <div className="info-icon">
                                <MdEdit size={18} />
                            </div>
                            <div className="info-content">
                                <span className="info-label">User ID</span>
                                <span className="info-value info-mono">#{profile.id}</span>
                            </div>
                        </div>
                       
                        <div className="profile-info-item">
                            <div className="info-icon">
                                <MdSecurity size={18} />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Account Status</span>
                                <span className="info-value">
                                    <span className="status-active">Active</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Profile;
