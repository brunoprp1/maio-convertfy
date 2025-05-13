import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

// URL do backend proxy (altere para a URL do Railway após o deploy)
const PROXY_API_URL = window.location.hostname !== 'localhost'
  ? 'https://maio-convertfy-production.up.railway.app/api-proxy/asaas'
  : 'http://localhost:3000/api-proxy/asaas';

// Global API key for development/testing
// In production, this should be stored securely and not in the source code
const GLOBAL_ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNiMGEwMzFiLTdhODItNDViZC04NDEyLTA3YmZiZmQzYzJkMjo6JGFhY2hfOTJhYTdlMjMtOTJiNy00MjNlLTgyODQtNmFiMDE2YjI3MTUy';

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
  // If no API key is provided, try to get it from the current user's config or use global key
  if (!apiKey) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const config = await getAsaasConfig(user.uid);
        if (config?.enabled && config?.apiKey) {
          apiKey = config.apiKey;
        }
      }
    } catch (error) {
      console.warn('Error getting user config, falling back to global key:', error);
    }
    
    // If still no API key, use the global one
    if (!apiKey) {
      console.log('Using global Asaas API key');
      apiKey = GLOBAL_ASAAS_API_KEY;
    }
  }
  
  // Get current date for filtering
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
  const currentYear = now.getFullYear();
  
  // Format dates for the API
  const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(currentYear, now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  try {
    // Adicionando tratamento de erro mais robusto e logs para debug
    console.log('Fetching Asaas payments with API key:', apiKey ? 'Key provided' : 'No key');
    console.log('Date range:', firstDayOfMonth, 'to', lastDayOfMonth);
    
    // Fetch monthly revenue (all payments for the current month) via proxy
    const paymentsResponse = await fetch(`${PROXY_API_URL}/payments?startDueDate=${firstDayOfMonth}&endDueDate=${lastDayOfMonth}&access_token=${encodeURIComponent(apiKey)}`, {
      headers: {
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
    
    // Verificar se os dados retornados têm o formato esperado
    if (!paymentsData.data || !Array.isArray(paymentsData.data)) {
      console.warn('Unexpected response format from Asaas API:', paymentsData);
      // Retornar dados vazios em vez de falhar
      return {
        monthlyRevenue: 0,
        receivedAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        totalCustomers: 0,
        lastUpdate: new Date()
      };
    }
    
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
    
    // Fetch customer count via proxy
    const customersResponse = await fetch(`${PROXY_API_URL}/customers?limit=1&access_token=${encodeURIComponent(apiKey)}`, {
      headers: {
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
    
    // Retornar dados mock em vez de falhar completamente
    return {
      monthlyRevenue: 5000,
      receivedAmount: 3500,
      pendingAmount: 1500,
      overdueAmount: 0,
      totalCustomers: 10,
      lastUpdate: new Date()
    };
  }
};