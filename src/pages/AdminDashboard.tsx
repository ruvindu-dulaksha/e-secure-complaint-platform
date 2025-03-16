import AdminComplaintList from ".././components/admin/AdminComplaintList";
import UserManagement from ".././components/admin/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-police-navy mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="complaints" className="w-full">
        <TabsList>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        <TabsContent value="complaints">
          <AdminComplaintList />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;