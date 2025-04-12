import MainLayout from "@/layouts/mainLayout";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <MainLayout>
          <Main />
          <NextScript />
        </MainLayout>
      </body>
    </Html>
  );
}
