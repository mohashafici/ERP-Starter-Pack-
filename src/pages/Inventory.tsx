import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { AddProductDialog } from "@/components/inventory/AddProductDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  buying_price: number;
  selling_price: number;
  low_stock_limit: number;
}

export default function Inventory() {
  const { businessId } = useAuth();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (businessId) {
      fetchProducts();
    }
  }, [businessId]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 pt-16 lg:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your products and stock levels</p>
        </div>
        <AddProductDialog onProductAdded={fetchProducts} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl"
          />
        </div>
        <Button variant="outline" size="sm" className="rounded-xl w-full sm:w-auto">
          Import Excel
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Category</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-foreground">Stock</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Buy Price</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Sell Price</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    {search ? 'No products found' : 'No products yet. Add your first product!'}
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="border-b border-border hover:bg-secondary/30 transition-smooth"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <span>📦</span>
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{item.category}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        item.quantity <= item.low_stock_limit 
                          ? "bg-destructive/10 text-destructive" 
                          : "bg-primary/10 text-primary"
                      }`}>
                        {item.quantity <= item.low_stock_limit && <AlertTriangle className="h-3 w-3" />}
                        {item.quantity} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-muted-foreground">{formatCurrency(item.buying_price)}</td>
                    <td className="py-4 px-6 text-right font-semibold">{formatCurrency(item.selling_price)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
