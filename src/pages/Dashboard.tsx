import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, TrendingUp, AlertTriangle, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface DashboardStats {
  total_sales_today: number;
  total_sales_month: number;
  total_expenses_month: number;
  net_profit: number;
  low_stock_count: number;
}

interface Sale {
  id: string;
  total_amount: number;
  created_at: string;
  profiles: { full_name: string } | null;
}

export default function Dashboard() {
  const { businessId } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (businessId) {
      fetchDashboardData();
    }
  }, [businessId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_dashboard_stats', { p_business_id: businessId });

      if (statsError) throw statsError;
      if (statsData) {
        setStats(statsData as unknown as DashboardStats);
      }

      // Fetch recent sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('id, total_amount, created_at')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (salesError) throw salesError;
      
      // Transform to match Sale interface
      const transformedSales = (salesData || []).map(sale => ({
        ...sale,
        profiles: null
      }));
      setRecentSales(transformedSales);

      // Fetch low stock products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, quantity, low_stock_limit')
        .eq('business_id', businessId)
        .order('quantity', { ascending: true })
        .limit(10);

      if (!productsError && productsData) {
        const lowStock = productsData.filter(p => p.quantity <= p.low_stock_limit);
        setLowStockProducts(lowStock.slice(0, 4));
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

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
          value={loading ? '...' : formatCurrency(stats?.total_sales_today || 0)}
          change={loading ? '' : `+${stats?.total_sales_today || 0 > 0 ? '12.5' : '0'}% from yesterday`}
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          title="Monthly Sales"
          value={loading ? '...' : formatCurrency(stats?.total_sales_month || 0)}
          change={`${lowStockProducts.length} low stock`}
          changeType={lowStockProducts.length > 0 ? "negative" : "neutral"}
          icon={Package}
          delay={0.1}
        />
        <StatCard
          title="Net Profit"
          value={loading ? '...' : formatCurrency(stats?.net_profit || 0)}
          change="+8.2% this month"
          changeType="positive"
          icon={TrendingUp}
          delay={0.2}
        />
        <StatCard
          title="Total Expenses"
          value={loading ? '...' : formatCurrency(stats?.total_expenses_month || 0)}
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
              {stats?.low_stock_count || 0} items
            </span>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No low stock items</div>
            ) : (
              lowStockProducts.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-smooth"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only {item.quantity} left
                    </p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </motion.div>
              ))
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 rounded-xl"
            onClick={() => navigate('/inventory')}
          >
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : recentSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No recent sales
                  </td>
                </tr>
              ) : (
                recentSales.map((sale, i) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
                    className="border-b border-border hover:bg-secondary/50 transition-smooth"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-primary">
                      #{sale.id.substring(0, 8)}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      -
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">-</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {formatDate(sale.created_at)}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-right">
                      {formatCurrency(sale.total_amount)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
