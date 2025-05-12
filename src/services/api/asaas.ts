import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Base URL for Asaas API
const ASAAS_API_URL = 'https://api.asaas.com/v3';

/**
 * Interface for Asaas configuration
 */
export interface AsaasConfig {
  apiKey: string;
  enabled: boolean;
}

/**
 * Interface for financial data returned from Asaas
 */
export interface AsaasFinancialData {
  monthlyRevenue: number;
  receivedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalCustomers: number;
  lastUpdate: Date;
}

/**
 * Gets the Asaas configuration for a user
 */
export async function getAsaasConfig(userId: string): Promise<AsaasConfig | null> {
  try {
    const userDoc = await getDoc(doc(db, 'clients', userId));
    if (!userDoc.exists()) return null;
    
    const userData = userDoc.data();
    return {
      apiKey: userData.integrations?.asaas?.apiKey || '',
      enabled: userData.integrations?.asaas?.enabled || false
    };
  } catch (error) {
    console.error('Error fetching Asaas config:', error);
    return null;
  }
}

/**
 * Updates the Asaas API configuration
 */
export const setAsaasConfig = async (apiKey: string): Promise<boolean> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  try {
    await updateDoc(doc(db, 'clients', user.uid), {
      'integrations.asaas': {
        apiKey,
        enabled: true,
        updatedAt: new Date()
      }
    });
    return true;
  } catch (error) {
    console.error('Error updating Asaas config:', error);
    throw error;
  }
};

/**
 * Gets financial metrics from Asaas API for the admin dashboard
 */
export const getAsaasFinancialMetrics = async (apiKey?: string): Promise<AsaasFinancialData> => {
  // If no API key is provided, try to get it from the current user's config
  if (!apiKey) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const config = await getAsaasConfig(user.uid);
    if (!config?.enabled || !config?.apiKey) {
      throw new Error('Asaas API key not configured');
    }
    
    apiKey = config.apiKey;
  }
  
  // Get current date for filtering
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
  const currentYear = now.getFullYear();
  
  // Format dates for the API
  const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(currentYear, now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  try {
    // Fetch monthly revenue (all payments for the current month)
    const paymentsResponse = await fetch(`${ASAAS_API_URL}/payments?startDueDate=${firstDayOfMonth}&endDueDate=${lastDayOfMonth}`, {
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!paymentsResponse.ok) {
      throw new Error(`Asaas API error: ${paymentsResponse.status}`);
    }
    
    const paymentsData = await paymentsResponse.json();
    
    // Calculate metrics from the payments data
    let monthlyRevenue = 0;
    let receivedAmount = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;
    
    paymentsData.data.forEach(payment => {
      const value = parseFloat(payment.value);
      
      // Add to total monthly revenue
      monthlyRevenue += value;
      
      // Categorize by status
      switch (payment.status) {
        case 'RECEIVED':
        case 'CONFIRMED':
          receivedAmount += value;
          break;
        case 'PENDING':
        case 'AWAITING_RISK_ANALYSIS':
          pendingAmount += value;
          break;
        case 'OVERDUE':
          overdueAmount += value;
          break;
      }
    });
    
    // Fetch customer count
    const customersResponse = await fetch(`${ASAAS_API_URL}/customers?limit=1`, {
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!customersResponse.ok) {
      throw new Error(`Asaas API error: ${customersResponse.status}`);
    }
    
    const customersData = await customersResponse.json();
    const totalCustomers = customersData.totalCount || 0;
    
    return {
      monthlyRevenue,
      receivedAmount,
      pendingAmount,
      overdueAmount,
      totalCustomers,
      lastUpdate: new Date()
    };
  } catch (error) {
    console.error('Error fetching Asaas financial metrics:', error);
    throw error;
  }
};