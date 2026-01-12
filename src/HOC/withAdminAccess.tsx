// import { useContext, type ComponentType } from 'react';
// import AuthContext from '../store/AuthContext';

// // Define the props that the HOC will inject
// export interface WithAdminAccessProps {
//     isAdmin: boolean;
//     canViewUsers: boolean;
//     role: string;
// }

// /**
//  * Higher-Order Component that checks if the logged-in user has admin/superadmin role
//  * and provides user data visibility control
//  * 
//  * @param WrappedComponent - The component to wrap
//  * @returns A new component with admin access props injected
//  */
// function withAdminAccess<P extends object>(
//     WrappedComponent: ComponentType<P & WithAdminAccessProps>
// ) {
//     const WithAdminAccessComponent = (props: P) => {
//         const { role } = useContext(AuthContext);

//         // Check if user has admin or superadmin role
//         const isAdmin = role?.toLowerCase() === 'admin' || role?.toLowerCase() === 'super-admin';
        
//         // User can view users data only if they are admin or superadmin
//         const canViewUsers = isAdmin;

//         return (
//             <WrappedComponent
//                 {...props}
//                 isAdmin={isAdmin}
//                 canViewUsers={canViewUsers}
//                 role={role}
//             />
//         );
//     };

//     // Set display name for debugging
//     WithAdminAccessComponent.displayName = `WithAdminAccess(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

//     return WithAdminAccessComponent;
// }

// export default withAdminAccess;

import React, { useContext } from "react";
import AuthContext from "../store/AuthContext";

/**
 * This HOC provides admin-related access flags
 * to the wrapped component.
 */
function withAdminAccess(WrappedComponent: React.ComponentType<any>) {
  function AdminAccessComponent(props: any) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

    // Check if the user is admin or super-admin
    const isAdmin =
      role === "admin" || role === "super-admin";

    // Only admin users can view users data
    const canViewUsers = isAdmin;

    return (
      <WrappedComponent
        {...props}
        isAdmin={isAdmin}
        canViewUsers={canViewUsers}
        role={role}
      />
    );
  }

  // Helpful name in React DevTools
  AdminAccessComponent.displayName =
    "withAdminAccess(" +
    (WrappedComponent.displayName || WrappedComponent.name || "Component") +
    ")";

  return AdminAccessComponent;
}

export default withAdminAccess;
