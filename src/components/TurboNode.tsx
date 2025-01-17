import React from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './TurboNode.module.styl';

export interface NodeConfigData {
  filterColumns?: string[];
  mergeKeys?: string[];
  chartType?: 'bar' | 'line' | 'pie';
  chartOptions?: {
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
  };
}

export interface TurboNodeData extends Record<string, unknown> {
  title: string;
  subline?: string;
  icon?: React.ReactNode;
  inputTypes?: string[];
  outputTypes?: string[];
  config?: NodeConfigData;
}

function TurboNode({ data }: { data: TurboNodeData }) {
  return (
    <div className={`px-4 py-2 shadow-xl ${styles.turboNode}`}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <div className="flex items-center">
        {data.icon && <div className="mr-2 text-gray-400">{data.icon}</div>}
        <div>
          <div className="text-sm font-medium text-white">{data.title}</div>
          {data.subline && (
            <div className="text-xs text-gray-300">{data.subline}</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}

export default TurboNode;
