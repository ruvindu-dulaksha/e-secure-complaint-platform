import ManagerComplaintList from "../components/manager/ManagerComplaintList";

const ManagerDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-police-navy mb-8">Manager Dashboard</h1>
      <ManagerComplaintList />
    </div>
  );
};

export default ManagerDashboard;