import { useCallback, useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  MiniMap,
  Panel,
} from '@xyflow/react';
import CommandInput from './components/CommandInput';
import OutputPanel from './components/OutputPanel';
import '@xyflow/react/dist/style.css';
import { Settings, Database, ArrowDownToLine, ArrowUpFromLine, Cpu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import NodeConfig from './components/NodeConfig';
import ErrorBoundary from './components/ErrorBoundary';
import TurboNode, { TurboNodeData } from './components/TurboNode';
import TurboEdge from './components/TurboEdge';
import Toolbar from './components/Toolbar';
import BlockLibrary, { BlockItem } from './components/BlockLibrary';

const initialNodes: Node<TurboNodeData>[] = [];
const initialEdges: Edge[] = [];

const nodeTypes = {
  turbo: TurboNode,
};

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState('default');
  const [selectedNode, setSelectedNode] = useState<Node<TurboNodeData> | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<Node<TurboNodeData> | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([
    'This is just a demo! To use all features login or create an account.',
    'Available keyboard shortcuts:',
    'Ctrl/Cmd + = or +: Zoom in',
    'Ctrl/Cmd + -: Zoom out',
    'Ctrl/Cmd + 0: Reset zoom',
    'Ctrl/Cmd + F: Fit view',
    'Delete/Backspace: Delete selected node',
  ]);
  const reactFlowInstance = useReactFlow();
  const screenToFlowPosition = reactFlowInstance.screenToFlowPosition;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length > 0) {
          setNodeToDelete(selectedNodes[0]);
        }
      } else if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '=':
          case '+':
            reactFlowInstance.zoomIn();
            break;
          case '-':
            reactFlowInstance.zoomOut();
            break;
          case '0':
            reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
            break;
          case 'f':
            reactFlowInstance.fitView();
            break;
        }
      }
    },
    [nodes, reactFlowInstance]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) {
        setLogs(prev => [...prev, 'Error: Invalid connection - nodes not found']);
        return;
      }

      if (sourceNode.id === targetNode.id) {
        setLogs(prev => [...prev, 'Error: Cannot connect a node to itself']);
        return;
      }

      // Check node type restrictions
      if (sourceNode.data.title.toLowerCase().includes('output')) {
        setLogs(prev => [...prev, 'Error: Output nodes cannot have outgoing connections']);
        return;
      }

      if (targetNode.data.title.toLowerCase().includes('input')) {
        setLogs(prev => [...prev, 'Error: Input nodes cannot have incoming connections']);
        return;
      }

      // Check if connection already exists
      const connectionExists = edges.some(
        edge => edge.source === params.source && edge.target === params.target
      );

      if (connectionExists) {
        setLogs(prev => [...prev, 'Error: Connection already exists']);
        return;
      }

      setEdges((eds) => addEdge(params, eds));
      setLogs(prev => [...prev, `Connected ${sourceNode.data.title} to ${targetNode.data.title}`]);
    },
    [setEdges, nodes, edges, setLogs]
  );

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'input':
        return <ArrowDownToLine className="w-4 h-4" />;
      case 'output':
        return <ArrowUpFromLine className="w-4 h-4" />;
      case 'process':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const addNewNode = useCallback((block?: BlockItem) => {
    const position = screenToFlowPosition({ x: 100, y: 100 });
    const newNode: Node<TurboNodeData> = {
      id: `node-${nodes.length + 1}`,
      type: 'turbo',
      position,
      data: block ? {
        title: block.name,
        subline: block.description,
        icon: getNodeIcon(block.category),
        inputTypes: block.inputTypes,
        outputTypes: block.outputTypes,
      } : {
        title: selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1),
        subline: `Block ${nodes.length + 1}`,
        icon: getNodeIcon(selectedNodeType),
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowBlockLibrary(false);
  }, [nodes.length, setNodes, selectedNodeType, screenToFlowPosition]);

  const onLayout = useCallback(() => {
    const layoutedNodes = nodes.map((node, index) => ({
      ...node,
      position: {
        x: 100 + (index % 3) * 200,
        y: 100 + Math.floor(index / 3) * 150,
      },
    }));
    setNodes(layoutedNodes);
  }, [nodes, setNodes]);

  return (
    <ErrorBoundary>
      <div className="w-screen h-screen bg-gray-900">
        <Toolbar 
          onAddNode={() => setShowBlockLibrary(true)}
          onLayout={onLayout}
          onNodeTypeChange={setSelectedNodeType}
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          deleteKeyCode="Delete"
          proOptions={{ hideAttribution: true }}
        >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeColor="#6b7280"
          maskColor="rgb(17, 24, 39, 0.5)"
          className="bg-gray-800 rounded-lg"
        />
        <Panel position="top-center" className="flex gap-2">
          {nodes.map((node) => (
            <Card key={node.id} className="p-2 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedNode(node)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </Panel>
        {selectedNode && (
          <div className="absolute right-4 top-4 z-50">
            <NodeConfig 
              node={selectedNode} 
              onUpdate={(nodeId, data) => {
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === nodeId
                      ? { ...node, data: { ...node.data, ...data } }
                      : node
                  )
                );
              }}
            />
          </div>
        )}
        <svg>
          <defs>
            <linearGradient id="edge-gradient">
              <stop offset="0%" stopColor="#ae53ba" />
              <stop offset="100%" stopColor="#2a8af6" />
            </linearGradient>
            <marker
              id="edge-circle"
              viewBox="-5 -5 10 10"
              refX="0"
              refY="0"
              markerUnits="strokeWidth"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <circle r="2" cx="0" cy="0" fill="url(#edge-gradient)" />
            </marker>
          </defs>
        </svg>
        </ReactFlow>
        <AlertDialog open={!!nodeToDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Node</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this node? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setNodeToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (nodeToDelete) {
                  setNodes((nds) => nds.filter((n) => n.id !== nodeToDelete.id));
                  setNodeToDelete(null);
                }
              }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog open={showBlockLibrary} onOpenChange={setShowBlockLibrary}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Block</DialogTitle>
            </DialogHeader>
            <BlockLibrary onAddBlock={addNewNode} onClose={() => setShowBlockLibrary(false)} />
          </DialogContent>
        </Dialog>
        <OutputPanel output={output} logs={logs} />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900">
          <CommandInput onCommand={(cmd: string) => {
            if (cmd === 'help') {
              setLogs(prev => [...prev, 'Available commands: help, clear, add, remove, layout']);
            } else if (cmd === 'clear') {
              setOutput([]);
              setLogs(['Cleared output and logs']);
            } else if (cmd === 'add') {
              addNewNode();
              setLogs(prev => [...prev, 'Added new node']);
            } else if (cmd === 'remove' && selectedNode) {
              setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
              setSelectedNode(null);
              setLogs(prev => [...prev, 'Removed selected node']);
            } else if (cmd === 'layout') {
              onLayout();
              setLogs(prev => [...prev, 'Applied auto-layout']);
            } else {
              setOutput(prev => [...prev, `Output: ${cmd}`]);
              setLogs(prev => [...prev, `Unknown command: ${cmd}`]);
            }
          }} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
