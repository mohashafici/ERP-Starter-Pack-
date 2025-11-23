import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Building2, DollarSign, Users, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your business preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Business Information</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="My Business Store" className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 234 567 8900" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="contact@business.com" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Business St, City, Country" className="rounded-xl" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Tax & Currency</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select id="currency" className="w-full h-10 px-3 rounded-xl border border-input bg-background">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <Input id="tax" defaultValue="10" type="number" className="rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "John Doe", role: "Admin", email: "john@business.com" },
                { name: "Jane Smith", role: "Manager", email: "jane@business.com" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{user.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-xl">
              Add New User
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Low Stock Alerts", checked: true },
                { label: "Daily Sales Report", checked: true },
                { label: "Employee Check-in", checked: false },
                { label: "Expense Reminders", checked: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <input type="checkbox" defaultChecked={item.checked} className="h-5 w-5 rounded accent-primary" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-sm opacity-90 mb-4">
              Contact our support team for assistance with your ERP system.
            </p>
            <Button variant="secondary" className="w-full rounded-xl">
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <Button size="lg" className="rounded-xl shadow-soft-md">
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
