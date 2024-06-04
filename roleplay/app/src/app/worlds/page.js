"use client";

import { useEffect, useState } from 'react';
import { ProtectRoute } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { getWorlds, deleteWorld } from '@/utils/directus';
import { useGlobalState, useGlobalDispatch } from '@/context/GlobalState';

import FormCreateWorlds from "@/components/Forms/create-worlds";

export default function Worlds() {
  const router = useRouter();
  const dispatch = useGlobalDispatch();
  const { currentWorld } = useGlobalState();

  useEffect(() => {
    if (currentWorld) router.push(`/worlds/${currentWorld.id}`);
  }, [currentWorld]);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune aventure</h3>
      <p className="mt-1 text-sm text-gray-500">Démarrez en créant votre première aventure.</p>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => router.push("/worlds/create")}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <i className="fas fa-plus mr-2" />
          Créer mon aventure
        </button>
      </div>
    </div>
  );
}
