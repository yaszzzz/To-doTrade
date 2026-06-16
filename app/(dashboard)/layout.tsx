import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth.actions";
import { getCachedSession } from "@/lib/auth-cache";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCachedSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[72px] px-6 border-b border-[#E2E8F0] flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="AxellTrade Logo" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-[#1E293B]">
                  AxellTrade
                </h1>
                <p className="text-xs text-[#64748B]">
                  Trading Platform
                </p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] bg-gradient-to-br from-[#1E4ED8]/5 to-[#10B981]/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#1E4ED8] flex items-center justify-center text-white font-semibold">
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1E293B] truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-[#64748B] truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="mb-3">
              <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            <NavLink href="/dashboard" icon="📊">
              Dashboard
            </NavLink>
            <NavLink href="/journal" icon="📝">
              Trading Journal
            </NavLink>
            <NavLink href="/backtest" icon="🔬">
              Backtest Center
            </NavLink>
            <NavLink href="/signals" icon="📡">
              Trading Signals
            </NavLink>
            
            <div className="my-3 border-t border-[#E2E8F0]"></div>
            
            <div className="mb-3">
              <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Management
              </p>
            </div>
            <NavLink href="/portfolio" icon="💼">
              Portfolio
            </NavLink>
            <NavLink href="/strategy-vault" icon="📚">
              Strategy Vault
            </NavLink>
            <NavLink href="/analytics" icon="📈">
              Analytics
            </NavLink>
          </nav>

          {/* User Actions */}
          <div className="p-4 border-t border-[#E2E8F0] bg-white">
            <form action={logoutUser}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#EF4444] hover:bg-[#FEE2E2] rounded-xl transition-all"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Top Navbar */}
      <div className="ml-[280px] min-h-screen">
        <header className="sticky top-0 z-40 h-[72px] bg-white border-b border-[#E2E8F0] shadow-sm">
          <div className="h-full px-8 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1E293B]">Welcome back, {session.user?.name?.split(' ')[0]}</h2>
              <p className="text-sm text-[#64748B]">Here's what's happening with your trading today</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/public/signals"
                target="_blank"
                className="text-sm font-medium text-[#64748B] hover:text-[#1E4ED8] transition-colors"
              >
                View Public Page
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-xl transition-all group"
    >
      <span className="text-base group-hover:scale-110 transition-transform">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}