import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Edit, Trash, Filter } from 'lucide-react';

const AdminArtworks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const artworks = [
    {
      id: 1,
      title: 'Abstract Harmony',
      artist: 'Sarah Johnson',
      currentBid: '$1,250',
      status: 'active',
      endTime: '2h 15m',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      title: 'Ocean Dreams',
      artist: 'Mike Chen',
      currentBid: '$890',
      status: 'pending',
      endTime: 'Pending approval',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      title: 'City Lights',
      artist: 'Emma Davis',
      currentBid: '$2,100',
      status: 'sold',
      endTime: 'Sold',
      image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=100&h=100&fit=crop'
    },
    {
      id: 4,
      title: 'Mountain Vista',
      artist: 'John Smith',
      currentBid: '$1,750',
      status: 'active',
      endTime: '1d 5h',
      image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=100&h=100&fit=crop'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Artworks Management</h1>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
          Add New Artwork
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-amber-500 hover:bg-amber-600' : ''}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                className={statusFilter === 'active' ? 'bg-amber-500 hover:bg-amber-600' : ''}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                className={statusFilter === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card key={artwork.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(artwork.status)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1">{artwork.title}</h3>
                <p className="text-sm text-slate-600 mb-2">by {artwork.artist}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-slate-600">Current Bid</p>
                    <p className="font-bold text-amber-600">{artwork.currentBid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Time Left</p>
                    <p className="font-semibold text-slate-800">{artwork.endTime}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminArtworks;