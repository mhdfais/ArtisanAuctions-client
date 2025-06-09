import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Clock, 
  Eye, 
  Star,
  User,
  Palette,
  Ruler,
  Calendar,
  DollarSign,
  Users,
  ZoomIn,
  History
} from 'lucide-react';
import { getArtworkById, getArtworkBidHistory } from '@/services/userService';
import useToast from '@/hooks/useToast';


// Extend IArtwork interface to include additional fields
interface IArtworkDetails {
  _id: string;
  title: string;
  approvalStatus: 'pending' | 'rejected' | 'approved';
  isActive: boolean;
  reservePrice: number;
  listedDate: string;
  highestBid: number;
  auctionStartTime: string;
  auctionEndTime: string;
  description: string;
  medium: string;
  dimensions: {
    height: string;
    width: string;
  };
  yearCreated: number;
  category: string;
  images: string[];
  // artist: {
  //   _id: string;
  //   name: string;
  //   bio: string;
  //   rating: number;
  //   totalSales: number;
  // };
  condition?: string;
  provenance?: string;
  certification?: string;
  views: number;
  watchers: number;
}

interface IBid {
  _id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  createdAt: string;
}

const ArtworkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<IArtworkDetails | null>(null);
  const [bidHistory, setBidHistory] = useState<IBid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('')
  const { error: toastError } = useToast();

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const artworkResponse = await getArtworkById(id);
        // const bidHistoryResponse = await getArtworkBidHistory(id);
        setArtwork(artworkResponse.data.details);
        // setBidHistory(bidHistoryResponse.data);
        console.log('Artwork:', artworkResponse.data);
        // console.log('Bid History:', bidHistoryResponse.data);
      } catch (err) {
        console.error('Error fetching artwork details:', err);
        setError('Failed to load artwork details');
        toastError('Error', 'Failed to load artwork details');
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || Number(bidAmount) <= (artwork?.highestBid || 0)) {
      toastError('Error', `Bid must be higher than ${formatCurrency(artwork?.highestBid || 0)}`);
      return;
    }
    console.log('Placing bid:', bidAmount);
    // Implement actual bid submission API call here
  };

  const formatTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getTimeLeft = (end: string) => {
    const now = Date.now();
    const endTime = new Date(end).getTime();

    if (isNaN(endTime)) return 'Invalid date';
    if (now >= endTime) return 'Ended';

    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const updateTimer = () => {
      if (artwork?.auctionEndTime) {
        const result = getTimeLeft(artwork.auctionEndTime);
        setTimeLeft(result);
      }
    };

    updateTimer(); // Initial call

    const interval =
      artwork?.auctionEndTime &&
      new Date(artwork.auctionEndTime).getTime() > Date.now()
        ? setInterval(updateTimer, 1000)
        : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [artwork?.auctionEndTime]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const img = e.currentTarget.querySelector('img') as HTMLImageElement;
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || 'Artwork not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F6F1] via-[#FDF9F3] to-[#F5F0E8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={isFavorited ? 'text-red-500' : 'text-slate-600'}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-2xl relative group">
              <div 
                className="relative w-full h-96 lg:h-[500px] overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMove}
              >
                <img
                  src={artwork.images[selectedImage] || '/placeholder-image.jpg'}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-150"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <img
                      src={artwork.images[selectedImage] || '/placeholder-image.jpg'}
                      alt={artwork.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
            <div className="flex space-x-2">
              {artwork.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors group ${
                    selectedImage === index ? 'border-[#D6A85F]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-serif font-bold text-slate-800">{artwork.title}</h1>
                <Badge className="bg-green-100 text-green-800">
                  {artwork.isActive ? 'Live Auction' : artwork.approvalStatus}
                </Badge>
              </div>
              {/* <div className="flex items-center space-x-4 text-slate-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>by {artwork.artist.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{artwork.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{artwork.watchers} watching</span>
                </div>
              </div> */}
            </div>

            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-[#D6A85F]/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Current Bid</p>
                    <p className="text-3xl font-bold text-[#D6A85F]">{formatCurrency(artwork.highestBid)}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-slate-500">{bidHistory.length} bids placed</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBidHistory(!showBidHistory)}
                        className="text-xs text-[#D6A85F] hover:text-[#C19A56] p-0 h-auto"
                      >
                        <History className="h-3 w-3 mr-1" />
                        View History
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Time Left</p>
                    <div className="flex items-center justify-end space-x-1">
                      <Clock className="h-4 w-4 text-red-500" />
                      <p className="text-xl font-bold text-slate-800">{timeLeft}</p>
                    </div>
                    <p className="text-sm text-slate-500">Ends {new Date(artwork.auctionEndTime).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showBidHistory && (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Bid History</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {bidHistory.map((bid) => (
                      <div
                        key={bid._id}
                        className={`flex justify-between items-center p-3 rounded-lg ${
                          bid.amount === artwork.highestBid ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-slate-800">{bid.bidderName}</p>
                          <p className="text-sm text-slate-500">{new Date(bid.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${bid.amount === artwork.highestBid ? 'text-green-700' : 'text-slate-700'}`}>
                            {formatCurrency(bid.amount)}
                          </p>
                          {bid.amount === artwork.highestBid && (
                            <p className="text-xs text-green-600 font-medium">Highest Bid</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Place Your Bid</h3>
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder={`Minimum: ${formatCurrency(artwork.highestBid + 50)}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] px-8"
                    >
                      Place Bid
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500">
                    Starting bid was {formatCurrency(artwork.reservePrice)}
                  </p>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Artwork Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-slate-500" />
                      <div>
                        <span className="text-slate-500">Medium:</span>
                        <p className="font-medium text-slate-800">{artwork.medium}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-4 w-4 text-slate-500" />
                      <div>
                        <span className="text-slate-500">Dimensions:</span>
                        <p className="font-medium text-slate-800">{`${artwork.dimensions.height} x ${artwork.dimensions.width} cm`}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <span className="text-slate-500">Year:</span>
                        <p className="font-medium text-slate-800">{artwork.yearCreated}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500">Category:</span>
                      <p className="font-medium text-slate-800">{artwork.category}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Condition:</span>
                      <p className="font-medium text-slate-800">{artwork.condition || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Provenance:</span>
                      <p className="font-medium text-slate-800">{artwork.provenance || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">About the Artist</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {artwork.artist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-slate-800">{artwork.artist.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-slate-600">{artwork.artist.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{artwork.artist.bio}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{artwork.artist.totalSales} sales</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        <Card className="mt-12 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Description</h3>
            <p className="text-slate-700 leading-relaxed text-lg">{artwork.description}</p>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Additional Information</h4>
                <p className="text-slate-600">{artwork.certification || 'No certification provided'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Auction Details</h4>
                <p className="text-slate-600">
                  This auction will end on {new Date(artwork.auctionEndTime).toLocaleDateString()} at{' '}
                  {new Date(artwork.auctionEndTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtworkDetails;
