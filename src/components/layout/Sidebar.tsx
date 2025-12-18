import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  Map, 
  Users, 
  Settings, 
  LogOut,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const inspectorNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inspect', icon: Plus, label: 'New Inspection' },
  { to: '/inspections', icon: Video, label: 'My Inspections' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/reports', icon: FileText, label: 'All Reports' },
  { to: '/admin/heatmap', icon: Map, label: 'Heatmap' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/alerts', icon: AlertTriangle, label: 'Alerts' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = user?.role === 'admin' ? adminNavItems : inspectorNavItems;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Map className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-foreground">RoadInspector</h1>
            <p className="text-xs text-sidebar-foreground/60">Municipal System</p>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to !== '/dashboard' && item.to !== '/admin' && location.pathname.startsWith(item.to));
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'nav-link',
                  isActive 
                    ? 'nav-link-active' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <Link
            to="/settings"
            className={cn(
              'nav-link',
              location.pathname === '/settings'
                ? 'nav-link-active'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
