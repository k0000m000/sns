import { AppProps } from "next/app";
import Head from "next/head";

import { SessionProvider } from "../context/session";

interface SafeHydrateProps {
  children: React.ReactNode;
}

function SafeHydrate({ children }: SafeHydrateProps) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <SafeHydrate>
        <SessionProvider>
          <Component {...pageProps} />
        </SessionProvider>
      </SafeHydrate>
    </>
  );
};

export default App;
