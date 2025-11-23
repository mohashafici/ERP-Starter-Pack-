import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const sales = [
  { id: "INV-001", customer: "Sarah Johnson", items: 3, date: "2024-01-20", time: "14:30", amount: 284.00, staff: "John Doe" },
  { id: "INV-002", customer: "Mike Peters", items: 1, date: "2024-01-20", time: "15:45", amount: 149.00, staff: "Jane Smith" },
  { id: "INV-003", customer: "Emma Wilson", items: 5, date: "2024-01-20", time: "16:20", amount: 524.00, staff: "John Doe" },
  { id: "INV-004", customer: "John Smith", items: 2, date: "2024-01-19", time: "10:15", amount: 378.00, staff: "Jane Smith" },
  { id: "INV-005", customer: "Lisa Brown", items: 4, date: "2024-01-19", time: "11:30", amount: 456.00, staff: "John Doe" },
  { id: "INV-006", customer: "David Lee", items: 1, date: "2024-01-19", time: "13:00", amount: 89.00, staff: "Jane Smith" },
  { id: "INV-007", customer: "Amy Chen", items: 6, date: "2024-01-18", time: "09:45", amount: 673.00, staff: "John Doe" },
  { id: "INV-008", customer: "Tom Wilson", items: 2, date: "2024-01-18", time: "14:20", amount: 234.00, staff: "Jane Smith" },
];

export default function Sales() {
  const [search, setSearch] = useState("");

  const filteredSales = sales.filter((sale) =>
    sale.id.toLowerCase().includes(search.toLowerCase()) ||
    sale.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalTransactions = filteredSales.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 pt-16 lg:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Sales History</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">View and manage all your sales transactions</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="rounded-xl flex-1 sm:flex-none">
            <FileText className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl flex-1 sm:flex-none">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export Excel</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
          <p className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">${totalSales.toFixed(2)}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <p className="text-sm font-medium text-muted-foreground">Transactions</p>
          <p className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">{totalTransactions}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <p className="text-sm font-medium text-muted-foreground">Avg. Sale</p>
          <p className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">
            ${totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : '0.00'}
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            placeholder="Search by invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl"
          />
        </div>
        <Button variant="outline" size="sm" className="rounded-xl w-full sm:w-auto">
          <Calendar className="h-4 w-4 sm:mr-2" />
          <span>Filter Date</span>
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Invoice</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">Customer</th>
                <th className="text-center py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden md:table-cell">Items</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden lg:table-cell">Date & Time</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden xl:table-cell">Staff</th>
                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, i) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="border-b border-border hover:bg-secondary/30 transition-smooth"
                >
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-primary">{sale.id}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{sale.customer}</div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">{sale.customer}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                    {sale.items} items
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-muted-foreground hidden lg:table-cell">
                    <div>{sale.date}</div>
                    <div className="text-xs">{sale.time}</div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-muted-foreground hidden xl:table-cell">{sale.staff}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-right">
                    ${sale.amount.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
