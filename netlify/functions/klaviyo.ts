import { Handler } from '@netlify/functions';

const KLAVIYO_API_URL = 'https://a.klaviyo.com/api/v2';

const handler: Handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Klaviyo-API-Key',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const apiKey = event.headers['x-klaviyo-api-key'];
    if (!apiKey) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'API key is required',
          details: 'Please provide a valid Klaviyo API key in the X-Klaviyo-API-Key header'
        }),
      };
    }

    // Get metrics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const params = new URLSearchParams({
      api_key: apiKey,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      unit: 'day',
      measurement: 'revenue'
    });

    try {
      const response = await fetch(`${KLAVIYO_API_URL}/metrics/timeline?${params}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Klaviyo API Error:', data);
        return {
          statusCode: response.status,
          headers: corsHeaders,
          body: JSON.stringify({
            error: 'Klaviyo API error',
            details: data.detail || 'Failed to fetch revenue data from Klaviyo',
            status: response.status
          }),
        };
      }

      // Ensure we have valid data structure
      const revenue = data.data?.reduce((total: number, day: any) => {
        return total + (parseFloat(day.revenue) || 0);
      }, 0) || 0;

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          revenue,
          data: data.data || [],
        }),
      };
    } catch (fetchError) {
      console.error('Klaviyo API fetch error:', fetchError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Klaviyo API communication error',
          details: fetchError instanceof Error ? fetchError.message : 'Failed to communicate with Klaviyo API'
        }),
      };
    }
  } catch (error) {
    console.error('Error in Klaviyo function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
    };
  }
};

export { handler };