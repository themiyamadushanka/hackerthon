import "./globals.css";

export const metadata = {
  title: "AidLink — AI for Humanity Response Coordinator",
  description: "Next.js and Flask duo application for crisis triage and relief coordination in 6-hour hackathons.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
