import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify this is a cron request (optional security check)
    const cronSecret = req.headers.get('x-cron-secret')
    const expectedSecret = Deno.env.get('CRON_SECRET')
    
    if (expectedSecret && cronSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting daily interest accrual process...')

    // Call the database function to accrue daily interest
    const { data, error } = await supabaseClient.rpc('accrue_daily_interest')

    if (error) {
      console.error('Error accruing daily interest:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const processedCount = data?.length || 0
    console.log(`Daily interest accrual completed. Processed ${processedCount} stakes.`)

    // Log the cron execution
    await supabaseClient.from('admin_logs').insert({
      action: 'daily_interest_accrual',
      target_type: 'cron',
      meta: {
        processed_stakes: processedCount,
        timestamp: new Date().toISOString()
      }
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed_stakes: processedCount,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in cron job:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
