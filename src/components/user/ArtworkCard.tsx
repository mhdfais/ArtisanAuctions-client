import React from 'react';
import { Link } from 'react-router-dom';

interface ArtworkCardProps {
  id: string;
  imageUrl: string;
  title: string;
  artist: string;
  currentBid: string;
  timeRemaining: string;
}

const ArtworkCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transform transition duration-400">
      <Link to={'/'}>
        <div className="h-48 sm:h-56 md:h-64 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1945&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=''
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-3 sm:p-4 md:p-6">
        <Link to={'/'}>
          <h3 className="font-serif text-xl sm:text-2xl font-medium mb-1 hover:text-[#D6A85F] transition-colors line-clamp-1">Ethereal Dreams</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 md:mb-4">by Eliza</p>
        
        <div className="flex justify-between mb-3 md:mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Current Bid</p>
            <p className="text-sm sm:font-medium">{}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Ends In</p>
            <p className="text-sm sm:font-medium">{}</p>
          </div>
        </div>
        
        <Link 
          to={'/'} 
          className="block text-center text-sm sm:text-base bg-[#EAD7D1] text-[#2E2E2E] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-[#D6A85F] hover:text-white transition-all duration-200"
        >
          Place Bid
        </Link>
      </div>
    </div>
  );
};

export default ArtworkCard;