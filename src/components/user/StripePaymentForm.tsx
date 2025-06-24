import { confirmDeposit } from "@/services/userService";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import useToast from "@/hooks/useToast";

const PaymentForm = ({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { error } = useToast();

  useEffect(() => {
    setPaymentCompleted(false); // Reset when clientSecret changes
  }, [clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || paymentCompleted) {
      error("Error", "Stripe not initialized or payment already completed.");
      return;
    }

    const paymentElement = elements.getElement(PaymentElement);
    if (!paymentElement) {
      error("Error", "Payment element not mounted.");
      return;
    }

    setLoading(true);
    try {
      // console.log("Submitting PaymentElement with clientSecret:", clientSecret);
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Submit Error:", submitError);
        throw new Error(submitError.message || "Failed to submit payment details");
      }

      // console.log("Confirming payment with Stripe...");
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: `${window.location.origin}/profile` },
        redirect: "if_required",
      });

      if (confirmError) {
        // console.error("Confirm Payment Error:", confirmError);
        if (confirmError.code === "payment_intent_unexpected_state") {
          error("Error", "This payment has already been completed. Please start a new deposit.");
          return;
        }
        throw new Error(confirmError.message || "Payment confirmation failed");
      }

      if (paymentIntent.status === "succeeded") {
        // console.log("Payment succeeded, confirming deposit:", paymentIntent.id);
        setPaymentCompleted(true);
        await confirmDeposit(paymentIntent.id);
        // success("Deposit successful!");
        onSuccess();
      }
    } catch (err) {
      // console.error("Payment Error:",err);
      error("Error", (err as Error).message || "A processing error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button disabled={loading || !stripe || !elements || paymentCompleted}>
        {loading ? "Processing..." : paymentCompleted ? "Payment Completed" : "Pay Now"}
      </Button>
    </form>
  );
};

export default PaymentForm