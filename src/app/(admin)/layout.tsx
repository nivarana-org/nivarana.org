import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user?.role === "admin") {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    );
  } else {
    return <>You are not allowed to view this page.</>
  }
}
