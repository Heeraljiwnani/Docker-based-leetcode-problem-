import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useStreak } from '../../hooks/useStreak';
import { Flame } from 'lucide-react';
import navLogo from '../../../Logo/Remove_text_from_image_202609061111-removebg-preview.png';

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
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-outline-variant" style={{ backgroundColor: 'rgba(10,10,10,0.92)' }}>
      <div className="h-14 w-full px-gutter-lg flex items-center justify-between gap-gutter-md">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            {/* Icon wrapper: sized at 44px for prominent visibility */}
            <div style={{ width: '44px', height: '44px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
              <img
                src={navLogo}
                alt="CodeArena Logo"
                style={{
                  position: 'absolute',
                  width: '320%',
                  height: '320%',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  top: '58%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  objectFit: 'contain',
                }}
              />
            </div>
            <span className="font-bold tracking-tight text-on-surface flex items-center" style={{ fontSize: '1.4rem', whiteSpace: 'nowrap', lineHeight: 1 }}>
              CodeArena
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-2 ml-2" aria-label="Main Navigation">
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
                  className={`px-gutter-sm py-1 rounded-lg font-body-sm text-body-sm font-bold transition-colors ${
                    isActive
                      ? 'text-on-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  style={isActive ? { backgroundColor: '#84cc16', color: '#0a0a0a' } : {}}
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
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span className="font-code-sm text-code-sm font-bold text-orange-500">
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#84cc16' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#0a0a0a' }}>person</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary ring-2" style={{ '--tw-ring-color': '#0a0a0a' } as React.CSSProperties} />
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-outline-variant p-2 text-on-surface shadow-2xl backdrop-blur-lg z-50" style={{ backgroundColor: '#1c1c1c' }}>
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
