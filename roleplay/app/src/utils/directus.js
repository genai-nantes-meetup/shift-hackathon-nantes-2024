import axios from 'axios';
import { createDirectus, authentication, rest, updateSingleton, registerUser, readItems, readMe, createItem, refresh, readItem, deleteItem, updateItems } from '@directus/sdk';

const API_URL = "https://data.rpg.coraye.com/";
let client = null
if (typeof window !== "undefined") {
  if (window.client) {
    client = window.client;
  }
}
if (!client) {
  client = createDirectus(API_URL).with(authentication()).with(rest());
  if (typeof window !== "undefined") {
    window.client = client;
  }
}

export const login = async (email, password) => {
  const response = await client.login(email, password);
  const user = await client.request(readMe({
		fields: ['*'],
	}));
  localStorage.setItem('user', JSON.stringify(user));
  return response;
};
export const register = (email, password) => client.request(registerUser(email, password));
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export const getWorlds = async () => {
  await client.setToken(localStorage.getItem('token'));
  const result = await client.request(
  	readItems('Worlds', {
  		fields: ['*', "*.games", "*.games.*"],
      filter: {
					user_created: {
						_eq: "$CURRENT_USER"
					}
				}
  	})
  );
  console.log("result", result);
  result.forEach(r => {
    if (!r.scenes) r.scenes = [];
    else if (typeof r.scenes === "string") {
      r.scenes = JSON.parse(r.scenes);
    }
  })
  return result;
};

export const getWorld = async id => {
  await client.setToken(localStorage.getItem('token'));
  const result = await client.request(
  	readItem('Worlds', id, {
  		fields: ['*', "*.games", "*.games.*"]
  	})
  );
  if (result.scenes) {
    result.scenes = JSON.parse(result.scenes || []);
  } else result.scenes = [];

  return result;
};

export const createWorld = async data => {
  await client.setToken(localStorage.getItem('token'));
  data.scenes = JSON.stringify(data.scenes);
  return client.request(createItem('Worlds', {
    status: "published",
    scenes: JSON.stringify([]),
    ...data
  }));
};

export const updateWorld = async data => {
  await client.setToken(localStorage.getItem('token'));
  console.log("data", data);

  const result = await client.request(updateItems('Worlds', [data.id], {
    name: data.name,
    background: data.background,
    style: data.style,
    image_style: data.image_style,
    scenes: typeof data.scenes === "string" ? data.scenes : JSON.stringify(data.scenes)
  }));
};

export const deleteWorld = async data => {
  return client.request(deleteItem('Worlds', data.id));
};
