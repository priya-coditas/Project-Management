import { useState, useEffect, useContext } from 'react';
import './ProjectView.css'
import { MdPerson, MdEdit, MdDelete, MdAdd, MdSearch, MdFilterList, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import CreateProject from './CreateProject';
import EditProject from './EditProject';
import withProjectAccess from '../../HOC/withProjectAccess';
import api from '../../api/axios';
import { ProjectShimmer } from '../Loading/Shimmer';
import AuthContext from '../../store/AuthContext';

interface TeamMember {
    userId: string;
    userName: string;
    userRole: string;
    projectRole: string;
    joinedAt: string;
}

interface Project {
    id?: string;
    name: string; 
    title?: string;
    description?: string;
    status: string;
    priority: string;
    progress?: number;
    members?: number | TeamMember[];
    teamMembers?: TeamMember[];
    owner?: string | { name: string; _id?: string };
    createdBy?: { name: string; _id?: string };
    startDate?: string;
    endDate?: string;
    dueDate?: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalProjects: number;
    limit: number;
}


function ProjectView({ canCreateProject, canEditProject, canDeleteProject }: {canCreateProject: boolean, canEditProject: boolean, canDeleteProject: boolean}) {
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalProjects: 0,
        limit: 10
    });

    const fetchProjects = async (page: number = 1) => {
        setLoading(true);
        setError('');
        
        try {
            const response = await api.get('/projects', {
                params: {
                    page,
                    limit: 10,
                    userId
                }
            });
            
            const responseData = response.data;
            
            // Handle different API response structures
            let projectData: Project[] = [];
            let paginationData: any = null;
            
            if (Array.isArray(responseData)) {
                projectData = responseData;
            } else if (responseData?.projects) {
                projectData = responseData.projects;
                paginationData = responseData.pagination;
            } else if (responseData?.data) {
                projectData = responseData.data;
                paginationData = responseData.pagination || responseData.meta;
            } else {
                // Try to find any array in the response
                const keys = Object.keys(responseData || {});
                for (const key of keys) {
                    if (Array.isArray(responseData[key])) {
                        projectData = responseData[key];
                        break;
                    }
                }
            }
            
            setProjects(projectData);
            setPagination({
                currentPage: paginationData?.currentPage || paginationData?.page || page,
                totalPages: paginationData?.totalPages || paginationData?.pages || Math.ceil((paginationData?.total || projectData.length) / 10) || 1,
                totalProjects: paginationData?.totalProjects || paginationData?.total || projectData.length,
                limit: paginationData?.limit || 10
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to fetch projects. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProjects(1);
        }
    }, [userId]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchProjects(newPage);
        }
    };

    const handleProjectCreated = () => {
        fetchProjects(pagination.currentPage);
    };

    const handleNavigation = (projectId: string) => {
        navigate("/projectDetail", { state: { projectId } });
    }

    const handleEdit = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setSelectedProject(project);
        setEditOpen(true);
    }

    const handleProjectUpdated = () => {
        fetchProjects(pagination.currentPage);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setSelectedProject(null);
    };

    const handleDelete = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.delete(`/projects/${projectId}`);
            fetchProjects(pagination.currentPage);
        } catch (err: any) {
            console.error('Delete Project Error:', err);
            const errorMessage = err.response?.data?.message;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else {
                setError('Failed to delete project. Please try again.');
            }
            setLoading(false);
        }
    }

    const getStatusClass = (status: string) => {
        const statusLower = status?.toLowerCase();
        switch(statusLower) {
            case 'completed': return 'status-completed';
            case 'in_progress':
            case 'in progress': return 'status-in_progress';
            case 'planning': return 'status-planning';
            case 'cancelled': return 'status-cancelled';
            case 'on_hold':
            case 'on hold': return 'status-on_hold';
            default: return '';
        }
    }

    const getPriorityClass = (priority: string) => {
        const priorityLower = priority?.toLowerCase();
        switch(priorityLower) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return '';
        }
    }

    const formatStatus = (status: string) => {
        if (!status) return '';
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const getOwnerName = (project: Project): string => {
        if (typeof project.owner === 'string') {
            return project.owner;
        } else if (project.owner && typeof project.owner === 'object') {
            return project.owner.name || '';
        } else if (project.createdBy?.name) {
            return project.createdBy.name;
        }
        return '';
    };

    const getMemberCount = (project: Project): number => {
        if (typeof project.members === 'number') {
            return project.members;
        } else if (Array.isArray(project.members)) {
            return project.members.length;
        } else if (Array.isArray(project.teamMembers)) {
            return project.teamMembers.length;
        }
        return 0;
    };

    const filteredProjects = projects.filter(project => {
        const title = project.name || project.title || '';
        const owner = getOwnerName(project);
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               owner.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <ProjectShimmer />;
    }

    return (
        <div className="project-page">
            {/* Header Section */}
            <div className="project-header">
                <div className="header-left">
                    <h1 className="page-title">Projects</h1>
                    <span className="project-count">{pagination.totalProjects} projects</span>
                </div>
                <div className="header-right">
                    <div className="search-box">
                        <MdSearch size={20} className="search-icon" />
                        <input 
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    {/* <button className="filter-btn">
                        <MdFilterList size={20} />
                        Filter
                    </button> */}
                    {/* Create Project Button - Only visible to admin/superadmin */}
                    {canCreateProject && (
                        <button className="create-project-btn" onClick={() => setOpen(true)}>
                            <MdAdd size={20} />
                            New Project
                        </button>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={() => fetchProjects(pagination.currentPage)}>Retry</button>
                </div>
            )}

            {/* Projects Grid */}
            <div className="project-main-container">
                {filteredProjects.map(project => (
                    <div 
                        key={project?.id}
                        className="project-card"
                        onClick={() => handleNavigation(project?.id || '')}
                    >
                        {/* Card Header */}
                        <div className="card-header">
                            <span className={`priority-badge ${getPriorityClass(project.priority)}`}>
                                {project.priority}
                            </span>
                            {/* Edit & Delete Actions - Only visible to admin/superadmin */}
                            {(canEditProject || canDeleteProject) && (
                                <div className="project-actions">
                                    {canEditProject && (
                                        <div 
                                            className="action-icon edit-icon"
                                            onClick={(e) => handleEdit(e, project)}
                                        >
                                            <MdEdit size={16} />
                                        </div>
                                    )}
                                    {canDeleteProject && (
                                        <div 
                                            className="action-icon delete-icon"
                                            onClick={(e) => handleDelete(e, project.id || '')}
                                        >
                                            <MdDelete size={16} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Card Body */}
                        <div className="card-body">
                            <h3 className="project-title">{project.name || project.title}</h3>
                            <span className={`status-badge ${getStatusClass(project.status)}`}>
                                {formatStatus(project.status)}
                            </span>
                        </div>

                        {/* Progress Section */}
                        <div className="progress-section">
                            <div className="progress-header">
                                <span className="progress-label">Progress</span>
                                <span className="progress-value">{Math.round((project.progress || 0))}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div 
                                    className="progress-bar-fill"
                                    style={{ width: `${(project.progress || 0) }%` }}
                                />
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="card-footer">
                            <div className="footer-left">
                                <div className="members-info">
                                    <MdPerson size={16} />
                                    <span>{getMemberCount(project)} members</span>
                                </div>
                            </div>
                            <div className="footer-right">
                                <span className="due-date">Due: {formatDate(project.endDate || project.dueDate)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Projects Found */}
            {!loading && filteredProjects.length === 0 && (
                <div className="no-projects">
                    <p>No projects found</p>
                    <span>Try adjusting your search or create a new project</span>
                </div>
            )}

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

            <CreateProject 
                isOpen={open} 
                onClose={() => setOpen(false)} 
                onProjectCreated={handleProjectCreated}
            />

            <EditProject
                isOpen={editOpen}
                onClose={handleEditClose}
                onProjectUpdated={handleProjectUpdated}
                project={selectedProject}
            />
        </div>
    )
}

// Export the component wrapped with the HOC
export default withProjectAccess(ProjectView);
