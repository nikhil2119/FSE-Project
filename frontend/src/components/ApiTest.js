import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [result, setResult] = useState('Testing API connection...');
  const [error, setError] = useState('');

  useEffect(() => {
    const testApi = async () => {
      try {
        // Test the API endpoint
        const response = await axios.get('/api/test');
        setResult(`API connection successful: ${JSON.stringify(response.data)}`);
      } catch (err) {
        setError(`API connection failed: ${err.message}`);
        console.error('API test error:', err);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ddd' }}>
      <h3>API Connection Test</h3>
      {result && <p style={{ color: 'green' }}>{result}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ApiTest; 