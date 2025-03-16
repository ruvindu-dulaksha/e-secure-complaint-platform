import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Card } from "../../components/ui/card";
import { useToast } from "../../hooks/use-toast";
import { db, auth } from "../../services/auth";
import { User } from "../../types/auth";



export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managerData, setManagerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const response = await db.getProfile(); // Fetch all users
      // setUsers(Array.isArray(response) ? response : [response]);
      setUsers(response.managers);
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: "Could not load user data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure token exists
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      await auth.createManager(token, managerData);
      toast({
        variant: "default",
        title: "Success",
        description: "Manager account created successfully.",
      });

      setShowCreateModal(false);
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create manager account.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManagerData({ ...managerData, [name]: value });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  const deleteRole = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/users/delete`, 
      //   {
      //   headers: { Authorization: `Bearer ${idToken}` },
      // }
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure this header exists
          Authorization: `Bearer ${token}`,  // Ensure token is sent as a Bearer token in the Authorization header
        },
        body: JSON.stringify({ id }), // Ensure token is sent as JSON if needed (this may be redundant)
      }
    );
      
      fetchUsers();
    } catch (error) {
      
      throw error;
    }
  }

  return (
    <Card className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">User Management</h2>
        <Button onClick={() => setShowCreateModal(true)} className="bg-police-navy text-white">
          Create Manager Account
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={() => deleteRole(user.id)} variant="outline" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Manager Modal */}
      {showCreateModal && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Create Manager Account</h3>
            <div className="space-y-4">
              <Input
                name="firstName"
                placeholder="First Name"
                value={managerData.firstName}
                onChange={handleInputChange}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={managerData.lastName}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                placeholder="Email"
                value={managerData.email}
                onChange={handleInputChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={managerData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-police-navy text-white" onClick={handleCreateManager}>
                Create Manager
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserManagement;
