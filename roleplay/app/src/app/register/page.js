"use client";
import { useState } from 'react';
import { register } from '@/utils/directus';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de création de compte avec l'API Directus
    register(email, password)
      .then(() => {})
      .catch(console.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full p-2 border text-gray-900"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white disabled:opacity-20"
          disabled={!password || password !== confirmPassword}
        >
          Register
        </button>
      </form>
    </div>
  );
}
