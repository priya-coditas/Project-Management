// import { useContext, type ComponentType } from 'react';
// import AuthContext from '../store/AuthContext';

// // Define the props that the HOC will inject
// export interface WithProjectAccessProps {
//     canCreateProject: boolean;
//     canEditProject: boolean;
//     canDeleteProject: boolean;
//     isAdmin: boolean;
//     role: string;
// }

// /**
//  * Higher-Order Component that checks if the logged-in user has admin/superadmin role
//  * and provides project management permissions
//  * 
//  * @param WrappedComponent - The component to wrap
//  * @returns A new component with project access props injected
//  */
// function withProjectAccess<P extends object>(
//     WrappedComponent: ComponentType<P & WithProjectAccessProps>
// ) {
//     const WithProjectAccessComponent = (props: P) => {
//         const { role } = useContext(AuthContext);

//         // Check if user has admin or superadmin role
//         const isSuperAdmin = role?.toLowerCase() === 'super-admin';
//         const isAdmin = role?.toLowerCase() === 'admin' || isSuperAdmin;
        
//         // Only admin/superadmin can create and edit projects
//         const canCreateProject = isAdmin;
//         const canEditProject = isAdmin;
//         // Only super admin can delete projects
//         const canDeleteProject = isSuperAdmin;

//         return (
//             <WrappedComponent
//                 {...props}
//                 canCreateProject={canCreateProject}
//                 canEditProject={canEditProject}
//                 canDeleteProject={canDeleteProject}
//                 isAdmin={isAdmin}
//                 role={role}
//             />
//         );
//     };

//     // Set display name for debugging
//     WithProjectAccessComponent.displayName = `WithProjectAccess(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

//     return WithProjectAccessComponent;
// }

// export default withProjectAccess;

import React, { useContext } from "react";
import AuthContext from "../store/AuthContext";

/**
 * This HOC provides project access permissions
 * based on the logged-in user's role.
 */
function withProjectAccess(WrappedComponent: React.ComponentType<any>) {
  function ProjectAccessComponent(props: any) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

    // Check user roles
    const isSuperAdmin = role === "super-admin";
    const isAdmin = role === "admin" || isSuperAdmin;

    // Permissions
    const canCreateProject = isAdmin;
    const canEditProject = isAdmin;
    const canDeleteProject = isSuperAdmin;

    return (
      <WrappedComponent
        {...props}
        role={role}
        isAdmin={isAdmin}
        canCreateProject={canCreateProject}
        canEditProject={canEditProject}
        canDeleteProject={canDeleteProject}
      />
    );
  }

  // Helps while debugging in React DevTools
  ProjectAccessComponent.displayName =
    "withProjectAccess(" +
    (WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component") +
    ")";

  return ProjectAccessComponent;
}

export default withProjectAccess;
