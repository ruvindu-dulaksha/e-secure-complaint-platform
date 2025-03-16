

import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/ui/button";
import { ComplaintList } from "../components/complaints/ComplaintList";
import { ComplaintForm } from "../components/complaints/ComplaintForm";

const Dashboard = () => {
  const { refreshUser } = useUser();
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  useEffect(() => {
    // Simulate an action that requires refreshing user data
    refreshUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-police-navy">My Dashboard</h1>
        <Button
          onClick={() => setShowComplaintForm(true)}
          className="bg-police-navy text-white"
        >
          File New Complaint
        </Button>
      </div>

      {showComplaintForm ? (
        <ComplaintForm onClose={() => setShowComplaintForm(false)} />
      ) : (
        <ComplaintList />
      )}
    </div>
  );
};

export default Dashboard;
