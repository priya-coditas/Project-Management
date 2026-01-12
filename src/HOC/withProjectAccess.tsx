import React, { useContext } from "react";
import AuthContext from "../store/AuthContext";

function withProjectAccess(WrappedComponent: React.ComponentType<any>) {
  function ProjectAccessComponent(props: any) {
    const authContext = useContext(AuthContext);
    const role = authContext.role;

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

  ProjectAccessComponent.displayName =
    "withProjectAccess(" +
    (WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component") +
    ")";

  return ProjectAccessComponent;
}

export default withProjectAccess;
