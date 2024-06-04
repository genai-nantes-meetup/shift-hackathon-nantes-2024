"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/directus';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    logout();
    router.replace('/login');
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Déconnexion...</div>;
}
