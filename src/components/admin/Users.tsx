import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Edit, Trash, Mail } from "lucide-react";
import useToast from "@/hooks/useToast";
import { fetchUsers } from "@/services/adminService";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: string;
  createdAt: string;
  totalBids: number;
  profileImage?: string;
  isSeller: boolean;
  userId:string
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);

  const { success, error } = useToast();

  const getUsers = async () => {
    try {
      const res = await fetchUsers();
      // console.log(res.data.users);
      setUsers(res.data.users);
    } catch (err) {
      error("Error", "failed to load users");
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Users Management</h1>
       
      </div>

      {/* Search */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300 focus:border-amber-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">
                    User
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Role
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Seller
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Join Date
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.userId} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            user.profileImage ||
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          }
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {
                        <Badge className="bg-purple-100 text-purple-800">
                          user
                        </Badge>
                      }
                    </td>
                    <td className="p-4 text-slate-600">
                      {user.isSeller ? "Yes" : "No"}
                    </td>
                    <td className="p-4">
                      {user.isBlocked ? (
                        <Badge className="bg-red-100 text-red-800">
                          Suspended
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
