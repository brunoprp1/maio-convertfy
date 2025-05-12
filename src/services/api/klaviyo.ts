import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const KLAVIYO_API_URL = 'https://a.klaviyo.com/api/v2';

export const getKlaviyoRevenue = async (): Promise<number> => {
  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get client document to access Klaviyo credentials
    const clientDoc = await getDoc(doc(db, 'clients', user.uid));
    if (!clientDoc.exists()) {
      throw new Error('Client not found');
    }

    const clientData = clientDoc.data();
    const klaviyoConfig = clientData.integrations?.klaviyo;
    
    if (!klaviyoConfig?.enabled || !klaviyoConfig?.apiKey) {
      throw new Error('Please configure your Klaviyo API key in settings to view revenue data');
    }

    // Get metrics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const params = new URLSearchParams({
      api_key: klaviyoConfig.apiKey,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      unit: 'day',
      measurement: 'revenue'
    });

    const response = await fetch(`${KLAVIYO_API_URL}/metrics/timeline?${params}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Klaviyo API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Calculate total revenue from the timeline data
    const totalRevenue = data.data?.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.value) || 0);
    }, 0) || 0;

    return totalRevenue;
  } catch (error) {
    console.error('Error fetching Klaviyo revenue:', error);
    throw error;
  }
};