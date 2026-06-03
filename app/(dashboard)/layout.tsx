import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth.actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              ToDoTrade
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {session.user?.name}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
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
            <NavLink href="/portfolio" icon="💼">
              Portfolio
            </NavLink>
            <NavLink href="/strategy-vault" icon="📚">
              Strategy Vault
            </NavLink>
            <NavLink href="/playbook" icon="📋">
              Playbook
            </NavLink>
            <NavLink href="/analytics" icon="📈">
              Analytics
            </NavLink>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <form action={logoutUser}>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                🚪 Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
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
      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}