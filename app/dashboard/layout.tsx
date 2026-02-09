'use client';

import { Home, Car, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-gray-300 border-t-black" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <aside className="fixed left-0 top-0 h-screen w-20 bg-white shadow-lg flex flex-col items-center py-6 gap-8 z-50">
        <div
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold cursor-pointer"
        >
          Z
        </div>

        <nav className="flex flex-col gap-6 text-gray-500">
          <Home
            className="hover:text-black cursor-pointer"
            onClick={() => router.push('/dashboard')}
          />
          <Car
            className="hover:text-black cursor-pointer"
            onClick={() => router.push('/dashboard/customizer')}
          />
        </nav>

        <div className="mt-auto pb-4">
          <LogOut
            onClick={handleLogout}
            className="text-gray-400 hover:text-black cursor-pointer"
          />
        </div>
      </aside>

      <main className="pl-20 min-h-screen p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
