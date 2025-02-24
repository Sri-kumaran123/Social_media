import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Menu from "../components/menu";

function Layout() {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Fixed Navbar at the Top */}
      <header className="w-full fixed top-0 left-0 z-10 bg-white ">
        <Navbar />
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 pt-[4rem]">
        {/* Sidebar (Only for Medium & Large Screens) */}
        <aside className="hidden md:block md:w-1/5 fixed left-0 top-[4rem] h-[calc(100vh-4rem)] p-4 ">
          <Menu />
        </aside>

        {/* Scrollable Content (Outlet) */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] p-4 md:ml-[20%]">
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation Bar (Only on Small Screens) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md h-14 flex items-center justify-around md:hidden">
        <Menu />
      </nav>
    </div>
  );
}

export default Layout;
