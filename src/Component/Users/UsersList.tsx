import './UsersList.css';
import { useState, useEffect } from 'react';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdFilterList, MdAdd, MdEdit, MdDelete, MdPerson, MdArrowBack, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '../../api/axios';
import { TableShimmer } from '../Loading/Shimmer';
import withSuperAdminAccess from '../../HOC/withSuperAdminAccess';

interface User {
    id: string | number;
    name: string;
    email: string;
    role: string;
    isActive?: boolean;
    status?: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
}

function UsersList({ canDelete, canToggleStatus }: {canDelete: boolean, canToggleStatus: boolean}) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [togglingUserId, setTogglingUserId] = useState<string | number | null>(null);
    const [error, setError] = useState<string>('');
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        limit: 10
    });

    const fetchUsers = async (page: number = 1) => {
        setLoading(true);
        setError('');
        
        try {
            const response = await api.get('/users', {
                params: {
                    page,
                    limit: 10
                }
            });
            
            const responseData = response.data;
            
            // Handle different API response structures
            let userData: User[] = [];
            let paginationData: any = null;
            
            if (Array.isArray(responseData)) {
                // If response is directly an array of users
                userData = responseData;
            } else if (responseData?.users) {
                // If response has users property
                userData = responseData.users;
                paginationData = responseData.pagination;
            } else if (responseData?.data) {
                // If response has data property
                userData = responseData.data;
                paginationData = responseData.pagination || responseData.meta;
            } else {
                // Try to find any array in the response
                const keys = Object.keys(responseData || {});
                for (const key of keys) {
                    if (Array.isArray(responseData[key])) {
                        userData = responseData[key];
                        break;
                    }
                }
            }
            
            console.log('Parsed Users:', userData);
            
            setUsers(userData);
            setPagination({
                currentPage: paginationData?.currentPage || paginationData?.page || page,
                totalPages: paginationData?.totalPages || paginationData?.pages || Math.ceil((paginationData?.total || userData.length) / 10) || 1,
                totalUsers: paginationData?.totalUsers || paginationData?.total || userData.length,
                limit: paginationData?.limit || 10
            });
        } catch (err: any) {
            console.error('Fetch Users Error:', err);
            const errorMessage = err.response?.data?.message;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to fetch users. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchUsers(newPage);
        }
    };

    const handleUserCreated = () => {
        // Refresh the users list after creating a new user
        fetchUsers(pagination.currentPage);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const handleUserUpdated = () => {
        // Refresh the users list after updating a user
        fetchUsers(pagination.currentPage);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = async (userId: string | number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.delete(`/users/${userId}`);
            // Refresh the users list after deleting
            fetchUsers(pagination.currentPage);
        } catch (err: any) {
            console.error('Delete User Error:', err);
            const errorMessage = err.response?.data?.message;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to delete user. Please try again.');
            }
            setLoading(false);
        }
    };

    const getRoleClass = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'role-admin';
            case 'super-admin': return 'role-superadmin';
            case 'user': return 'role-user';
            default: return '';
        }
    };

    const handleToggleStatus = async (userId: string | number) => {
        setTogglingUserId(userId);
        setError('');

        try {
            await api.patch(`/users/${userId}/toggle-status`);
            // Refresh the users list after toggling status
            fetchUsers(pagination.currentPage);
        } catch (err: any) {
            console.error('Toggle Status Error:', err);
            const errorMessage = err.response?.data?.message;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to toggle user status. Please try again.');
            }
        } finally {
            setTogglingUserId(null);
        }
    };

    const isUserActive = (user: User): boolean => {
        if (typeof user.isActive === 'boolean') {
            return user.isActive;
        }
        if (user.status) {
            return user.status.toLowerCase() === 'active';
        }
        return true;
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === '' || user.role?.toLowerCase() === filterRole.toLowerCase();
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return <TableShimmer rows={8} />;
    }

    return (
        <div className="users-page">
            {/* Page Header */}
            <div className="users-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <MdArrowBack size={20} />
                    </button>
                    <div>
                        <h1 className="page-title">Users Management</h1>
                        <p className="page-subtitle">{pagination.totalUsers} users found</p>
                    </div>
                </div>
                <button className="add-user-btn" onClick={() => setOpen(true)}>
                    <MdAdd size={20} />
                    Add New User
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={() => fetchUsers(pagination.currentPage)}>Retry</button>
                </div>
            )}

            {/* Filters Section */}
            <div className="filters-section">
                <div className="search-box">
                    <MdSearch size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-dropdown">
                    <MdFilterList size={20} />
                    <select 
                        value={filterRole} 
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="role-filter"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th className="user-info">User</th>
                            <th className="user-email">Email</th>
                            <th className="user-role">Role</th>
                            <th className="user-status">Status</th>
                            <th className="user-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => {
                            const isActive = isUserActive(user);
                            const isToggling = togglingUserId === user.id;
                            return (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="user-name">{user.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="user-email">{user.email}</span>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${getRoleClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="status-toggle-wrapper">
                                            {canToggleStatus ? (
                                                <label className={`toggle-switch ${isToggling ? 'toggling' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isActive}
                                                        onChange={() => handleToggleStatus(user.id)}
                                                        disabled={isToggling}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            ) : (
                                                <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            )}
                                            {isToggling && <span className="toggling-text">...</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn edit-btn"
                                                onClick={() => handleEdit(user)}
                                                title="Edit User"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            {canDelete && (
                                                <button 
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Delete User"
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {!loading && filteredUsers.length === 0 && (
                    <div className="no-users">
                        <MdPerson size={48} />
                        <p>No users found</p>
                        <span>Try adjusting your search or filter</span>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >
                        <MdChevronLeft size={20} />
                        Previous
                    </button>
                    
                    <div className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    
                    <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        Next
                        <MdChevronRight size={20} />
                    </button>
                </div>
            )}

            <CreateUser 
                isOpen={open} 
                onClose={() => setOpen(false)} 
                onUserCreated={handleUserCreated} 
            />

            <EditUser
                isOpen={editOpen}
                onClose={handleEditClose}
                onUserUpdated={handleUserUpdated}
                user={selectedUser}
            />
        </div>
    );
}

export default withSuperAdminAccess(UsersList);
