import { useEffect, useState } from 'react';
import { db } from '../../services/auth';
import { Card } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { Alert, AlertDescription } from '../../components/ui/alert';

// Define the structure of a complaint
interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
}

const ManagerComplaintList = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]); // Typed complaints state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchComplaints = async () => {
      const idToken = localStorage.getItem('token');

      // Ensure the token is not null
      if (!idToken) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response: Complaint[] = await db.getComplaints(idToken); // Ensure API returns the correct type
        setComplaints(response.complaints);
      } catch (err) {
        
        setError('Failed to fetch complaints');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch complaints',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [toast]);

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {complaints.map((complaint) => (
        <Card key={complaint.id} className="mb-4">
          <h3 className="text-lg font-bold">{complaint.title}</h3>
          <p>{complaint.description}</p>
          <p>Status: {complaint.status}</p>
        </Card>
      ))}
    </div>
  );
};

export default ManagerComplaintList;
