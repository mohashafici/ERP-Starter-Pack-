-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (CRITICAL for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE(user_id, business_id, role)
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT NOT NULL,
  buying_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_limit INTEGER NOT NULL DEFAULT 10,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sale_items table
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  in_time TIME,
  out_time TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'Fixed',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create low_stock_alerts table
CREATE TABLE public.low_stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  alert_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_resolved BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.low_stock_alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _business_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND business_id = _business_id
      AND role = _role
  )
$$;

-- Create security definer function to get user's business_id
CREATE OR REPLACE FUNCTION public.get_user_business_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT business_id
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- RLS Policies for businesses
CREATE POLICY "Users can view their own business"
  ON public.businesses FOR SELECT
  USING (owner_id = auth.uid() OR id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can insert their own business"
  ON public.businesses FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Business owners can update their business"
  ON public.businesses FOR UPDATE
  USING (owner_id = auth.uid());

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their business"
  ON public.profiles FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()) OR id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage roles in their business"
  ON public.user_roles FOR ALL
  USING (
    business_id = public.get_user_business_id(auth.uid()) AND
    public.has_role(auth.uid(), business_id, 'admin'::public.app_role)
  );

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policies for products
CREATE POLICY "Users can view products in their business"
  ON public.products FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    public.has_role(auth.uid(), business_id, 'admin'::public.app_role)
  );

-- RLS Policies for sales
CREATE POLICY "Users can view sales in their business"
  ON public.sales FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can create sales"
  ON public.sales FOR INSERT
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid()) AND
    user_id = auth.uid()
  );

-- RLS Policies for sale_items
CREATE POLICY "Users can view sale items"
  ON public.sale_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sales
      WHERE sales.id = sale_items.sale_id
        AND sales.business_id = public.get_user_business_id(auth.uid())
    )
  );

CREATE POLICY "Users can create sale items"
  ON public.sale_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales
      WHERE sales.id = sale_items.sale_id
        AND sales.business_id = public.get_user_business_id(auth.uid())
        AND sales.user_id = auth.uid()
    )
  );

-- RLS Policies for employees
CREATE POLICY "Users can view employees in their business"
  ON public.employees FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Admins can manage employees"
  ON public.employees FOR ALL
  USING (
    public.has_role(auth.uid(), business_id, 'admin'::public.app_role)
  );

-- RLS Policies for attendance
CREATE POLICY "Admins can view all attendance"
  ON public.attendance FOR SELECT
  USING (
    public.has_role(auth.uid(), business_id, 'admin'::public.app_role)
  );

CREATE POLICY "Employees can view their own attendance"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employees
      WHERE employees.id = attendance.employee_id
        AND employees.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage attendance"
  ON public.attendance FOR ALL
  USING (
    public.has_role(auth.uid(), business_id, 'admin'::public.app_role)
  );

-- RLS Policies for expenses
CREATE POLICY "Admins can manage expenses"
  ON public.expenses FOR ALL
  USING (
    public.has_role(auth.uid(), business_id, 'admin'::public.app_role)
  );

-- RLS Policies for low_stock_alerts
CREATE POLICY "Users can view alerts in their business"
  ON public.low_stock_alerts FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "System can manage alerts"
  ON public.low_stock_alerts FOR ALL
  USING (true);

-- Function to auto-reduce stock after sale
CREATE OR REPLACE FUNCTION public.reduce_stock_after_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_business_id UUID;
  v_current_quantity INTEGER;
  v_low_stock_limit INTEGER;
BEGIN
  -- Get product details
  SELECT quantity, low_stock_limit, business_id
  INTO v_current_quantity, v_low_stock_limit, v_business_id
  FROM public.products
  WHERE id = NEW.product_id;

  -- Reduce stock
  UPDATE public.products
  SET quantity = quantity - NEW.quantity,
      updated_at = now()
  WHERE id = NEW.product_id;

  -- Check if stock is low and create alert
  IF (v_current_quantity - NEW.quantity) <= v_low_stock_limit THEN
    INSERT INTO public.low_stock_alerts (product_id, business_id)
    VALUES (NEW.product_id, v_business_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to reduce stock after sale
CREATE TRIGGER trigger_reduce_stock_after_sale
  AFTER INSERT ON public.sale_items
  FOR EACH ROW
  EXECUTE FUNCTION public.reduce_stock_after_sale();

-- Function to auto-create admin user after business creation
CREATE OR REPLACE FUNCTION public.handle_new_business()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create admin role for business owner
  INSERT INTO public.user_roles (user_id, business_id, role)
  VALUES (NEW.owner_id, NEW.id, 'admin'::public.app_role);

  RETURN NEW;
END;
$$;

-- Trigger to create admin role after business creation
CREATE TRIGGER trigger_handle_new_business
  AFTER INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_business();

-- Function to update product updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to update products updated_at
CREATE TRIGGER trigger_update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Dashboard metrics RPC function
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_business_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_total_sales_today NUMERIC;
  v_total_sales_month NUMERIC;
  v_total_expenses_month NUMERIC;
  v_net_profit NUMERIC;
  v_low_stock_count INTEGER;
BEGIN
  -- Total sales today
  SELECT COALESCE(SUM(total_amount), 0)
  INTO v_total_sales_today
  FROM public.sales
  WHERE business_id = p_business_id
    AND DATE(created_at) = CURRENT_DATE;

  -- Total sales this month
  SELECT COALESCE(SUM(total_amount), 0)
  INTO v_total_sales_month
  FROM public.sales
  WHERE business_id = p_business_id
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);

  -- Total expenses this month
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_expenses_month
  FROM public.expenses
  WHERE business_id = p_business_id
    AND DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE);

  -- Net profit
  v_net_profit := v_total_sales_month - v_total_expenses_month;

  -- Low stock count
  SELECT COUNT(*)
  INTO v_low_stock_count
  FROM public.products
  WHERE business_id = p_business_id
    AND quantity <= low_stock_limit;

  -- Build result JSON
  v_result := json_build_object(
    'total_sales_today', v_total_sales_today,
    'total_sales_month', v_total_sales_month,
    'total_expenses_month', v_total_expenses_month,
    'net_profit', v_net_profit,
    'low_stock_count', v_low_stock_count
  );

  RETURN v_result;
END;
$$;