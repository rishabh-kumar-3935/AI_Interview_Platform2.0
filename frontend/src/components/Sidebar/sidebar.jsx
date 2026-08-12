import { NavLink, useNavigate } from "react-router-dom";
import { Home, User, Settings, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../../store/authSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu = [
    {
      name: "Home",
      icon: <Home size={20} />,
      path: "/dashboard",
    },
    {
      name: "Profile",
      icon: <User size={20} />,
      path: "/profile",
    },

    {
        name:" Resume analyzer",
        path:"/resume_analyzer"
    },
    {
        name:"AI Interview",
        path:"/ai_interview"
    },
    {
        name:"Explain Concept",
        path:"/explain_concept",
    },
    {
        name:"Progress",
        path:"/progress"
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 text-white flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-zinc-800">
        <h1 className="text-2xl font-bold">
          AI<span className="text-green-500">Interview</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-green-500 text-black"
                  : "hover:bg-zinc-800"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button
          type="button"
          onClick={() => {
            dispatch(authLogout());
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-3 rounded-xl"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;