import './Shimmer.css';

// =====================================================
// LOADING SPINNER COMPONENT (Overlay)
// =====================================================

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    showText?: boolean;
    variant?: 'default' | 'overlay' | 'inline';
    color?: string;
}

export function Loading({ 
    size = 'medium', 
    text = 'Loading...', 
    showText = true,
    variant = 'default',
    color
}: LoadingProps) {
    return (
        <div className={`loading-container loading-${variant}`}>
            <div 
                className={`loading-spinner loading-spinner-${size}`}
                style={color ? { borderTopColor: color, borderRightColor: color } : undefined}
            />
            {showText && <div className='loading-text'>{text}</div>}
        </div>
    );
}

// =====================================================
// SHIMMER BASE COMPONENT
// =====================================================

interface ShimmerProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

export function Shimmer({ 
    width, 
    height, 
    borderRadius, 
    className = '', 
    style 
}: ShimmerProps) {
    return (
        <div 
            className={`shimmer ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
                ...style
            }}
        />
    );
}

// =====================================================
// DASHBOARD SHIMMER SKELETON
// =====================================================

export function DashboardShimmer() {
    return (
        <div className="shimmer-container">
            <div className="shimmer-dashboard">
                {/* Welcome Section */}
                <div className="shimmer-welcome">
                    <div className="shimmer-welcome-text">
                        <div className="shimmer shimmer-title" />
                        <div className="shimmer shimmer-subtitle" />
                    </div>
                    <div className="shimmer shimmer-date" />
                </div>

                {/* Stats Grid */}
                <div className="shimmer-stats-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="shimmer-stat-card">
                            <div className="shimmer shimmer-stat-icon" />
                            <div className="shimmer-stat-content">
                                <div className="shimmer shimmer-stat-label" />
                                <div className="shimmer shimmer-stat-number" />
                                <div className="shimmer shimmer-stat-trend" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart Section */}
                <div className="shimmer-chart-section">
                    <div className="shimmer-chart-header">
                        <div className="shimmer shimmer-chart-title" />
                        <div className="shimmer shimmer-chart-period" />
                    </div>
                    <div className="shimmer-chart-container">
                        {[180, 140, 200, 120].map((height, i) => (
                            <div 
                                key={i} 
                                className="shimmer shimmer-bar" 
                                style={{ height: `${height}px` }}
                            />
                        ))}
                    </div>
                    <div className="shimmer-chart-legend">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="shimmer-legend-item">
                                <div className="shimmer shimmer-legend-dot" />
                                <div className="shimmer shimmer-legend-text" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// =====================================================
// TABLE/LIST SHIMMER SKELETON
// =====================================================

interface TableShimmerProps {
    rows?: number;
    showAvatar?: boolean;
    columns?: number;
}

export function TableShimmer({ rows = 5, showAvatar = true, columns = 4 }: TableShimmerProps) {
    return (
        <div className="shimmer-container">
            <div className="shimmer-table">
                {/* Table Header */}
                <div className="shimmer-table-header">
                    <div className="shimmer shimmer-table-title" />
                    <div className="shimmer-table-actions">
                        <div className="shimmer shimmer-search" />
                        <div className="shimmer shimmer-button" />
                    </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="shimmer-table-row">
                        {showAvatar && <div className="shimmer shimmer-avatar" />}
                        <div className="shimmer shimmer-cell-text shimmer-cell-lg" />
                        {columns >= 2 && <div className="shimmer shimmer-cell-text shimmer-cell-md" />}
                        {columns >= 3 && <div className="shimmer shimmer-cell-text shimmer-cell-md" />}
                        {columns >= 4 && <div className="shimmer shimmer-badge" />}
                    </div>
                ))}
            </div>
        </div>
    );
}

// =====================================================
// PROFILE SHIMMER SKELETON
// =====================================================

export function ProfileShimmer() {
    return (
        <div className="shimmer-container">
            <div className="shimmer-profile">
                {/* Profile Header */}
                <div className="shimmer-profile-header">
                    <div className="shimmer shimmer-profile-avatar" />
                    <div className="shimmer-profile-info">
                        <div className="shimmer shimmer-profile-name" />
                        <div className="shimmer shimmer-profile-role" />
                        <div className="shimmer shimmer-profile-email" />
                    </div>
                </div>

                {/* Profile Form Section */}
                <div className="shimmer-profile-section">
                    <div className="shimmer shimmer-section-title" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="shimmer-form-group">
                            <div className="shimmer shimmer-label" />
                            <div className="shimmer shimmer-input" />
                        </div>
                    ))}
                    <div className="shimmer shimmer-button" style={{ marginTop: '12px' }} />
                </div>
            </div>
        </div>
    );
}

// =====================================================
// PROJECT LIST SHIMMER SKELETON
// =====================================================

interface ProjectShimmerProps {
    count?: number;
}

export function ProjectShimmer({ count = 6 }: ProjectShimmerProps) {
    return (
        <div className="shimmer-container">
            <div className="shimmer-page">
                {/* Page Header */}
                <div className="shimmer-page-header">
                    <div className="shimmer shimmer-page-title" />
                    <div className="shimmer-table-actions">
                        <div className="shimmer shimmer-search" />
                        <div className="shimmer shimmer-button" />
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="shimmer-projects-grid">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="shimmer-project-card">
                            <div className="shimmer-project-header">
                                <div className="shimmer shimmer-project-title" />
                                <div className="shimmer shimmer-project-status" />
                            </div>
                            <div className="shimmer-project-description">
                                <div className="shimmer shimmer-project-line" />
                                <div className="shimmer shimmer-project-line" />
                                <div className="shimmer shimmer-project-line" />
                            </div>
                            <div className="shimmer-project-footer">
                                <div className="shimmer shimmer-project-meta" />
                                <div className="shimmer-project-members">
                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className="shimmer shimmer-member-avatar" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// =====================================================
// GENERIC PAGE SHIMMER
// =====================================================

export function PageShimmer() {
    return (
        <div className="shimmer-container">
            <div className="shimmer-page">
                <div className="shimmer-page-header">
                    <div className="shimmer shimmer-page-title" />
                    <div className="shimmer shimmer-button" />
                </div>
                <div className="shimmer-page-content">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                            key={i} 
                            className="shimmer" 
                            style={{ 
                                width: `${100 - i * 10}%`, 
                                height: '20px', 
                                marginBottom: '16px' 
                            }} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// =====================================================
// PROJECT DETAIL SHIMMER SKELETON
// =====================================================

export function ProjectDetailShimmer() {
    return (
        <div className="shimmer-container">
            <div className="shimmer-profile">
                {/* Project Header */}
                <div className="shimmer-profile-header">
                    <div className="shimmer shimmer-stat-icon" style={{ width: '64px', height: '64px' }} />
                    <div className="shimmer-profile-info" style={{ flex: 1 }}>
                        <div className="shimmer shimmer-profile-name" style={{ width: '280px' }} />
                        <div className="shimmer shimmer-profile-role" style={{ width: '100px' }} />
                    </div>
                    <div className="shimmer shimmer-button" />
                </div>

                {/* Project Details Section */}
                <div className="shimmer-profile-section">
                    <div className="shimmer shimmer-section-title" style={{ width: '180px' }} />
                    <div className="shimmer-project-description" style={{ marginBottom: '24px' }}>
                        <div className="shimmer shimmer-project-line" />
                        <div className="shimmer shimmer-project-line" />
                        <div className="shimmer shimmer-project-line" />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="shimmer-form-group">
                                <div className="shimmer shimmer-label" />
                                <div className="shimmer" style={{ width: '150px', height: '24px' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Members Section */}
                <div className="shimmer-profile-section">
                    <div className="shimmer shimmer-section-title" style={{ width: '140px' }} />
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="shimmer shimmer-avatar" />
                                <div>
                                    <div className="shimmer" style={{ width: '100px', height: '16px', marginBottom: '6px' }} />
                                    <div className="shimmer" style={{ width: '80px', height: '12px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loading;

