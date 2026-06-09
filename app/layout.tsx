import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abdifataah Abdi",
  description: "Software Engineer",
};

const visitFlagScript = `try { if (localStorage.getItem('portfolio_first_visit_v1')) document.documentElement.classList.add('returning'); } catch (e) {}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: visitFlagScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
