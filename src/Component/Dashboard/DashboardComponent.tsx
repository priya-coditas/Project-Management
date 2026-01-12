import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdPeople, MdFolder, MdPlayArrow, MdTrendingUp, MdAccessTime, MdCheckCircle, MdPause, MdCancel } from "react-icons/md";
import AuthContext from "../../store/AuthContext";
import withAdminAccess from "../../HOC/withAdminAccess";
import api from "../../api/axios";
import { DashboardShimmer } from "../Loading/Shimmer";
import './DashboardComponent.css';

interface ProjectStatistics {
    total: number;
    byStatus: {
        planning: number;
        in_progress: number;
        on_hold: number;
        completed: number;
        cancelled: number;
    };
    byPriority: {
        low: number;
        medium: number;
        high: number;
    };
}

function DashboardComponent({ canViewUsers }: {canViewUsers: boolean}) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [statistics, setStatistics] = useState<ProjectStatistics | null>(null);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get('/projects/statistics');
                setStatistics(response.data);
                console.log(response.data);
            } catch (err: any) {
                console.error('Failed to fetch statistics:', err);
                setError('Failed to load statistics');
                // Set default values if API fails
                setStatistics({
                    total: 0,
                    byStatus: {
                        planning: 0,
                        in_progress: 0,
                        on_hold: 0,
                        completed: 0,
                        cancelled: 0
                    },
                    byPriority: {
                        low: 0,
                        medium: 0,
                        high: 0
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    // Fetch total users count
    useEffect(() => {
        const fetchUsersCount = async () => {
            if (!canViewUsers) return;
            
            try {
                const response = await api.get('/users');
                const responseData = response.data;
                
                // Handle different API response structures
                let usersCount = 0;
                if (Array.isArray(responseData)) {
                    usersCount = responseData.length;
                } else if (responseData?.users) {
                    usersCount = responseData.pagination?.totalUsers || responseData.users.length;
                } else if (responseData?.data) {
                    usersCount = responseData.pagination?.total || responseData.data.length;
                } else if (responseData?.total) {
                    usersCount = responseData.total;
                }
                
                setTotalUsers(usersCount);
            } catch (err: any) {
                console.error('Failed to fetch users count:', err);
                setTotalUsers(0);
            }
        };

        fetchUsersCount();
    }, [canViewUsers]);

    const handleNavigation = (type: string) => {
        if(type === "users"){
            navigate('/usersList')
        } else {
            navigate('/project')
        }
    }

    // Calculate active projects (in_progress)
    const activeProjects = statistics?.byStatus?.in_progress || 0;
    const completedProjects = statistics?.byStatus?.completed || 0;
    const totalProjects = statistics?.total || 0;

    // Calculate max value for charts (round up to nearest 10)
    const maxValue = Math.max(totalProjects, completedProjects, activeProjects, totalUsers, 10);
    const chartMaxValue = Math.ceil(maxValue / 10) * 10 || 30;

    // Chart data - filter based on canViewUsers from HOC
    const chartData = canViewUsers 
        ? [
            { label: 'Total Users', value: totalUsers, maxValue: chartMaxValue, color: '#6366f1' },
            { label: 'Total Projects', value: totalProjects, maxValue: chartMaxValue, color: '#3b82f6' },
            { label: 'Active Projects', value: activeProjects, maxValue: chartMaxValue, color: '#10b981' },
            { label: 'Completed Projects', value: completedProjects, maxValue: chartMaxValue, color: '#f59e0b' },
          ]
        : [
            { label: 'Total Projects', value: totalProjects, maxValue: chartMaxValue, color: '#3b82f6' },
            { label: 'Active Projects', value: activeProjects, maxValue: chartMaxValue, color: '#10b981' },
            { label: 'Completed Projects', value: completedProjects, maxValue: chartMaxValue, color: '#f59e0b' },
          ];

    if (loading) {
        return <DashboardShimmer />;
    }

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-text">
                    <h1>Welcome back, {user || 'User'}!</h1>
                    <p>Here's what's happening with your projects today.</p>
                </div>
                <div className="welcome-date">
                    <MdAccessTime size={18} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="stats-grid">
                {/* Users Card - Only visible to admin/superadmin */}
                {canViewUsers && (
                    <div className="stat-card users-card" onClick={() => handleNavigation('users')}>
                        <div className="stat-card-left">
                            <div className="stat-icon users-icon">
                                <MdPeople size={26} />
                            </div>
                        </div>
                        <div className="stat-card-right">
                            <span className="stat-label">Total Users</span>
                            <span className="stat-number">{totalUsers}</span>
                            <div className="stat-trend positive">
                                <MdTrendingUp size={14} />
                                <span>View all users</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="stat-card projects-card" onClick={() => handleNavigation('projects')}>
                    <div className="stat-card-left">
                        <div className="stat-icon projects-icon">
                            <MdFolder size={26} />
                        </div>
                    </div>
                    <div className="stat-card-right">
                        <span className="stat-label">Total Projects</span>
                        <span className="stat-number">{totalProjects}</span>
                        <div className="stat-trend positive">
                            <MdTrendingUp size={14} />
                            <span>View all projects</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card active-card" onClick={() => handleNavigation('projects')}>
                    <div className="stat-card-left">
                        <div className="stat-icon active-icon">
                            <MdPlayArrow size={26} />
                        </div>
                    </div>
                    <div className="stat-card-right">
                        <span className="stat-label">Active Projects</span>
                        <span className="stat-number">{activeProjects}</span>
                        <div className="stat-trend positive">
                            <MdTrendingUp size={14} />
                            <span>In Progress</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card completed-card" onClick={() => handleNavigation('projects')}>
                    <div className="stat-card-left">
                        <div className="stat-icon completed-icon">
                            <MdCheckCircle size={26} />
                        </div>
                    </div>
                    <div className="stat-card-right">
                        <span className="stat-label">Completed</span>
                        <span className="stat-number">{completedProjects}</span>
                        <div className="stat-trend positive">
                            <MdTrendingUp size={14} />
                            <span>Finished projects</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="chart-section">
                <div className="section-header">
                    <h2>Overview Statistics</h2>
                    <span className="chart-period">This Month</span>
                </div>
                
                <div className="chart-container">
                    {/* Vertical Bar Chart */}
                    <div className="vertical-chart">
                        <div className="chart-y-axis">
                            <span>{chartMaxValue}</span>
                            <span>{Math.round(chartMaxValue * 0.66)}</span>
                            <span>{Math.round(chartMaxValue * 0.33)}</span>
                            <span>0</span>
                        </div>
                        <div className="vertical-bars">
                            {chartData.map((item, index) => (
                                <div key={index} className="vertical-bar-item">
                                    <div className="vertical-bar-container">
                                        <div 
                                            className="vertical-bar-fill"
                                            style={{ 
                                                height: `${(item.value / item.maxValue) * 100}%`,
                                                background: item.color
                                            }}
                                        >
                                            <span className="vertical-bar-value">{item.value}</span>
                                        </div>
                                    </div>
                                    <span className="vertical-bar-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Legend */}
                <div className="chart-legend">
                    {/* Users Legend - Only visible to admin/superadmin */}
                    {canViewUsers && (
                        <div className="legend-item">
                            <span className="legend-color users-color"></span>
                            <span className="legend-text">Total Users</span>
                        </div>
                    )}
                    <div className="legend-item">
                        <span className="legend-color projects-color"></span>
                        <span className="legend-text">Total Projects</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color active-color"></span>
                        <span className="legend-text">Active Projects</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color completed-color"></span>
                        <span className="legend-text">Completed Projects</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Export the component wrapped with the HOC
export default withAdminAccess(DashboardComponent);