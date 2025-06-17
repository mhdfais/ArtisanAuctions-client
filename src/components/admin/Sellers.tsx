import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import useToast from "@/hooks/useToast";
import { fetchSellers } from "@/services/adminService";

interface ISeller{
  address:string,
  artworkCount:number,
  email:string,
  idNumber:string,
  userId:string,
  name:string,
  approvalStatus:string,
  phone:string,
  bio:string
}

const AdminSellers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sellers, setSellers] = useState<ISeller[]>([]);

  const { error, success } = useToast();

  const getSellers = async () => {
    try {
      const res = await fetchSellers();
      console.log(res.data.sellers);
      setSellers(res.data.sellers);
    } catch (err) {
      error("Error", "Failed to load sellers");
    }
  };

  useEffect(() => {
    getSellers();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleViewDetails = (seller: any) => {
    setSelectedSeller(seller);
    setIsDetailsOpen(true);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Seller Applications
        </h1>
       
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
          <Card
            key={seller.userId}
            className="bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">
                    {seller.name}
                  </h3>
                  <p className="text-slate-600">{seller.email}</p>
                </div>
                {getStatusBadge(seller.approvalStatus)}
              </div>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                 
                  <div>
                    <span className="text-slate-500">Artworks:</span>
                    <p className="font-medium text-slate-800">
                      {seller.artworkCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Sales:</span>
                    <p className="font-medium text-amber-600">
                      N/A
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">ID Number:</span>
                    <p className="font-medium text-slate-800">
                      {seller.idNumber}
                    </p>
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
                    <h3 className="text-xl font-semibold text-slate-800">
                      {selectedSeller.name}
                    </h3>
                    <p className="text-slate-600">{selectedSeller.email}</p>
                  </div>
                </div>
                {getStatusBadge(selectedSeller.approvalStatus)}
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
                        <span className="text-slate-700">
                          {selectedSeller.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700">
                          {selectedSeller.phone}
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                        <span className="text-slate-700">
                          {selectedSeller.address}
                        </span>
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
                        <span className="text-slate-500 text-sm">
                          ID Number:
                        </span>
                        <p className="font-medium text-slate-800">
                          {selectedSeller.idNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">
                          Bank Details:
                        </span>
                        <p className="font-medium text-slate-800">
                          {selectedSeller.bankDetails || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">
                          Commission Rate: 
                        </span>
                        <p className="font-medium text-slate-800">
                         10%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              

              {/* Bio Section */}
              {selectedSeller.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Bio
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedSeller.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

             
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSellers;
