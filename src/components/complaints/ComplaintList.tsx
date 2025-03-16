import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { db } from '../../services/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";


interface Complaint {
  id: number;
  name: string;
  title: string;
  location: string;
  date: string;
  status: string;
  description: string;
}

export const ComplaintList = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      try {
        
            const res = await fetch("http://localhost:5000/api/users/gettinguserid", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
              body: JSON.stringify({ token }),
            });
            if(res.ok){
        
            const data = await res.json();
            if (data.uid) {
              


              const userid = data.uid;
              const response = await db.getComplaintsone(token, userid);
              setComplaints(response.complaints);
              
      

            } 
          }
            
 
        
      } catch (err) {
        setError('Failed to fetch complaints');
        
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Function to handle view details click
  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Complaint</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell>{complaint.id}</TableCell>
              <TableCell>{complaint.title}</TableCell>
              <TableCell>{complaint.location}</TableCell>
              <TableCell>
                <span className={`complaint-status status-${complaint.status.toLowerCase()}`}>
                  {complaint.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected complaint.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedComplaint.id}</p>
            <p><strong>Title:</strong> {selectedComplaint.title}</p>
            <p><strong>Location:</strong> {selectedComplaint.location}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      )}
    </div>
  );
};
