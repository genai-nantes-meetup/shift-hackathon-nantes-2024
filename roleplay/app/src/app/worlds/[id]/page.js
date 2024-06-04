"use client";

import { useState ,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getWorld } from '@/utils/directus';
import { useGlobalState, useGlobalDispatch } from '@/context/GlobalState';

import FormCreateWorlds from "@/components/Forms/create-worlds";

export default function EditWorld({ params }) {
  const router = useRouter()
  const dispatch = useGlobalDispatch();
  const { currentWorld } = useGlobalState();

  const fetchWorld = async () => {
    const data = await getWorld(params.id);
    dispatch({ type: 'SET_CURRENT_WORLD', payload: data });
  };

  useEffect(() => {
    fetchWorld();
  }, [params]);

  return (
    <FormCreateWorlds world={currentWorld} ready />
  );
}
