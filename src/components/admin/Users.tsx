import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Edit, Trash, Mail } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-01-15',
      totalBids: 12,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'seller',
      status: 'active',
      joinDate: '2024-02-20',
      totalBids: 8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'buyer',
      status: 'suspended',
      joinDate: '2024-03-10',
      totalBids: 3,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma@example.com',
      role: 'seller',
      status: 'pending',
      joinDate: '2024-05-25',
      totalBids: 0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'seller':
        return <Badge className="bg-blue-100 text-blue-800">Seller</Badge>;
      case 'buyer':
        return <Badge className="bg-purple-100 text-purple-800">Buyer</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Users Management</h1>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
          Export Users
        </Button>
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
                  <th className="text-left p-4 font-medium text-slate-700">User</th>
                  <th className="text-left p-4 font-medium text-slate-700">Role</th>
                  <th className="text-left p-4 font-medium text-slate-700">Status</th>
                  <th className="text-left p-4 font-medium text-slate-700">Join Date</th>
                  <th className="text-left p-4 font-medium text-slate-700">Total Bids</th>
                  <th className="text-left p-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-600">
                      {user.totalBids}
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
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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
