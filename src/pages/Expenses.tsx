import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const expenses = [
  { id: 1, category: "Rent", amount: 2500, date: "2024-01-01", description: "Monthly office rent", type: "Fixed" },
  { id: 2, category: "Utilities", amount: 350, date: "2024-01-05", description: "Electricity and water", type: "Variable" },
  { id: 3, category: "Supplies", amount: 450, date: "2024-01-10", description: "Office supplies and materials", type: "Variable" },
  { id: 4, category: "Salaries", amount: 8500, date: "2024-01-15", description: "Staff salaries", type: "Fixed" },
  { id: 5, category: "Marketing", amount: 1200, date: "2024-01-18", description: "Social media ads", type: "Variable" },
  { id: 6, category: "Maintenance", amount: 280, date: "2024-01-20", description: "Equipment maintenance", type: "Variable" },
];

const categories = ["All", "Rent", "Utilities", "Supplies", "Salaries", "Marketing", "Maintenance"];

export default function Expenses() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.category.toLowerCase().includes(search.toLowerCase()) ||
                         expense.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const fixedExpenses = filteredExpenses.filter(e => e.type === "Fixed").reduce((sum, e) => sum + e.amount, 0);
  const variableExpenses = filteredExpenses.filter(e => e.type === "Variable").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 pt-16 lg:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Track and manage business expenses</p>
        </div>
        <Button size="sm" className="rounded-xl shadow-soft-md w-full sm:w-auto">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span>Add Expense</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total Expenses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <p className="text-sm font-medium text-muted-foreground mb-2">Fixed Expenses</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">${fixedExpenses.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <p className="text-sm font-medium text-muted-foreground mb-2">Variable Expenses</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">${variableExpenses.toFixed(2)}</p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-xl whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Category</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden md:table-cell">Description</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden lg:table-cell">Date</th>
                <th className="text-center py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">Type</th>
                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Amount</th>
                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, i) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="border-b border-border hover:bg-secondary/30 transition-smooth"
                >
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div>
                      <div className="font-medium text-xs sm:text-sm">{expense.category}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{expense.description}</div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                    {expense.description}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-muted-foreground hidden lg:table-cell">
                    {expense.date}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-center hidden sm:table-cell">
                    <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      expense.type === "Fixed" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {expense.type}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-right">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Button size="icon" variant="outline" className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
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
