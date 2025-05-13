import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

// URL do backend proxy no Railway
// Como vamos testar apenas em produção, usamos uma URL fixa
const PROXY_API_URL = 'https://maio-convertfy-production.up.railway.app/klaviyo-proxy';

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

    // Preparar parâmetros para o backend proxy
    const params = new URLSearchParams({
      api_key: klaviyoConfig.apiKey,
      public_key: klaviyoConfig.publicKey || '',
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0]
    });

    // Chamar o backend proxy em vez da API da Klaviyo diretamente
    console.log(`Calling proxy API: ${PROXY_API_URL}/klaviyo-revenue`);
    const response = await fetch(`${PROXY_API_URL}/klaviyo-revenue?${params}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Proxy API error:', errorData);
      throw new Error(errorData.error || errorData.details?.detail || `Klaviyo API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Verificar se a resposta tem o formato esperado
    if (!data || !data.data) {
      console.warn('Unexpected API response format:', data);
      return 0;
    }
    
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

// Função para verificar a saúde do backend proxy
export const checkProxyHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${PROXY_API_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Error checking proxy health:', error);
    return false;
  }
};