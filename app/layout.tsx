import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3525cd",
};

export const metadata: Metadata = {
  title: "WorkSphere — High-Growth Tech Career Infrastructure",
  description:
    "Authoritative career infrastructure for high-growth tech talent, executives, and forward-thinking engineering organizations.",
  keywords: [
    "Tech Jobs",
    "Product Design",
    "Software Engineering",
    "Design Systems",
    "Staff Engineer",
    "High Comp Jobs",
    "Remote Tech Roles",
  ],
  authors: [{ name: "WorkSphere Technologies Inc." }],
  openGraph: {
    title: "WorkSphere — High-Growth Tech Career Infrastructure",
    description:
      "Find vetted roles in high-growth technology companies with verified compensation and direct hiring manager access.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
