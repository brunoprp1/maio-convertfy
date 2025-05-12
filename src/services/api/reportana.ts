import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const REPORTANA_API_URL = 'https://api.reportana.com/v1';

export interface ReportanaConfig {
  clientId: string;
  clientSecret: string;
}

export async function getReportanaConfig(userId: string): Promise<ReportanaConfig | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  
  const userData = userDoc.data();
  return {
    clientId: userData.reportanaClientId || '',
    clientSecret: userData.reportanaClientSecret || ''
  };
}

export const setReportanaConfig = async (config: ReportanaConfig) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  await updateDoc(doc(db, 'users', user.uid), {
    reportanaClientId: config.clientId,
    reportanaClientSecret: config.clientSecret,
    updatedAt: new Date()
  });
};

export const getReportanaMetrics = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const config = await getReportanaConfig(user.uid);
    if (!config?.clientId || !config?.clientSecret) {
      throw new Error('Reportana credentials not configured');
    }

    const response = await fetch(`${REPORTANA_API_URL}/metrics`, {
      headers: {
        'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Reportana metrics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Reportana metrics:', error);
    throw error;
  }
};