import { useEffect, useState } from 'react';
import { db } from '../../services/auth';
import { Card } from '../../components/ui/card';

interface Complaint {
  id: string;
  title: string;
  location: string; // Added location as a property
  status: string;
}

const AdminComplaintList = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await db.getComplaints(token);
        setComplaints(response.complaints);
      } catch (err) {
        setError('Failed to fetch complaints');
        
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Complaints</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-300">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint, index) => (
              <tr
                key={complaint.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                  {complaint.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                  {complaint.location}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b border-gray-300">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      complaint.status === 'Resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AdminComplaintList;
