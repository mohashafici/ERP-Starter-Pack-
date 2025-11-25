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

    const { employee_id, business_id, status, in_time, out_time, date } = await req.json();

    // Validate input
    if (!employee_id || !business_id || !status) {
      return new Response(
        JSON.stringify({ error: 'employee_id, business_id, and status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['present', 'absent', 'late'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status. Must be present, absent, or late' }),
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

    // Check if attendance already exists for this date
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    
    const { data: existing, error: checkError } = await supabaseClient
      .from('attendance')
      .select('id')
      .eq('employee_id', employee_id)
      .eq('date', attendanceDate)
      .maybeSingle();

    if (checkError) {
      console.error('Check error:', checkError);
      return new Response(
        JSON.stringify({ error: 'Failed to check existing attendance', details: checkError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;

    if (existing) {
      // Update existing attendance
      const { data, error } = await supabaseClient
        .from('attendance')
        .update({
          status,
          in_time: in_time || null,
          out_time: out_time || null,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update attendance', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      result = data;
      console.log('Attendance updated:', result.id);
    } else {
      // Create new attendance record
      const { data, error } = await supabaseClient
        .from('attendance')
        .insert({
          employee_id,
          business_id,
          date: attendanceDate,
          status,
          in_time: in_time || null,
          out_time: out_time || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create attendance', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      result = data;
      console.log('Attendance created:', result.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        attendance: result,
        message: existing ? 'Attendance updated successfully' : 'Attendance marked successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mark-attendance function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
