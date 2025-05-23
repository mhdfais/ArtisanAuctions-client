import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/config/auth.axios";
import useToast from "@/hooks/useToast";
import { getUserDetails } from "@/services/userService";
import { useEffect, useState } from "react";

interface userDetail {
  name: string;
  email: string;
  bio: string;
  phone: string;
  profileImage: string;
  // bids:Array
}

export default function Profile() {
  const [user, setUser] = useState<userDetail | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      setUserDetailLoading(true);
      try {
        const userDetails = await getUserDetails();
        console.log(userDetails.data.user);
        setUser(userDetails.data.user);
      } catch (err) {
        setUserDetailLoading(false);
        error("Error", "Failed to fetch user details");
      } finally {
        setUserDetailLoading(false);
      }
    };

    fetchUser();
  }, []);
  // console.log(userDetailLoading?'Loading...':user?.name);
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
        My Profile
      </h1>

      <div className="mb-6">
        <Tabs defaultValue="profile" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-gray-100 p-0 h-12 w-full md:w-auto">
              <TabsTrigger
                value="profile"
                className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none h-12 px-4 md:px-6 flex-1 md:flex-none"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="seller-dashboard"
                className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none h-12 px-4 md:px-6 flex-1 md:flex-none"
              >
                Seller Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="bids"
                className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none h-12 px-4 md:px-6 flex-1 md:flex-none"
              >
                Bids
              </TabsTrigger>
              <TabsTrigger
                value="wallet"
                className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none h-12 px-4 md:px-6 flex-1 md:flex-none"
              >
                Wallet
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="seller-dashboard">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Manage your listings and track your sales performance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium mb-1">
                        Active Listings
                      </h3>
                      <p className="text-3xl font-bold">5</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium mb-1">Total Sales</h3>
                      <p className="text-3xl font-bold">$12,450</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium mb-1">
                        Avg. Sale Price
                      </h3>
                      <p className="text-3xl font-bold">$1,037</p>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-xl font-medium mb-3">Your Listings</h3>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Sunset Dreams</h3>
                        <p className="text-sm text-gray-600">
                          Listed on May 15, 2025
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Starting price: $950
                      </span>
                      <span className="text-sm text-gray-600">
                        Current bid: $1,200
                      </span>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">City Lights</h3>
                        <p className="text-sm text-gray-600">
                          Listed on May 10, 2025
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Starting price: $1,200
                      </span>
                      <span className="text-sm text-gray-600">
                        Current bid: $1,450
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                <p className="text-gray-600 mb-6">
                  Update your personal information and preferences.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      defaultValue={userDetailLoading?'Loading...':user?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={4}
                      defaultValue={userDetailLoading?'Loading...':user?.bio}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-md"
                      defaultValue={userDetailLoading?'Loading...':user?.email}
                      disabled
                    />
                  </div>
                  <div className="pt-4">
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
                      Save Changes
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bids">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Bids</h2>
                <p className="text-gray-600 mb-6">
                  Track your active and past bids on auctions.
                </p>

                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Abstract Harmony</h3>
                        <p className="text-sm text-gray-600">by Artist Name</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Your bid: $1,200
                      </span>
                      <span className="text-sm text-gray-600">
                        Current highest: $1,350
                      </span>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Urban Landscape</h3>
                        <p className="text-sm text-gray-600">by Artist Name</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Outbid
                      </Badge>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Your bid: $850
                      </span>
                      <span className="text-sm text-gray-600">
                        Winning bid: $920
                      </span>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Mountain Serenity</h3>
                        <p className="text-sm text-gray-600">by Artist Name</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        Won
                      </Badge>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Your bid: $1,500
                      </span>
                      <span className="text-sm text-gray-600">
                        Winning bid: $1,500
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
                <p className="text-gray-600 mb-6">
                  Manage your payment methods and transaction history.
                </p>

                <div className="bg-gray-50 border rounded-md p-4 mb-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-medium">Available Balance</h3>
                      <p className="text-3xl font-bold mt-1">$3,250.00</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
                        Deposit
                      </button>
                      <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-medium mb-3">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">Payment for "Sunset Dreams"</p>
                      <p className="text-sm text-gray-600">May 18, 2025</p>
                    </div>
                    <span className="text-red-600 font-medium">-$1,200.00</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">Sale of "Ocean Waves"</p>
                      <p className="text-sm text-gray-600">May 12, 2025</p>
                    </div>
                    <span className="text-green-600 font-medium">
                      +$2,450.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">Deposit</p>
                      <p className="text-sm text-gray-600">May 5, 2025</p>
                    </div>
                    <span className="text-green-600 font-medium">
                      +$2,000.00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
