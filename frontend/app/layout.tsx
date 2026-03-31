'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShieldBan, Activity, Key, LogOut } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const handleLogout = () => {
    Cookies.remove('apiKey');
    Cookies.remove('token');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: <Home size={22} /> },
    { name: 'Rules Config', path: '/rate-limits', icon: <ShieldBan size={22} /> },
    { name: 'Live Traffic', path: '/logs', icon: <Activity size={22} /> },
    { name: 'Security Key', path: '/api-key', icon: <Key size={22} /> },
  ];

  /* Background Ambient Animations for the futuristic feel - Optimized */
  const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[var(--background)]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px] animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[100px] animate-blob animation-delay-4000" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    </div>
  );

  if (isAuthPage) {
    return (
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <AmbientBackground />
          <div className="min-h-screen flex items-center justify-center relative z-10 p-6">
            {children}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AmbientBackground />
        
        <div className="flex h-screen p-4 md:p-6 lg:p-8 gap-8">
          
          {/* Floating Sidebar */}
          <aside className="hidden md:flex w-[280px] glass-panel rounded-3xl flex-col relative z-20 overflow-hidden shadow-2xl border border-white/10">
            {/* Sidebar Glow Header */}
            <div className="p-8 pb-6 border-b border-white/5 relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/30 blur-3xl rounded-full"></div>
              <h1 className="text-2xl font-black bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3 relative z-10 tracking-tight">
                <ShieldBan className="text-cyan-400 w-8 h-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                SENTINEL
              </h1>
            </div>
            
            <nav className="flex-1 px-4 py-8 space-y-3 relative z-10">
              {menuItems.map((item) => {
                const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`nav-link flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${
                      isActive 
                        ? 'bg-linear-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className={`${isActive ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-gray-500'}`}>
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 relative z-10">
              <button 
                onClick={handleLogout}
                className="group flex w-full items-center gap-4 px-5 py-4 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-500/20 font-medium"
              >
                <LogOut className="group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" size={22} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Floating Content Viewport */}
          <main className="flex-1 glass-panel rounded-3xl relative z-10 overflow-hidden flex flex-col shadow-2xl border border-white/10">
            {/* Top glass bar */}
            <header className="h-20 border-b border-white/5 bg-white/5 backdrop-blur-3xl flex items-center px-10 sticky top-0 z-30">
               <div className="w-full flex justify-between items-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <div className="text-sm font-mono text-gray-500 tracking-widest uppercase">System Online</div>
               </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-10 relative scroll-smooth text-white">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
