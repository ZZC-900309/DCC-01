
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Node } from '@xyflow/react';
import { TurboNodeData } from './TurboNode';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { HelpCircle } from 'lucide-react';

interface NodeConfigProps {
  node: Node<TurboNodeData>;
  onUpdate: (nodeId: string, data: Partial<TurboNodeData>) => void;
}

function NodeConfig({ node, onUpdate }: NodeConfigProps) {
  const renderSpecializedFields = () => {
    const config = node.data.config || {};
    
    switch (node.data.title.toLowerCase()) {
      case 'filter':
        return (
          <div>
            <div className="flex items-center gap-2">
              <Label>Filter Columns</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Specify columns to filter the dataset. Multiple columns can be comma-separated.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              value={config.filterColumns?.join(', ') || ''} 
              onChange={(e) => onUpdate(node.id, { 
                config: { 
                  ...config,
                  filterColumns: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                } 
              })}
              placeholder="column1, column2, ..."
            />
          </div>
        );
      
      case 'merge':
        return (
          <div>
            <div className="flex items-center gap-2">
              <Label>Merge Keys</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Specify keys to join datasets. These should be column names that exist in both datasets.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              value={config.mergeKeys?.join(', ') || ''} 
              onChange={(e) => onUpdate(node.id, { 
                config: { 
                  ...config,
                  mergeKeys: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                } 
              })}
              placeholder="key1, key2, ..."
            />
          </div>
        );
      
      case 'bar chart':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Label>X Axis</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the column to use for the X-axis of the chart.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                value={config.chartOptions?.xAxis || ''} 
                onChange={(e) => onUpdate(node.id, { 
                  config: { 
                    ...config,
                    chartOptions: { 
                      ...config.chartOptions,
                      xAxis: e.target.value 
                    } 
                  } 
                })}
                placeholder="Column name for X axis"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label>Y Axis</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the column to use for the Y-axis values. This should be a numeric column.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                value={config.chartOptions?.yAxis || ''} 
                onChange={(e) => onUpdate(node.id, { 
                  config: { 
                    ...config,
                    chartOptions: { 
                      ...config.chartOptions,
                      yAxis: e.target.value 
                    } 
                  } 
                })}
                placeholder="Column name for Y axis"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label>Group By</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Optional: Select a column to group the data by. This will create separate bars for each group.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                value={config.chartOptions?.groupBy || ''} 
                onChange={(e) => onUpdate(node.id, { 
                  config: { 
                    ...config,
                    chartOptions: { 
                      ...config.chartOptions,
                      groupBy: e.target.value 
                    } 
                  } 
                })}
                placeholder="Optional grouping column"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
        {renderSpecializedFields()}
      </div>
    </Card>
  );
}

export default NodeConfig;
