import React, { useContext } from 'react';
import AuthContext from '../store/AuthContext';

export interface ProjectAccessProps {
  role: string;
  isAdmin: boolean;
  canCreateProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;
}

function withProjectAccess<P extends object>(WrappedComponent: React.ComponentType<P>) {
  function ProjectAccessComponent(props: Omit<P, keyof ProjectAccessProps>) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

    const isSuperAdmin = role === 'super-admin';
    const isAdmin = role === 'admin' || isSuperAdmin;

    // Permissions
    const canCreateProject = isAdmin;
    const canEditProject = isAdmin;
    const canDeleteProject = isSuperAdmin;

    return (
      <WrappedComponent
        {...(props as P)}
        role={role}
        isAdmin={isAdmin}
        canCreateProject={canCreateProject}
        canEditProject={canEditProject}
        canDeleteProject={canDeleteProject}
      />
    );
  }

  ProjectAccessComponent.displayName = 'withProjectAccess(' + (WrappedComponent.displayName || WrappedComponent.name || 'Component') + ')';

  return ProjectAccessComponent;
}

export default withProjectAccess;
