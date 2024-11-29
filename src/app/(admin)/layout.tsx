import "./globals.css";
import { auth } from "@/auth";
import Header from "@/components/admin/Header";
import '@fontsource/inter';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <Header email={session?.user.email} picture={session?.user.picture}/>
        <hr/>
        {children}
      </body>
    </html>
  );
}
