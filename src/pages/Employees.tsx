import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const employees = [
  { id: 1, name: "John Doe", role: "Manager", email: "john@business.com", phone: "+1 234 567 8900", status: "Active" },
  { id: 2, name: "Jane Smith", role: "Sales Associate", email: "jane@business.com", phone: "+1 234 567 8901", status: "Active" },
  { id: 3, name: "Mike Johnson", role: "Sales Associate", email: "mike@business.com", phone: "+1 234 567 8902", status: "Active" },
  { id: 4, name: "Sarah Williams", role: "Cashier", email: "sarah@business.com", phone: "+1 234 567 8903", status: "On Leave" },
  { id: 5, name: "Tom Brown", role: "Stock Manager", email: "tom@business.com", phone: "+1 234 567 8904", status: "Active" },
];

export default function Employees() {
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 pt-16 lg:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your team members</p>
        </div>
        <Button size="sm" className="rounded-xl shadow-soft-md w-full sm:w-auto">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span>Add Employee</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredEmployees.map((employee, i) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border hover:shadow-soft-md transition-smooth"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{employee.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 sm:px-3 py-1 rounded-full ${
                employee.status === "Active" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {employee.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{employee.phone}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-xl">
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button size="sm" variant="outline" className="flex-1 rounded-xl text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
