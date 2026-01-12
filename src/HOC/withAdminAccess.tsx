import React, { useContext } from "react";
import AuthContext from "../store/AuthContext";

function withAdminAccess(WrappedComponent: React.ComponentType<any>) {
  function AdminAccessComponent(props: any) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

    const isAdmin =
      role === "admin" || role === "super-admin";

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

  AdminAccessComponent.displayName =
    "withAdminAccess(" +
    (WrappedComponent.displayName || WrappedComponent.name || "Component") +
    ")";

  return AdminAccessComponent;
}

export default withAdminAccess;
