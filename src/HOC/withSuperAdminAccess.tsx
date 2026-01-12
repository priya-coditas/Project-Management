// import { useContext, type ComponentType } from 'react';
// import AuthContext from '../store/AuthContext';

// // Define the props that the HOC will inject
// export interface WithSuperAdminAccessProps {
//     isSuperAdmin: boolean;
//     isAdmin: boolean;
//     canDelete: boolean;
//     canToggleStatus: boolean;
//     role: string;
// }

// /**
//  * Higher-Order Component that checks if the logged-in user has super-admin role
//  * and provides delete permission control
//  * 
//  * @param WrappedComponent - The component to wrap
//  * @returns A new component with super admin access props injected
//  */
// function withSuperAdminAccess<P extends object>(
//     WrappedComponent: ComponentType<P & WithSuperAdminAccessProps>
// ) {
//     const WithSuperAdminAccessComponent = (props: P) => {
//         const { role } = useContext(AuthContext);

//         // Check if user has super-admin or admin role
//         const isSuperAdmin = role?.toLowerCase() === 'super-admin';
//         const isAdmin = role?.toLowerCase() === 'admin' || isSuperAdmin;
        
//         // User can delete only if they are super-admin
//         const canDelete = isSuperAdmin;
        
//         // Admin and super-admin can toggle user status
//         const canToggleStatus = isAdmin;

//         return (
//             <WrappedComponent
//                 {...props}
//                 isSuperAdmin={isSuperAdmin}
//                 isAdmin={isAdmin}
//                 canDelete={canDelete}
//                 canToggleStatus={canToggleStatus}
//                 role={role}
//             />
//         );
//     };

//     // Set display name for debugging
//     WithSuperAdminAccessComponent.displayName = `WithSuperAdminAccess(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

//     return WithSuperAdminAccessComponent;
// }

// export default withSuperAdminAccess;

import React, { useContext } from "react";
import AuthContext from "../store/AuthContext";

/**
 * This HOC provides super admin permissions
 * to the wrapped component.
 */
function withSuperAdminAccess(WrappedComponent: React.ComponentType<any>) {
  function SuperAdminAccessComponent(props: any) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

    // Role checks
    const isSuperAdmin = role === "super-admin";
    const isAdmin = role === "admin" || isSuperAdmin;

    // Permissions
    const canDelete = isSuperAdmin;
    const canToggleStatus = isAdmin;

    return (
      <WrappedComponent
        {...props}
        role={role}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        canDelete={canDelete}
        canToggleStatus={canToggleStatus}
      />
    );
  }

  // Helpful name in React DevTools
  SuperAdminAccessComponent.displayName =
    "withSuperAdminAccess(" +
    (WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component") +
    ")";

  return SuperAdminAccessComponent;
}

export default withSuperAdminAccess;
