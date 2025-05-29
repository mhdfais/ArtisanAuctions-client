import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Check, X, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';

const AdminSellers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const sellers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      status: 'approved',
      applicationDate: '2024-02-20',
      artworksCount: 5,
      totalSales: '$12,450',
      address: '123 Art Street, NY',
      idNumber: 'ID123456789',
      phone: '+1 234-567-8901',
      joinedDate: '2024-02-21',
      lastActive: '2024-05-26',
      rating: 4.8,
      bio: 'Contemporary artist specializing in abstract paintings and digital art.',
      bankDetails: '**** **** **** 1234',
      commissionRate: '15%'
    },
    {
      id: 2,
      name: 'Emma Davis',
      email: 'emma@example.com',
      status: 'pending',
      applicationDate: '2024-05-25',
      artworksCount: 0,
      totalSales: '$0',
      address: '456 Gallery Ave, CA',
      idNumber: 'ID987654321',
      phone: '+1 345-678-9012',
      joinedDate: null,
      lastActive: null,
      rating: null,
      bio: 'Emerging artist working with mixed media and sculpture.',
      bankDetails: null,
      commissionRate: '15%'
    },
    {
      id: 3,
      name: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      status: 'rejected',
      applicationDate: '2024-05-20',
      artworksCount: 0,
      totalSales: '$0',
      address: '789 Artist Blvd, TX',
      idNumber: 'ID555666777',
      phone: '+1 456-789-0123',
      joinedDate: null,
      lastActive: null,
      rating: null,
      bio: 'Traditional painter focusing on landscapes and portraits.',
      bankDetails: null,
      commissionRate: '15%'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleViewDetails = (seller: any) => {
    setSelectedSeller(seller);
    setIsDetailsOpen(true);
  };

  const handleApprove = (sellerId: number) => {
    console.log('Approving seller:', sellerId);
  };

  const handleReject = (sellerId: number) => {
    console.log('Rejecting seller:', sellerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Seller Applications</h1>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {sellers.filter(s => s.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search sellers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300 focus:border-amber-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sellers.map((seller) => (
          <Card key={seller.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{seller.name}</h3>
                  <p className="text-slate-600">{seller.email}</p>
                </div>
                {getStatusBadge(seller.status)}
              </div>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Application Date:</span>
                    <p className="font-medium text-slate-800">
                      {new Date(seller.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Artworks:</span>
                    <p className="font-medium text-slate-800">{seller.artworksCount}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Sales:</span>
                    <p className="font-medium text-amber-600">{seller.totalSales}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">ID Number:</span>
                    <p className="font-medium text-slate-800">{seller.idNumber}</p>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Address:</span>
                  <p className="font-medium text-slate-800">{seller.address}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewDetails(seller)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {seller.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(seller.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(seller.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Seller Details - {selectedSeller?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSeller && (
            <div className="space-y-8">
              {/* Status and Basic Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedSeller.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{selectedSeller.name}</h3>
                    <p className="text-slate-600">{selectedSeller.email}</p>
                  </div>
                </div>
                {getStatusBadge(selectedSeller.status)}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-amber-600" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700">{selectedSeller.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700">{selectedSeller.phone}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                        <span className="text-slate-700">{selectedSeller.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                      Identification
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 text-sm">ID Number:</span>
                        <p className="font-medium text-slate-800">{selectedSeller.idNumber}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">Bank Details:</span>
                        <p className="font-medium text-slate-800">
                          {selectedSeller.bankDetails || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">Commission Rate:</span>
                        <p className="font-medium text-slate-800">{selectedSeller.commissionRate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Application and Activity Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                      Application Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 text-sm">Application Date:</span>
                        <p className="font-medium text-slate-800">
                          {new Date(selectedSeller.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedSeller.joinedDate && (
                        <div>
                          <span className="text-slate-500 text-sm">Joined Date:</span>
                          <p className="font-medium text-slate-800">
                            {new Date(selectedSeller.joinedDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {selectedSeller.lastActive && (
                        <div>
                          <span className="text-slate-500 text-sm">Last Active:</span>
                          <p className="font-medium text-slate-800">
                            {new Date(selectedSeller.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Performance Metrics
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 text-sm">Total Artworks:</span>
                        <p className="font-medium text-slate-800">{selectedSeller.artworksCount}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">Total Sales:</span>
                        <p className="font-medium text-amber-600 text-lg">{selectedSeller.totalSales}</p>
                      </div>
                      {selectedSeller.rating && (
                        <div>
                          <span className="text-slate-500 text-sm">Rating:</span>
                          <p className="font-medium text-slate-800">{selectedSeller.rating}/5.0</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bio Section */}
              {selectedSeller.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Bio</h4>
                    <p className="text-slate-700 leading-relaxed">{selectedSeller.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              {selectedSeller.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => {
                      handleApprove(selectedSeller.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Seller
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                    onClick={() => {
                      handleReject(selectedSeller.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSellers;
