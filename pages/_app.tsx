import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import Header from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

import "@/styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";

interface Props extends AppProps {
  session: Session | null;
}

export default function App({ Component, pageProps, session }: Props) {
  return (
    <div className={inter.className}>
      <SessionProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </div>
  );
}
