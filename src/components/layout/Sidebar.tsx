import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Receipt, 
  Users, 
  Clock, 
  CreditCard, 
  Settings 
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "POS", href: "/pos", icon: ShoppingCart },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: Receipt },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Business ERP</h1>
        <p className="text-sm text-muted-foreground mt-1">Starter Pack</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth",
              "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-soft"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@business.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
