import Head from 'next/head';
import Script from 'next/script';

import { Inter } from "next/font/google";
import { AuthProvider } from '@/utils/auth';
import { GlobalProvider } from '@/context/GlobalState';

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Roleplai",
  description: "Du contenu en live pour vos parties de Jeux de Rôle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <Head>

      </Head>
      <GlobalProvider>
        <AuthProvider>
          <body className={inter.className}>{children}</body>
        </AuthProvider>
      </GlobalProvider>
      <Script src="https://kit.fontawesome.com/64a6de1257.js" />
    </html>
  );
}


/**
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <AuthProvider>
        <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}

*/
