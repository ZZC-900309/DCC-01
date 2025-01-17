
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Layout } from 'lucide-react';

interface ToolbarProps {
  onAddNode: () => void;
  onLayout: () => void;
  onNodeTypeChange: (type: string) => void;
}

const nodeTypes = [
  { value: 'default', label: 'Default Block' },
  { value: 'input', label: 'Input Block' },
  { value: 'output', label: 'Output Block' },
  { value: 'process', label: 'Process Block' },
];

function Toolbar({ onAddNode, onLayout, onNodeTypeChange }: ToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-gray-800 p-2 rounded-lg shadow-lg">
      <Select defaultValue="default" onValueChange={onNodeTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Block Type" />
        </SelectTrigger>
        <SelectContent>
          {nodeTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button onClick={onAddNode} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Block
      </Button>
      
      <Button onClick={onLayout} variant="outline" className="flex items-center gap-2">
        <Layout className="w-4 h-4" />
        Auto Layout
      </Button>
    </div>
  );
}

export default Toolbar;
