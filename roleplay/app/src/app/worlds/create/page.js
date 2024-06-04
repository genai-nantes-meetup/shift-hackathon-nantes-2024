"use client";

import { useRouter } from 'next/navigation';

import FormCreateWorlds from "@/components/Forms/create-worlds";

export default function CreateWorld() {
  const router = useRouter()

  return (
    <FormCreateWorlds onClose={() => router.back()} onSave={data => router.push(`/worlds/${data.id}`)} />
  );
}
