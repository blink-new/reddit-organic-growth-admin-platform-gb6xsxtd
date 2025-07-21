
import { NavLink } from 'react-router-dom';
import { Rocket, BarChart, Users, MessageSquare, Search, FlaskConical, Settings } from 'lucide-react';

const navItems = [
  { href: '/', icon: Rocket, label: 'Brands' },
  { href: '/strategy', icon: BarChart, label: 'Strategy' },
  { href: '/outreach', icon: Users, label: 'Outreach' },
  { href: '/beacon', icon: MessageSquare, label: 'Beacon' },
  { href: '/trends', icon: Search, label: 'Trends' },
  { href: '/playground', icon: FlaskConical, label: 'Playground' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-card text-card-foreground border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Reddit Growth</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`
          }
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
