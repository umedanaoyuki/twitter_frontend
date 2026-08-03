import "../home.css";

export default function BookmarksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh w-full flex-1 overflow-x-hidden bg-black">
      {children}
    </div>
  );
}
