import { useEffect, useState } from 'react';

import { useToast } from '../hooks/use-toast';

export const FirebaseConnectionTest = () => {
  const [status, setStatus] = useState('Checking connection...');
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const idToken = localStorage.getItem('token');
        if (!idToken) {
          setStatus('Not connected');
          return;
        }
        const API_URL = import.meta.env.VITE_API_URL;
        // Try to verify the token with the backend
        const response = await fetch('${API_URL}/auth/verify', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (response.ok) {
          setStatus('Connected to API');
          toast({
            title: "Connection Status",
            description: "Successfully connected to API",
          });
        } else {
          setStatus('Not connected');
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Failed to verify connection",
          });
        }
      } catch (error) {
        
        setStatus('Connection failed');
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to API",
        });
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-2 text-sm font-medium">
      {status === 'Connected to API' ? (
        <span className="text-green-600">{status}</span>
      ) : (
        <span className="text-red-600">{status}</span>
      )}
    </div>
  );
};

export default FirebaseConnectionTest;