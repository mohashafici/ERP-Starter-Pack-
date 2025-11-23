import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, TrendingUp, AlertTriangle, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 pt-16 lg:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="rounded-xl flex-1 sm:flex-none">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
          <Button size="sm" className="rounded-xl shadow-soft-md flex-1 sm:flex-none">
            <ShoppingCart className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Sale</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Today's Sales"
          value="$2,847"
          change="+12.5% from yesterday"
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          title="Total Products"
          value="342"
          change="23 low stock"
          changeType="negative"
          icon={Package}
          delay={0.1}
        />
        <StatCard
          title="Net Profit"
          value="$8,429"
          change="+8.2% this month"
          changeType="positive"
          icon={TrendingUp}
          delay={0.2}
        />
        <StatCard
          title="Total Expenses"
          value="$3,284"
          change="This month"
          changeType="neutral"
          icon={AlertTriangle}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-soft border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Sales Overview</h2>
            <select className="px-4 py-2 rounded-xl border border-border bg-background text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 78, 45, 88, 72, 95, 82].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-lg"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-card rounded-2xl p-6 shadow-soft border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Low Stock Alert</h2>
            <span className="text-xs font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-full">
              23 items
            </span>
          </div>
          <div className="space-y-4">
            {[
              { name: "Wireless Mouse", stock: 5 },
              { name: "USB Cable", stock: 8 },
              { name: "Keyboard", stock: 3 },
              { name: "Monitor Stand", stock: 6 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-smooth"
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only {item.stock} left
                  </p>
                </div>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </motion.div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-xl">
            View All Inventory
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-card rounded-2xl p-6 shadow-soft border border-border"
      >
        <h2 className="text-xl font-semibold mb-6">Recent Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Invoice</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Products</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { invoice: "#INV-001", customer: "Sarah Johnson", products: "3 items", date: "2 hours ago", amount: "$284.00" },
                { invoice: "#INV-002", customer: "Mike Peters", products: "1 item", date: "3 hours ago", amount: "$149.00" },
                { invoice: "#INV-003", customer: "Emma Wilson", products: "5 items", date: "5 hours ago", amount: "$524.00" },
                { invoice: "#INV-004", customer: "John Smith", products: "2 items", date: "1 day ago", amount: "$378.00" },
              ].map((sale, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
                  className="border-b border-border hover:bg-secondary/50 transition-smooth"
                >
                  <td className="py-4 px-4 text-sm font-medium text-primary">{sale.invoice}</td>
                  <td className="py-4 px-4 text-sm">{sale.customer}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{sale.products}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{sale.date}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-right">{sale.amount}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
