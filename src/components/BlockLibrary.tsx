import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Database, FileText, GitMerge, BarChart2 } from 'lucide-react';

export interface BlockItem {
  id: string;
  name: string;
  description: string;
  category: 'input' | 'transform' | 'geo-data' | 'visualization' | 'misc';
  inputTypes: string[];
  outputTypes: string[];
  icon?: React.ReactNode;
}

export const blockItems: BlockItem[] = [
  {
    id: 'file',
    name: 'File',
    description: 'Import data from CSV, JSON, or GeoJSON files',
    category: 'input',
    inputTypes: [],
    outputTypes: ['Dataset', 'Geojson'],
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'filter',
    name: 'Filter',
    description: 'Filter rows based on conditions',
    category: 'transform',
    inputTypes: ['Dataset'],
    outputTypes: ['Dataset'],
    icon: <Database className="w-4 h-4" />,
  },
  {
    id: 'merge',
    name: 'Merge',
    description: 'Combine multiple datasets',
    category: 'transform',
    inputTypes: ['Dataset'],
    outputTypes: ['Dataset'],
    icon: <GitMerge className="w-4 h-4" />,
  },
  {
    id: 'barchart',
    name: 'Bar Chart',
    description: 'Create bar chart visualization',
    category: 'visualization',
    inputTypes: ['Dataset'],
    outputTypes: [],
    icon: <BarChart2 className="w-4 h-4" />,
  },
];

interface BlockLibraryProps {
  onAddBlock: (block: BlockItem) => void;
  onClose: () => void;
}

export default function BlockLibrary({ onAddBlock, onClose }: BlockLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBlocks = blockItems.filter((block) => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(blockItems.map((block) => block.category)));

  return (
    <Card className="w-[400px] bg-gray-900 border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100">Block Library</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            ×
          </button>
        </div>
        <Input
          placeholder="Search blocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 border-gray-700"
        />
      </div>
      <div className="flex">
        <div className="w-1/3 p-4 border-r border-gray-800">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Categories</h3>
          <div className="space-y-1">
            <button
              className={`w-full text-left px-2 py-1 rounded text-sm ${
                !selectedCategory
                  ? 'bg-gray-800 text-gray-100'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`w-full text-left px-2 py-1 rounded text-sm ${
                  selectedCategory === category
                    ? 'bg-gray-800 text-gray-100'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ScrollArea className="w-2/3 h-[400px]">
          <div className="p-4 space-y-2">
            {filteredBlocks.map((block) => (
              <button
                key={block.id}
                className="w-full text-left p-3 rounded bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-colors"
                onClick={() => onAddBlock(block)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {block.icon}
                  <span className="font-medium text-gray-100">{block.name}</span>
                </div>
                <p className="text-sm text-gray-400">{block.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {block.inputTypes.map((type) => (
                    <span
                      key={type}
                      className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-300"
                    >
                      in: {type}
                    </span>
                  ))}
                  {block.outputTypes.map((type) => (
                    <span
                      key={type}
                      className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-300"
                    >
                      out: {type}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
