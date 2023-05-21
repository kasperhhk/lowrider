"use client"
import { useState } from 'react';
import { ChatConnectionConfig } from './models';
import ConnectionSetup from './connection-setup';

export default function Chat() {
  
  let [connectionConfig, setConnectionConfig] = useState<ChatConnectionConfig>();

  return (
    <main>
      <h1>Chat!</h1>
      {!connectionConfig && <ConnectionSetup onOutput={setConnectionConfig} />}
      
    </main>
  );
}
