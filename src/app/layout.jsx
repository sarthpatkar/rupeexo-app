import "./globals.css";

export const metadata = {
  title: "Rupeexo",
  description: "Clarity Over Noise — Finance Without the Hype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}