import { useState, useContext, useEffect } from 'react';
import { MdClose, MdAdd, MdExpandMore, MdExpandLess, MdCheck, MdArrowBack } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';
import api from '../../api/axios';
import { ProjectDetailShimmer, Loading } from '../Loading/Shimmer';
import './ProjectDetail.css';

interface TeamMember {
    id?: string;
    oduserId?: string;
    userId?: string;
    name?: string;
    userName?: string;
    email?: string;
    userEmail?: string;
    userRole?: string;
    projectRole?: string;
}

interface User {
    id: string | number;
    _id?: string;
    name: string;
    email: string;
    role?: string;
}

interface Project {
    _id?: string;
    id?: string;
    name: string;
    title?: string;
    description?: string;
    status: string;
    priority: string;
    progress?: number;
    budget?: number;
    technologies?: string[];
    startDate?: string;
    endDate?: string;
    teamMembers?: TeamMember[];
    members?: TeamMember[];
    owner?: string | { name: string; _id?: string; email?: string };
    createdBy?: { name: string; _id?: string; email?: string };
}

function ProjectDetail(){
    const { role } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const projectId = location.state?.projectId;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingMember, setAddingMember] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showTeamMembers, setShowTeamMembers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!projectId) {
                setError('No project ID provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const response = await api.get(`/projects/${projectId}`);
                setProject(response.data);
            } catch (err: any) {
                console.error('Failed to fetch project details:', err);
                const errorMessage = err.response?.data?.message;
                if (typeof errorMessage === 'string') {
                    setError(errorMessage);
                } else {
                    setError('Failed to load project details');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    // Fetch available users for adding team members
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                const responseData = response.data;
                
                let userData: User[] = [];
                if (Array.isArray(responseData)) {
                    userData = responseData;
                } else if (responseData?.users) {
                    userData = responseData.users;
                } else if (responseData?.data) {
                    userData = responseData.data;
                }
                setAvailableUsers(userData);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };

        fetchUsers();
    }, []);

    // Get team members from project
    const teamMembers: TeamMember[] = project?.teamMembers || project?.members || [];

    const handleRemoveMember = async (memberId: string) => {
        if (!memberId || !projectId) {
            setError('Invalid member or project');
            return;
        }

        if (!window.confirm('Are you sure you want to remove this member from the project?')) {
            return;
        }

        setRemovingMemberId(memberId);
        setError('');

        try {
            await api.delete(`/projects/${projectId}/members/${memberId}`);
            
            // Refresh project details to get updated team members
            const response = await api.get(`/projects/${projectId}`);
            setProject(response.data);
        } catch (err: any) {
            console.error('Failed to remove team member:', err);
            const errorMessage = err.response?.data?.message;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to remove team member');
            }
        } finally {
            setRemovingMemberId(null);
        }
    };

    const handleAddMember = async (user: User) => {
        const userId = user.id?.toString() || user._id || '';
        
        if (!userId || !projectId) {
            setError('Invalid user or project');
            return;
        }

        setAddingMember(true);
        setError('');

        try {
            await api.post(`/projects/${projectId}/members/${userId}`);
            
            // Refresh project details to get updated team members
            const response = await api.get(`/projects/${projectId}`);
            setProject(response.data);
            
            setShowAddMember(false);
            setSearchTerm('');
        } catch (err: any) {
            console.error('Failed to add team member:', err);
            const errorMessage = err.response?.data?.message;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to add team member');
            }
        } finally {
            setAddingMember(false);
        }
    };

    // Get member ID helper
    const getMemberId = (member: TeamMember): string => {
        return member.id || member.userId || member.oduserId || '';
    };

    // Get member name helper
    const getMemberName = (member: TeamMember): string => {
        return member.name || member.userName || 'Unknown';
    };

    // Get member email helper
    const getMemberEmail = (member: TeamMember): string => {
        return member.email || member.userEmail || '';
    };

    // Filter available users that are not already team members
    const filteredUsers = availableUsers.filter(user => {
        const userId = user.id?.toString() || user._id || '';
        const isAlreadyMember = teamMembers.some(member => getMemberId(member) === userId);
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return !isAlreadyMember && matchesSearch;
    });

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Get owner name helper
    const getOwnerName = (): string => {
        if (!project) return 'N/A';
        if (typeof project.owner === 'string') {
            return project.owner;
        } else if (project.owner && typeof project.owner === 'object') {
            return project.owner.name || 'N/A';
        } else if (project.createdBy?.name) {
            return project.createdBy.name;
        }
        return 'N/A';
    };

    // Format status for display
    const formatStatus = (status: string) => {
        if (!status) return '';
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Get status class
    const getStatusClass = (status: string) => {
        const statusLower = status?.toLowerCase();
        switch(statusLower) {
            case 'completed': return 'status-completed';
            case 'in_progress':
            case 'in progress': return 'status-in-progress';
            case 'planning': return 'status-planning';
            case 'cancelled': return 'status-cancelled';
            case 'on_hold':
            case 'on hold': return 'status-on-hold';
            default: return '';
        }
    };

    // Format budget
    const formatBudget = (budget?: number) => {
        if (!budget) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(budget);
    };

    if (loading) {
        return <ProjectDetailShimmer />;
    }

    if (error || !project) {
        return (
            <div className="project-detail-container">
                <div className="error-state">
                    <p>{error || 'Project not found'}</p>
                    <button className="back-btn" onClick={() => navigate('/project')}>
                        <MdArrowBack size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-detail-container">
            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate('/project')}>
                <MdArrowBack size={20} />
            </button>

            <div className="project-detail-header">
                <h2>{project.name || project.title}</h2>
                <span className={`project-status ${getStatusClass(project.status)}`}>
                    {formatStatus(project.status)}
                </span>
            </div>

            {/* Description */}
            {project.description && (
                <div className="project-description">
                    <p>{project.description}</p>
                </div>
            )}

            <div className="project-info-section">
                <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className="info-value-with-icon">
                        <span className="info-value">{formatStatus(project.status)}</span>
                        <MdCheck size={20} />
                    </span>
                </div>

                <div className="info-item">
                    <span className="info-label">Priority</span>
                    <span className={`info-value priority-${project.priority?.toLowerCase()}`}>
                        {project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1) || 'N/A'}
                    </span>
                </div>

                <div className="info-item">
                    <span className="info-label">Progress</span>
                    <div className="progress-wrapper">
                        <progress value={(project.progress || 0) / 100} className="project-progress"/>
                        <span className="progress-text">{Math.round(project.progress || 0)}%</span>
                    </div>
                </div>

                <div className="info-item">
                    <span className="info-label">Owner</span>
                    <span className="info-value">{getOwnerName()}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">Budget</span>
                    <span className="info-value">{formatBudget(project.budget)}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">Timeline</span>
                    <span className="info-value">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="info-item full-width">
                        <span className="info-label">Technologies</span>
                        <div className="technologies-list">
                            {project.technologies.map((tech, index) => (
                                <span key={index} className="tech-tag">{tech}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div 
                    className="info-item info-item-clickable"
                    onClick={() => setShowTeamMembers(!showTeamMembers)}
                >
                    <span className="info-label">Team Members</span>
                    <div className="info-value-with-icon">
                        <span className="info-value">{teamMembers.length} Members</span>
                        {showTeamMembers ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                    </div>
                </div>
            </div>

            {showTeamMembers && (
                <div className="team-section">
                    <div className="team-header">
                        <h3>Team Members</h3>
                        {role !== 'user' && (
                            <button 
                                className="add-member-btn"
                                onClick={() => setShowAddMember(true)}
                            >
                                <MdAdd size={18} />
                                Add Member
                            </button>
                        )}
                    </div>

                    <div className="team-members-list">
                        {teamMembers.map((member, index) => {
                            const memberId = getMemberId(member);
                            const isRemoving = removingMemberId === memberId;
                            return (
                                <div 
                                    key={memberId || index} 
                                    className={`team-member-card ${isRemoving ? 'removing' : ''}`}
                                >
                                    <div className="member-info">
                                        <span className="member-name">{getMemberName(member)}</span>
                                        <span className="member-email">{getMemberEmail(member)}</span>
                                        {member.projectRole && (
                                            <span className="member-role">{member.projectRole}</span>
                                        )}
                                    </div>
                                    {role !== 'user' && (
                                        <div className="remove-member-wrapper">
                                            {isRemoving ? (
                                                <span className="removing-text">Removing...</span>
                                            ) : (
                                                <MdClose 
                                                    size={20} 
                                                    className="remove-member-icon"
                                                    onClick={() => handleRemoveMember(memberId)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {teamMembers.length === 0 && (
                            <span className="no-members">No team members added yet</span>
                        )}
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {showAddMember && (
                <div className="add-member-modal-overlay" onClick={() => !addingMember && setShowAddMember(false)}>
                    <div className="add-member-modal-content" onClick={(e) => e.stopPropagation()}>
                        {addingMember && <Loading variant="overlay" text="Adding member..." />}
                        <div className="add-member-modal-header">
                            <h3>Add Team Member</h3>
                            <MdClose 
                                size={24} 
                                className="modal-close-icon"
                                onClick={() => !addingMember && setShowAddMember(false)}
                            />
                        </div>
                        <input 
                            type="text"
                            placeholder="Search users by name or email..."
                            className="search-users-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={addingMember}
                        />
                        <div className="users-list">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <div 
                                        key={user.id?.toString() || user._id} 
                                        className={`user-item ${addingMember ? 'disabled' : ''}`}
                                        onClick={() => !addingMember && handleAddMember(user)}
                                    >
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-email">{user.email}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="no-users">No users available to add</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectDetail;