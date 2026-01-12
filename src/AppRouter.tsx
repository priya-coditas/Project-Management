import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { 
    DashboardShimmer, 
    ProfileShimmer, 
    ProjectShimmer, 
    ProjectDetailShimmer, 
    TableShimmer,
    PageShimmer
} from "./Component/Loading/Shimmer";

// Lazy load components
const Dashboard = lazy(() => import('./Screens/Dashboard/Dashboard'));
const Login = lazy(() => import("./Screens/Login/Login"));
const Profile = lazy(() => import("./Screens/Profile/Profile"));
const MainLayout = lazy(() => import("./Screens/Dashboard/MainLayout"));
const ProjectDetail = lazy(() => import("./Component/Project/ProjectDetail"));
const ProjectView = lazy(() => import("./Component/Project/ProjectView"));
const UsersList = lazy(() => import("./Component/Users/UsersList"));

function AppRouter() {
    return (
        <Routes>
            {/* Public Route - Login */}
            <Route 
                path="/" 
                element={
                    <Suspense fallback={<PageShimmer />}>
                        <Login />
                    </Suspense>
                } 
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route 
                    element={
                        <Suspense fallback={<PageShimmer />}>
                            <MainLayout />
                        </Suspense>
                    }
                >
                    <Route 
                        path="/dashboard" 
                        element={
                            <Suspense fallback={<DashboardShimmer />}>
                                <Dashboard />
                            </Suspense>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <Suspense fallback={<ProfileShimmer />}>
                                <Profile />
                            </Suspense>
                        } 
                    />
                    <Route 
                        path="/project" 
                        element={
                            <Suspense fallback={<ProjectShimmer />}>
                                <ProjectView />
                            </Suspense>
                        } 
                    />
                    <Route 
                        path="/projectDetail" 
                        element={
                            <Suspense fallback={<ProjectDetailShimmer />}>
                                <ProjectDetail />
                            </Suspense>
                        } 
                    />
                </Route>

                <Route 
                    path="/usersList" 
                    element={
                        <Suspense fallback={<TableShimmer rows={8} />}>
                            <UsersList />
                        </Suspense>
                    } 
                />
            </Route>
        </Routes>
    );
}

export default AppRouter;
