// WalletTab.tsx
import React, { useState, useEffect } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { confirmDeposit, getWallet, initiatePaymentIntent } from "@/services/userService";
import useToast from "@/hooks/useToast";
import PaymentForm from "./StripePaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface IWallet {
  _id: string;
  balance: number;
}

const WalletTab = () => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const { error, info, success } = useToast();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await getWallet();
        setWallet(res.data.walletData);
      } catch (err) {
        error("Error", "Failed to load wallet");
      }
    };
    fetchWallet();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) < 100) {
      info("Note", "Minimum deposit is ₹100");
      return;
    }

    setDepositLoading(true);
    try {
      const res = await initiatePaymentIntent(depositAmount);
      setClientSecret(res.data.clientSecret);
      setTransactionId(res.data.transactionId);
    } catch (err:any) {
      const errorMessage = err.response?.data?.message || "Failed to initiate deposit";
      error("Error", errorMessage);
    } finally {
      setDepositLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    console.log("handlePaymentSuccess called, clearing state");
    setClientSecret("");
    setDepositAmount("");
    setTransactionId("");
    try {
      const res = await getWallet();
      setWallet(res.data.walletData);
      success("Deposit successful!");
    } catch (err) {
      error("Error", "Failed to refresh wallet");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <TabsContent value="wallet">
      <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
              Your Wallet
            </h2>
            <p className="text-gray-600 text-lg">
              Manage your payment methods and transaction history.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#D6A85F]/10 to-[#E8B866]/10 border-2 border-[#D6A85F]/30 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-gray-700 mb-2">
                  Available Balance
                </h3>
                <p className="text-4xl font-bold text-[#D6A85F] font-serif">
                  {wallet ? formatCurrency(wallet.balance) : "₹0.00"}
                </p>
              </div>
              <div className="flex gap-3">
                {!clientSecret && (
                  <form onSubmit={handleDeposit} className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Enter amount (₹)"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-32"
                    />
                    <Button
                      type="submit"
                      disabled={depositLoading}
                      className="bg-white border-2 border-[#D6A85F] text-[#D6A85F] font-medium px-6 py-3 rounded-lg hover:bg-[#D6A85F]/10"
                    >
                      {depositLoading ? "Loading..." : "Deposit"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
            {clientSecret && (
              <div className="mt-6 p-6 bg-white/50 rounded-lg shadow-inner transition-opacity duration-200 opacity-100">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {/* Add transaction rendering logic here */}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default WalletTab;