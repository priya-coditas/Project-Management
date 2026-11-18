import React, { useContext } from 'react';
import AuthContext from '../store/AuthContext';

export interface AdminAccessProps {
  isAdmin: boolean;
  canViewUsers: boolean;
  role: string;
}

function withAdminAccess<P extends object>(WrappedComponent: React.ComponentType<P>) {
  function AdminAccessComponent(props: Omit<P, keyof AdminAccessProps>) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

    const isAdmin = role === 'admin' || role === 'super-admin';

    const canViewUsers = isAdmin;

    return (
      <WrappedComponent
        {...(props as P)}
        isAdmin={isAdmin}
        canViewUsers={canViewUsers}
        role={role}
      />
    );
  }

  AdminAccessComponent.displayName = 'withAdminAccess(' + (WrappedComponent.displayName || WrappedComponent.name || 'Component') + ')';

  return AdminAccessComponent;
}

export default withAdminAccess;
