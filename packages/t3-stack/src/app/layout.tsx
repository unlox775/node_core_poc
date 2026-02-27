import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ben's Cranes",
  description: "Crane services",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
