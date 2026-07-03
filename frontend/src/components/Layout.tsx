import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Settings, LogOut } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Detection', path: '/detect', icon: ShieldAlert },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 font-sans relative">
      {/* Floating Navigation Pill */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-1 p-1.5 rounded-full bg-[#111111]/80 backdrop-blur-xl border border-[#222222] shadow-2xl">
          <div className="flex items-center gap-2 pr-6 pl-4 py-2 border-r border-[#222222]">
            <ShieldAlert className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold text-white tracking-tight">FraudGuard</span>
          </div>
          
          <div className="flex items-center gap-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-500' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#222222]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="pl-2 pr-1 border-l border-[#222222]">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-8 max-w-7xl mx-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
