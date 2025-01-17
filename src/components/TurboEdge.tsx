import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';
import styles from './TurboEdge.module.styl';

function TurboEdge({ sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      className={styles.turboEdge}
    />
  );
}

export default TurboEdge;
