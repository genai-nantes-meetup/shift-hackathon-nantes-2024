"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="relative isolate h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: `url(https://bnetcmsus-a.akamaihd.net/cms/blog_header/7KSXQ73L5XQG1655757206244.jpg)`
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <p className="text-base font-semibold leading-8 text-white">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page non trouvée</h1>
        <p className="mt-4 text-base text-white/70 sm:mt-6">Déso, mais on ne trouve pas la page en question.</p>
        <div className="mt-10 flex justify-center">
          <a href="#" className="text-sm font-semibold leading-7 text-white">
            <span aria-hidden="true">&larr;</span> Retour à l'accueil
          </a>
        </div>
      </div>
    </main>
  );
}
