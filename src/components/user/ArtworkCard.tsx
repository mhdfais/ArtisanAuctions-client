import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ArtworkCard: React.FC = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#D6A85F]/20 group hover:-translate-y-1">
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
          alt="Artwork"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          Live
        </div>
      </div>
      <CardContent className="p-6 bg-gradient-to-br from-white to-amber-50/30">
        <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">Abstract Harmony</h3>
        <p className="text-gray-600 mb-4 font-medium">by Sarah Johnson</p>
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-[#D6A85F]/20">
            <p className="text-sm text-gray-600 font-medium">Current Bid</p>
            <p className="text-2xl font-bold text-[#D6A85F]">$1,250</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">Time Left</p>
            <p className="font-semibold text-gray-800">2h 15m</p>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white py-3 rounded-lg hover:from-[#C19A56] hover:to-[#D6A85F] transition-all duration-200 font-medium shadow-md hover:shadow-lg">
          Place Bid
        </button>
      </CardContent>
    </Card>
  );
};

export default ArtworkCard;
