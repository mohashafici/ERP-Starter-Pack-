import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const attendance = [
  { id: 1, name: "John Doe", checkIn: "08:55 AM", checkOut: "05:30 PM", status: "Present", hours: "8.5" },
  { id: 2, name: "Jane Smith", checkIn: "09:10 AM", checkOut: "05:45 PM", status: "Late", hours: "8.5" },
  { id: 3, name: "Mike Johnson", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "Present", hours: "8.5" },
  { id: 4, name: "Sarah Williams", checkIn: "-", checkOut: "-", status: "On Leave", hours: "0" },
  { id: 5, name: "Tom Brown", checkIn: "08:50 AM", checkOut: "Working", status: "Present", hours: "-" },
];

const weeklyAttendance = [
  { name: "John Doe", mon: "✓", tue: "✓", wed: "✓", thu: "✓", fri: "✓" },
  { name: "Jane Smith", mon: "L", tue: "✓", wed: "✓", thu: "L", fri: "✓" },
  { name: "Mike Johnson", mon: "✓", tue: "✓", wed: "✓", thu: "✓", fri: "✓" },
  { name: "Sarah Williams", mon: "✓", tue: "A", wed: "A", thu: "A", fri: "A" },
  { name: "Tom Brown", mon: "✓", tue: "✓", wed: "✓", thu: "✓", fri: "✓" },
];

export default function Attendance() {
  const [view, setView] = useState<"daily" | "weekly">("daily");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 pt-16 lg:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Track employee check-ins and hours</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("daily")}
            className="rounded-xl flex-1 sm:flex-none"
          >
            Today
          </Button>
          <Button
            variant={view === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("weekly")}
            className="rounded-xl flex-1 sm:flex-none"
          >
            Weekly
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold">4</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Present</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold">1</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Late</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-muted flex items-center justify-center">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold">1</p>
          <p className="text-xs sm:text-sm text-muted-foreground">On Leave</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold">42.5</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Total Hours</p>
        </motion.div>
      </div>

      {view === "daily" ? (
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Employee</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">Check In</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden md:table-cell">Check Out</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground hidden lg:table-cell">Hours</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, i) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="border-b border-border hover:bg-secondary/30 transition-smooth"
                  >
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm font-semibold text-primary">
                            {record.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-xs sm:text-sm">{record.name}</span>
                          <div className="text-xs text-muted-foreground sm:hidden">
                            {record.checkIn} - {record.checkOut}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">
                      {record.checkIn}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                      {record.checkOut}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center text-xs sm:text-sm font-semibold hidden lg:table-cell">
                      {record.hours}h
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === "Present" 
                          ? "bg-primary/10 text-primary" 
                          : record.status === "Late"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold text-foreground">Employee</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">Mon</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">Tue</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">Wed</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">Thu</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">Fri</th>
                </tr>
              </thead>
              <tbody>
                {weeklyAttendance.map((record, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="border-b border-border hover:bg-secondary/30 transition-smooth"
                  >
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm">{record.name}</td>
                    {[record.mon, record.tue, record.wed, record.thu, record.fri].map((day, j) => (
                      <td key={j} className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                        <span className={`inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${
                          day === "✓" 
                            ? "bg-primary/10 text-primary" 
                            : day === "L"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {day}
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 sm:p-4 bg-secondary/30 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3 sm:gap-4">
            <span>✓ = Present</span>
            <span>L = Late</span>
            <span>A = Absent</span>
          </div>
        </div>
      )}
    </div>
  );
}
