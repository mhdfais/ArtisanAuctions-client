import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/redux/store/adminAuthSlice";
import Swal from "sweetalert2";
import useToast from "@/hooks/useToast";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {error}=useToast()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D6A85F",
      cancelButtonColor: "#EAD7D1",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      backdrop: true,
    });

    if (result.isConfirmed) {
      try {
        // await logoutUser();
        dispatch(adminLogout());
        navigate("/admin/login");
        // setIsDropdownOpen(false);
      } catch (err) {
        error("Error", "Failed to logout");
      }
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: CheckCircle, label: "Approvals", path: "/admin/approvals" },
    { icon: Image, label: "Artworks", path: "/admin/artworks" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Users, label: "Sellers", path: "/admin/sellers" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AA</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">Admin Portal</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 border-slate-300 focus:border-amber-500"
                />
              </div>
            </div>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg border-r border-slate-200 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 lg:hidden">
              <span className="text-lg font-semibold text-slate-800">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
