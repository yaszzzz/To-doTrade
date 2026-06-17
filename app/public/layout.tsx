import { PublicNav } from '@/components/public/public-nav';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}