import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useStreak } from '../../hooks/useStreak';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { data: streak } = useStreak();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const navItems = [
    { name: 'Problems', path: '/' },
    { name: 'Submissions', path: '/submissions' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant">
      <div className="h-14 w-full px-gutter-lg flex items-center justify-between gap-gutter-md">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-gutter-lg">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-gutter-sm">
            <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center border border-outline-variant text-primary">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
            </div>
            <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface">
              CodeArena
            </span>

          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-gutter-xs" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/' || location.pathname === '/home' || location.pathname.startsWith('/problems')
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-gutter-sm py-1 rounded font-body-sm text-body-sm transition-colors ${
                    isActive
                      ? 'bg-surface-container-high text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>


        </div>

        {/* Right Section: Streak, Random, Docker & Profile */}
        <div className="flex items-center gap-gutter-md">
          {/* Flame Streak Indicator */}
          <div
            className="flex items-center gap-1.5 px-gutter-sm py-1 rounded-full bg-surface-container-low border border-outline-variant/40"
            title={`Current Streak: ${streak?.currentStreak || 7} Days`}
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">bolt</span>
            <span className="font-code-sm text-code-sm font-medium text-amber-400">
              {streak?.currentStreak ?? 7} Days
            </span>
          </div>





          {/* User Profile Avatar & Dropdown */}
          <div className="flex items-center gap-1.5 pl-gutter-xs cursor-pointer relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 focus:outline-none"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-outline-variant bg-surface-container p-2 text-on-surface shadow-2xl backdrop-blur-lg z-50">
                <div className="px-gutter-sm py-2 border-b border-outline-variant mb-1">
                  <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                    {user?.name || 'Developer Account'}
                  </p>
                  <p className="font-code-sm text-code-sm text-on-surface-variant truncate">
                    {user?.email || 'coder@codearena.dev'}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-gutter-sm py-2 font-body-sm text-body-sm rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-gutter-sm py-2 font-body-sm text-body-sm rounded-lg hover:bg-error/10 text-error hover:text-error transition-colors mt-1"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
