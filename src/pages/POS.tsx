import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, Trash2, Receipt } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Wireless Mouse", price: 29.99, category: "Electronics" },
  { id: 2, name: "USB Cable", price: 9.99, category: "Electronics" },
  { id: 3, name: "Keyboard", price: 59.99, category: "Electronics" },
  { id: 4, name: "Monitor Stand", price: 39.99, category: "Accessories" },
  { id: 5, name: "Desk Lamp", price: 34.99, category: "Accessories" },
  { id: 6, name: "Notebook", price: 4.99, category: "Stationery" },
];

export default function POS() {
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([]);
  const [search, setSearch] = useState("");

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter((item) => item.quantity > 0));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground">Point of Sale</h1>
        <p className="text-muted-foreground mt-1">Quick checkout and product search</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        <div className="lg:col-span-2 space-y-4 overflow-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                onClick={() => addToCart(product)}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border hover:shadow-soft-md hover:scale-105 transition-smooth cursor-pointer"
              >
                <div className="aspect-square bg-secondary rounded-xl mb-3 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-soft-lg border border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Cart</h2>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-secondary/50 rounded-xl p-3 flex items-center gap-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="h-8 w-8 rounded-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-8 w-8 rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">${(total * 1.1).toFixed(2)}</span>
            </div>
            <Button disabled={cart.length === 0} size="lg" className="w-full rounded-xl shadow-soft-md">
              <Receipt className="h-5 w-5 mr-2" />
              Complete Sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
