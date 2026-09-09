import Link from 'next/link';

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
  isMobile?: boolean;
}

export function Header({ userName, onLogout, onSidebarToggle, sidebarOpen = true, isMobile = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        {onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
          >
            {sidebarOpen ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        )}
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="w-7 h-7 md:w-8 md:h-8 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-lg md:text-xl font-bold text-gray-900">Ambis.In</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {userName && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs md:text-sm font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 text-sm md:text-base hidden sm:inline">
              Halo, {userName}
            </span>
          </div>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
