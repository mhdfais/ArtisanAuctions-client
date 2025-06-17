import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BidTab from "@/components/user/BidTab";
import ProfileTab from "@/components/user/ProfileTab";
import SellerTab from "@/components/user/SellerTab";
import WalletTab from "@/components/user/WalletTab";
import WonAuctionsTab from "@/components/user/WonAuctions";
import useToast from "@/hooks/useToast";
import { getUserDetails } from "@/services/userService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface userDetail {
  name: string;
  email: string;
  bio: string;
  phone: string;
  profileImage: string;
  isSeller:boolean
  // bids:Array
}

export default function Profile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<userDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("seller") === "1") setActiveTab("seller-dashboard");
  }, [location.search]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails.data.user);
        // console.log(userDetails)
        // console.log(user)
      } catch (err) {
        error("Error", "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-3xl font-bold text-gray-800 mb-2">
            My Profile
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D6A85F] to-[#B8956A] rounded-full"></div>
        </div>

        <div className="mb-8">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-8">
              <TabsList className="bg-white shadow-lg border border-[#D6A85F]/20 p-1 h-14 w-full md:w-auto rounded-xl">
                <TabsTrigger
                  value="profile"
                  className="text-gray-600 font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D6A85F] data-[state=active]:to-[#E8B866] data-[state=active]:text-white data-[state=active]:shadow-md h-12 px-6 flex-1 md:flex-none transition-all duration-200"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="seller-dashboard"
                  className="text-gray-600 font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D6A85F] data-[state=active]:to-[#E8B866] data-[state=active]:text-white data-[state=active]:shadow-md h-12 px-6 flex-1 md:flex-none transition-all duration-200"
                >
                  Seller Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="bids"
                  className="text-gray-600 font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D6A85F] data-[state=active]:to-[#E8B866] data-[state=active]:text-white data-[state=active]:shadow-md h-12 px-6 flex-1 md:flex-none transition-all duration-200"
                >
                  Bids
                </TabsTrigger>
                <TabsTrigger
                  value="wallet"
                  className="text-gray-600 font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D6A85F] data-[state=active]:to-[#E8B866] data-[state=active]:text-white data-[state=active]:shadow-md h-12 px-6 flex-1 md:flex-none transition-all duration-200"
                >
                  Wallet
                </TabsTrigger>
                <TabsTrigger
                  value="won-auctions"
                  className="text-gray-600 font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D6A85F] data-[state=active]:to-[#E8B866] data-[state=active]:text-white data-[state=active]:shadow-md h-12 px-6 flex-1 md:flex-none transition-all duration-200"
                >
                  Won Auctions
                </TabsTrigger>
              </TabsList>
            </div>

            <ProfileTab user={user} setUser={setUser} />

            <SellerTab user={user} />

            <BidTab />

            <WalletTab />

            <WonAuctionsTab />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
