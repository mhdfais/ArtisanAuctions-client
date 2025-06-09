import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import LoadingSpinner from "./components/common/LoadingSpinner.tsx";
import {Elements} from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js";

const stripePromise=loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
      </PersistGate>
    </Provider>
  </StrictMode>
);
