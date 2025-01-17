import React, { useState } from 'react';
import { Input } from './ui/input';

interface CommandInputProps {
  onCommand: (command: string) => void;
}

function CommandInput({ onCommand }: CommandInputProps) {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onCommand(command.trim());
      setCommand('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="type 'help' to see the commands"
        className="w-full bg-gray-800 text-gray-100 border-gray-700"
      />
    </form>
  );
}

export default CommandInput;
