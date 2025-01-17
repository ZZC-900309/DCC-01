
import { Card } from './ui/card';

interface OutputPanelProps {
  output: string[];
  logs: string[];
}

function OutputPanel({ output, logs }: OutputPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-200 mb-2">Output</h3>
          <div className="text-sm text-gray-400 space-y-1">
            {output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </Card>
        <Card className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-200 mb-2">Logs</h3>
          <div className="text-sm text-gray-400 space-y-1">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default OutputPanel;
