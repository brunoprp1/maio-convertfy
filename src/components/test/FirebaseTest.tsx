import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { activitiesCollection } from '../../services/firebase/collections';
import Card from '../ui/Card';
import Button from '../ui/Button';

const FirebaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test 1: Write Operation
      const testActivity = {
        type: 'client_created',
        description: 'Test activity',
        userId: 'test-user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(activitiesCollection, testActivity);
      
      // Test 2: Read Operation
      const querySnapshot = await getDocs(activitiesCollection);
      const documentsCount = querySnapshot.size;

      setTestResult(`✅ Database connection successful!\n\nWrite Test: Document created with ID: ${docRef.id}\nRead Test: Found ${documentsCount} documents in activities collection`);
    } catch (err) {
      setError(`❌ Database test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <h2 className="text-lg font-medium mb-4">Firebase Database Test</h2>
      
      <Button
        variant="primary"
        onClick={runTest}
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Testing...' : 'Run Database Test'}
      </Button>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {testResult && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md whitespace-pre-wrap">
          {testResult}
        </div>
      )}
    </Card>
  );
};

export default FirebaseTest;