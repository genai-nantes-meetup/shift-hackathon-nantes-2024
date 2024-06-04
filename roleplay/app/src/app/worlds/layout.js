"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalState, useGlobalDispatch } from '@/context/GlobalState';

import { Avatar } from '@/components/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar';
import { SidebarLayout } from '@/components/sidebar-layout';

import { getWorlds } from '@/utils/directus';

function AccountDropdownMenu({ anchor }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <i className="fas fa-shield-halved" />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <i className="fas fa-comment-dots" />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <i className="fas fa-right-from-bracket mr-2" />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export default function ApplicationLayout({ events, children, navbar }) {
  let pathname = usePathname();
  const router = useRouter();
  const dispatch = useGlobalDispatch();

  const { currentWorld, currentScene } = useGlobalState();
  const [worlds, setWorlds] = useState([]);

  const fetchWorlds = async () => {
    const data = await getWorlds();
    if (data.length) {
      dispatch({ type: 'SET_CURRENT_WORLD', payload: data[0] });
    }
    setWorlds(data);
  };

  const handleSceneClick = (scene) => {
    // dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
    dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
  };

  useEffect(() => {
    // Check if the user is authenticated
    // const user = JSON.parse(localStorage.getItem('user') || "");
    // if (!user) {
    //   router.push('/login');
    //   return;
    // }

    if (!currentWorld) fetchWorlds();
  }, [currentWorld]);

  return (
    <SidebarLayout
      navbar={[]}
      sidebar={
        <Sidebar>
          {currentWorld && (
            <SidebarHeader>
              <Dropdown>
                <DropdownButton as={SidebarItem}>
                  <SidebarLabel>{currentWorld.name}</SidebarLabel>
                  <i className="fas fa-chevron-down" />
                </DropdownButton>
                <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                  {worlds.map(world => (
                    <DropdownItem href={`/worlds/${world.id}`} key={`world-dropdow-${world.id}`}>
                      <DropdownLabel>{world.name}</DropdownLabel>
                    </DropdownItem>
                  ))}
                  <DropdownDivider />
                  <DropdownItem href="/worlds/create">
                    <i className="fas fa-plus mr-2" />
                    <DropdownLabel>Créer une nouvelle aventure</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </SidebarHeader>
          )}

          <SidebarBody>
            <SidebarSection>
              {(currentWorld?.scenes || []).slice().reverse().map(scene => (
                <SidebarItem
                  key={scene.index}
                  current={currentScene && scene.index === currentScene.index}
                  onClick={() => handleSceneClick(scene)}
                >
                  {scene.loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-1 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <i className="fas fa-image" />
                  )}
                  <SidebarLabel>{scene.name}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              {/*
                <SidebarItem href="#">
                  <i className="fas fa-shield-halved" />
                  <SidebarLabel>Politique de confidentialité</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#">
                  <i className="fas fa-comment-dots" />
                  <SidebarLabel>Donner son avis</SidebarLabel>
                </SidebarItem>
              */}
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <SidebarItem href="/logout">
              <i className="fas fa-right-from-bracket" />
              <SidebarLabel>Déconnexion</SidebarLabel>
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
