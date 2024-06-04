"use client";
import { useState } from 'react';

export default function WorldsGamesLive() {
  const [players, setPlayers] = useState([]);
  const [conditions, setConditions] = useState("Jour");
  const [place, setPlace] = useState("Tour du mage fou");
  const [image, setImage] = useState('https://assetsio.gnwcdn.com/pathfinder-2e-rpg-artwork.jpg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER */}
      <div className="p-4 flex justify-between">
        <button>
          Options
        </button>
        <ul className="flex flex-row gap-2">
          {players.map(player => (
            <li className="h-10 w-10 rounded-full">{player.name}</li>
          ))}
        </ul>
      </div>
      {/* CONTENT */}
      <div className="p-4 flex flex-col">
        <div className="flex flex-col gap-5 items-center">
          <div className="p-3 rounded-lg">
            {conditions}
          </div>
          <h1 className="text-2xl">{place}</h1>
          {image && (
            <div className="relative" style={{ padding: "2px" }}>
              <img className="rounded-md opacity-0" src={image} />
              <div className="rounded-lg bg-cover block absolute" style={{
                backgroundImage: `url(${image})`,
                opacity: "0.2",
                top: "-4px",
                left: "-4px",
                height: "calc(100% + 4px)",
                width: "calc(100% + 4px)"
              }} />
              <div className="top-0 left-0 rounded-lg h-full w-full bg-cover block absolute" style={{
                backgroundImage: `url(${image})`,
                margin: "2px"
              }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
