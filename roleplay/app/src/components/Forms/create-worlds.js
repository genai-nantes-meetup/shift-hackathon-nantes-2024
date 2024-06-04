"use client";
import { useState } from 'react';
import { createWorld } from '@/utils/directus';
import { useRouter } from 'next/navigation';
import { useGlobalDispatch } from '@/context/GlobalState';

import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Divider } from '@/components/divider'
import { Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import DeleteModal from "@/components/Modal/delete-world";

export default function FormCreateWorlds({ onClose, world, ready, onSave }) {
  const router = useRouter();
  const dispatch = useGlobalDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');
  const [imageType, setImageType] = useState('');
  const [background, setBackground] = useState('');

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    createWorld({ name, background, style, image_type: imageType })
      .then(world => {
        setLoading(false);
        if (onSave) {
          dispatch({ type: 'SET_CURRENT_WORLD', payload: world });
          onSave(world);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const label = ready ? "Mettre à jour" : "Créer";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      <Heading>Aventure</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Nom de l'aventure</Subheading>
          <Text>Choisi un nom qui te permette de bien identifier cette aventure parmis les autres</Text>
        </div>
        <div>
          <Input
            aria-label="World Name"
            name="name"
            placeholder="Catalyst"
            defaultValue={world?.name || ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Univers</Subheading>
          <Text>C'est le thème de votre aventure. Sur quoi partez-vous? Steampunk ? Médiéval fantastique ?</Text>
        </div>
        <div>
          <Input
            aria-label="World style"
            name="name"
            placeholder="Médiéval fantastique"
            defaultValue={world?.style || ""}
            onChange={(e) => setStyle(e.target.value)}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Direction artistique</Subheading>
          <Text>Quel doit être le rendu des images rendues ? Sommes nous sur des photographies réalistes ou des peintures style Van Gogh ?</Text>
        </div>
        <div>
          <Input
            aria-label="World Name"
            name="name"
            placeholder="Illustration digital painting"
            defaultValue={world?.image_type || ""}
            onChange={(e) => setImageType(e.target.value)}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Éléments à prendre en compte</Subheading>
          <Text>Histoire et informations de contextes permettant d'améliorer la pertinence des générations. Maximum 20 000 mots.</Text>
        </div>
        <div>
          <Textarea
            aria-label="World background"
            name="description"
            placeholder="Cette aventure se situe dans un monde médiéval fantastique avec de ..."
            defaultValue={world?.background || ""}
            limit={20000}
            onChange={(e) => setBackground(e.target.value)}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        {ready ? (
          <DeleteModal world={world} />
        ) : (
          <Button type="reset" plain onClick={onClose}>
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="flex-row gap-2"
        >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : label}
        </Button>
        {ready && (
          <Button
            className="flex-row gap-2"
            onClick={() => router.push(`/worlds/${world.id}/live`)}
          >
          Démarrer la session
          <i className="fas fa-play" />
          </Button>
        )}
      </div>
    </form>
  )
}
