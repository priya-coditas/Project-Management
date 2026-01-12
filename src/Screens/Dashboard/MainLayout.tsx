import NavHeader from "../../Component/NavHeader/NavHeader";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <NavHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;