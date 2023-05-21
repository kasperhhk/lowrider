"use client"
import { FormEvent } from 'react';
import { ChatConnectionConfig } from './models';

export interface ConnectionSetupProps {
  onOutput: (config: ChatConnectionConfig) => void
}


export default function ConnectionSetup({ onOutput }: ConnectionSetupProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = e.target;
    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" required />
      <input type="text" name="ip" required />
      <input type="text" name="port" required />
    </form>
  );
}
