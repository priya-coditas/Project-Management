import React, { useContext } from "react";
import AuthContext from "../store/AuthContext";

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

  SuperAdminAccessComponent.displayName =
    "withSuperAdminAccess(" +
    (WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component") +
    ")";

  return SuperAdminAccessComponent;
}

export default withSuperAdminAccess;
