
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Node } from '@xyflow/react';
import { TurboNodeData } from './TurboNode';

interface NodeConfigProps {
  node: Node<TurboNodeData>;
  onUpdate: (nodeId: string, data: Partial<TurboNodeData>) => void;
}

function NodeConfig({ node, onUpdate }: NodeConfigProps) {
  return (
    <Card className="p-4 w-64">
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input 
            value={node.data.title} 
            onChange={(e) => onUpdate(node.id, { title: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Input 
            value={node.data.subline || ''} 
            onChange={(e) => onUpdate(node.id, { subline: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}

export default NodeConfig;
