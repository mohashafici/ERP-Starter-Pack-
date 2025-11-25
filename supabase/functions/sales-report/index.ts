import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get query parameters
    const url = new URL(req.url);
    const business_id = url.searchParams.get('business_id');
    const start_date = url.searchParams.get('start_date');
    const end_date = url.searchParams.get('end_date');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    if (!business_id) {
      return new Response(
        JSON.stringify({ error: 'business_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query
    let salesQuery = supabaseClient
      .from('sales')
      .select(`
        id,
        total_amount,
        created_at,
        profiles:user_id (full_name)
      `)
      .eq('business_id', business_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Add date filters if provided
    if (start_date) {
      salesQuery = salesQuery.gte('created_at', start_date);
    }
    if (end_date) {
      salesQuery = salesQuery.lte('created_at', end_date);
    }

    const { data: sales, error: salesError } = await salesQuery;

    if (salesError) {
      console.error('Sales query error:', salesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch sales', details: salesError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get top products
    const { data: topProducts, error: productsError } = await supabaseClient
      .from('sale_items')
      .select(`
        product_id,
        quantity,
        price,
        products:product_id (name, category)
      `)
      .in('sale_id', sales.map((s: any) => s.id));

    if (productsError) {
      console.error('Products query error:', productsError);
    }

    // Calculate top products by quantity
    const productMap = new Map();
    
    if (topProducts) {
      topProducts.forEach((item: any) => {
        const productId = item.product_id;
        if (productMap.has(productId)) {
          const existing = productMap.get(productId);
          existing.total_quantity += item.quantity;
          existing.total_revenue += item.price * item.quantity;
        } else {
          productMap.set(productId, {
            product_id: productId,
            product_name: item.products?.name || 'Unknown',
            category: item.products?.category || 'Unknown',
            total_quantity: item.quantity,
            total_revenue: item.price * item.quantity,
          });
        }
      });
    }

    const topProductsList = Array.from(productMap.values())
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 10);

    // Calculate totals
    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total_amount || 0), 0);
    const totalSales = sales.length;

    console.log('Sales report generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total_revenue: totalRevenue,
          total_sales: totalSales,
          average_sale: totalSales > 0 ? totalRevenue / totalSales : 0,
        },
        sales,
        top_products: topProductsList,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sales-report function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
