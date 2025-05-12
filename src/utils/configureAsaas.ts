import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4Ht0oNN5sKgLjfQ1_Cn7cbvObShbzLgs",
  authDomain: "app-convertfy-v2.firebaseapp.com",
  projectId: "app-convertfy-v2",
  storageBucket: "app-convertfy-v2.appspot.com",
  messagingSenderId: "745054377673",
  appId: "1:745054377673:web:8f9b9f9b9b9f9b9b9b9f9b"
};

// Asaas API key to configure
const ASAAS_API_KEY = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNiMGEwMzFiLTdhODItNDViZC04NDEyLTA3YmZiZmQzYzJkMjo6JGFhY2hfOTJhYTdlMjMtOTJiNy00MjNlLTgyODQtNmFiMDE2YjI3MTUy";

// Admin user ID - you'll need to replace this with your actual admin user ID
// If you don't know your user ID, we'll create a default admin config
const ADMIN_USER_ID = "admin";

/**
 * Configure Asaas API key in Firestore
 */
async function configureAsaasApiKey() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  try {
    // Set the Asaas configuration for the admin user
    await setDoc(doc(db, 'clients', ADMIN_USER_ID), {
      integrations: {
        asaas: {
          apiKey: ASAAS_API_KEY,
          enabled: true,
          updatedAt: new Date()
        }
      }
    }, { merge: true });
    
    // Also add a global configuration that can be used by any admin
    await setDoc(doc(db, 'config', 'integrations'), {
      asaas: {
        apiKey: ASAAS_API_KEY,
        enabled: true,
        updatedAt: new Date()
      }
    }, { merge: true });
    
    console.log('✅ Asaas API key configured successfully!');
  } catch (error) {
    console.error('❌ Error configuring Asaas API key:', error);
  }
}

// Execute the configuration
configureAsaasApiKey();
