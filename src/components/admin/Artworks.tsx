import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Edit } from "lucide-react";
import useToast from "@/hooks/useToast";
import { fetchArtworks } from "@/services/adminService";

interface IArtwork {
  id: string;
  title: string;
  highestBid: number;
  approvalStatus: string;
  endTime: string;
  images: string[];
  isEnded: boolean;
}

const AdminArtworks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [artworks, setArtworks] = useState<IArtwork[]>([]);

  const { success, error } = useToast();

  const getArtworks = async () => {
    try {
      const res = await fetchArtworks();
      // console.log(res.data.artworks);
      setArtworks(res.data.artworks);
    } catch (err) {
      error("Error", "Failed to load artworks");
    }
  };

  useEffect(() => {
    getArtworks();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Artworks Management
        </h1>
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
          </div>
        </CardContent>
      </Card>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card
            key={artwork.title}
            className="bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={artwork.images[0]}
                  alt={artwork.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  {artwork.isEnded ? (
                    <Badge className="bg-blue-100 text-blue-800">Sold</Badge>
                  ) : (
                    getStatusBadge(artwork.approvalStatus)
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1">
                  {artwork.title}
                </h3>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-slate-600">Current Bid</p>
                    <p className="font-bold text-amber-600">
                      {artwork.highestBid}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Time Left</p>
                    <p className="font-semibold text-slate-800">
                      {artwork.endTime}
                    </p>
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
