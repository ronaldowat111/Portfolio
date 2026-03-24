import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav";

export const metadata: Metadata = {
  title: "Arya Sheva Satyatama",
  description: "My Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}