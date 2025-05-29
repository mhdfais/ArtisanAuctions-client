import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileTab from "@/components/user/ProfileTab";
import SellerTab from "@/components/user/SellerTab";
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
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-2">
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
              </TabsList>
            </div>

            <ProfileTab user={user} setUser={setUser} />

            <SellerTab user={user} />

            <TabsContent value="bids">
              <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Your Bids</h2>
                    <p className="text-gray-600 text-lg">
                      Track your active and past bids on auctions.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-gray-800">Abstract Harmony</h3>
                          <p className="text-gray-600">by Artist Name</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2 text-sm font-medium hover:bg-emerald-100">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                          Your bid: <span className="text-[#D6A85F] font-bold">$1,200</span>
                        </span>
                        <span className="text-gray-600 font-medium">
                          Current highest: <span className="text-red-600 font-bold">$1,350</span>
                        </span>
                      </div>
                    </div>

                    <div className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-gray-800">Urban Landscape</h3>
                          <p className="text-gray-600">by Artist Name</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-4 py-2 text-sm font-medium hover:bg-orange-100">
                          Outbid
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                          Your bid: <span className="text-[#D6A85F] font-bold">$850</span>
                        </span>
                        <span className="text-gray-600 font-medium">
                          Winning bid: <span className="text-green-600 font-bold">$920</span>
                        </span>
                      </div>
                    </div>

                    <div className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-gray-800">Mountain Serenity</h3>
                          <p className="text-gray-600">by Artist Name</p>
                        </div>
                        <Badge className="bg-[#D6A85F]/20 text-[#D6A85F] border-[#D6A85F]/40 px-4 py-2 text-sm font-medium hover:bg-[#D6A85F]/20">
                          Won
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                          Your bid: <span className="text-[#D6A85F] font-bold">$1,500</span>
                        </span>
                        <span className="text-gray-600 font-medium">
                          Winning bid: <span className="text-[#D6A85F] font-bold">$1,500</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Your Wallet</h2>
                    <p className="text-gray-600 text-lg">
                      Manage your payment methods and transaction history.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-[#D6A85F]/10 to-[#E8B866]/10 border-2 border-[#D6A85F]/30 rounded-xl p-6 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-gray-700 mb-2">Available Balance</h3>
                        <p className="text-4xl font-bold text-[#D6A85F] font-serif">$3,250.00</p>
                      </div>
                      <div className="flex gap-3">
                        <button className="bg-white border-2 border-[#D6A85F] text-[#D6A85F] font-medium px-6 py-3 rounded-lg hover:bg-[#D6A85F]/10 transition-all duration-200 shadow-md">
                          Deposit
                        </button>
                        <button className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-medium px-6 py-3 rounded-lg hover:from-[#C19A56] hover:to-[#D6A85F] transition-all duration-200 shadow-md">
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Recent Transactions</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#D6A85F]/20 pb-4 hover:bg-amber-50/50 px-4 py-2 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-gray-800">Payment for "Sunset Dreams"</p>
                        <p className="text-sm text-gray-600">May 18, 2025</p>
                      </div>
                      <span className="text-red-600 font-bold text-lg">-$1,200.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D6A85F]/20 pb-4 hover:bg-amber-50/50 px-4 py-2 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-gray-800">Sale of "Ocean Waves"</p>
                        <p className="text-sm text-gray-600">May 12, 2025</p>
                      </div>
                      <span className="text-green-600 font-bold text-lg">+$2,450.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D6A85F]/20 pb-4 hover:bg-amber-50/50 px-4 py-2 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-gray-800">Deposit</p>
                        <p className="text-sm text-gray-600">May 5, 2025</p>
                      </div>
                      <span className="text-green-600 font-bold text-lg">+$2,000.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}