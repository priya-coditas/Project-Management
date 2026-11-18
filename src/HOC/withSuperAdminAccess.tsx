import React, { useContext } from 'react';
import AuthContext from '../store/AuthContext';

export interface SuperAdminAccessProps {
  role: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  canDelete: boolean;
  canToggleStatus: boolean;
}

function withSuperAdminAccess<P extends object>(WrappedComponent: React.ComponentType<P>) {
  function SuperAdminAccessComponent(props: Omit<P, keyof SuperAdminAccessProps>) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

    // Role checks
    const isSuperAdmin = role === 'super-admin';
    const isAdmin = role === 'admin' || isSuperAdmin;

    // Permissions
    const canDelete = isSuperAdmin;
    const canToggleStatus = isAdmin;

    return (
      <WrappedComponent
        {...(props as P)}
        role={role}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        canDelete={canDelete}
        canToggleStatus={canToggleStatus}
      />
    );
  }

  SuperAdminAccessComponent.displayName = 'withSuperAdminAccess(' + (WrappedComponent.displayName || WrappedComponent.name || 'Component') + ')';

  return SuperAdminAccessComponent;
}

export default withSuperAdminAccess;
