import "@/styles/globals.css";
// import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from "react";
import Head from 'next/head';
import {NextUIProvider} from "@nextui-org/react";

export default function App({ Component, pageProps }) {
  // useEffect(() => {
  //   require("bootstrap/dist/js/bootstrap.bundle.min.js");
  // }, []);
  return (
    <>
    <NextUIProvider>
          <Head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
  <Component {...pageProps} />
  </NextUIProvider>
  </>
  )
}
