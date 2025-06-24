
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Image, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Auctions',
      value: '23',
      change: '+5%',
      trend: 'up',
      icon: Image,
      color: 'bg-green-500'
    },
    {
      title: 'Revenue',
      value: '$45,230',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-amber-500'
    },
    {
      title: 'Avg. Bid Value',
      value: '$1,245',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New artwork listed', user: 'Sarah Johnson', time: '2 min ago', status: 'success' },
    { id: 2, action: 'Bid placed on "Sunset Dreams"', user: 'Mike Chen', time: '5 min ago', status: 'info' },
    { id: 3, action: 'Seller application received', user: 'Emma Davis', time: '10 min ago', status: 'warning' },
    { id: 4, action: 'Auction ended', user: 'System', time: '15 min ago', status: 'default' },
    { id: 5, action: 'Payment processed', user: 'John Smith', time: '20 min ago', status: 'success' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <div className="text-sm text-slate-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                    <p className="text-xs text-slate-600">{activity.user} • {activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'success' ? 'default' : 'secondary'}
                    className={
                      activity.status === 'success' ? 'bg-green-100 text-green-800' :
                      activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'info' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors">
                <Image className="h-6 w-6 mb-2" />
                <div className="text-sm font-medium">Review Artworks</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors">
                <Users className="h-6 w-6 mb-2" />
                <div className="text-sm font-medium">Manage Users</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors">
                <TrendingUp className="h-6 w-6 mb-2" />
                <div className="text-sm font-medium">View Reports</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors">
                <DollarSign className="h-6 w-6 mb-2" />
                <div className="text-sm font-medium">Transactions</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
