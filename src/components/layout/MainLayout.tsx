import Sidebar from './Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-23">
      <Sidebar />
      <main className="ml-60 min-h-[calc(100vh-92px)] max-md:ml-0 max-[1050px]:ml-50">
        {children}
      </main>
    </div>
  );
}
