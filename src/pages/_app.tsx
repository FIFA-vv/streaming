import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SubscriptionProvider>
      <Component {...pageProps} />
    </SubscriptionProvider>
  );
}
