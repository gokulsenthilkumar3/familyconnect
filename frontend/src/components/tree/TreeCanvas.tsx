import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { MemberNode } from './MemberNode';
import { RelationshipEdge } from './RelationshipEdge';
import { TreeToolbar } from './TreeToolbar';
import { TreeSidebar } from './TreeSidebar';
import { useFamilyStore } from '../../store/familyStore';
import { getLayoutedElements } from '../../utils/layout';

const nodeTypes = {
  member: MemberNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

export const TreeCanvas: React.FC = () => {
  const { members, relationships } = useFamilyStore();

  // Map store data to React Flow format
  const initialNodes: Node[] = useMemo(() => 
    members.map((member) => ({
      id: member.id,
      type: 'member',
      position: { x: 0, y: 0 }, // Will be set by dagre layout
      data: { ...member },
    })),
  [members]);

  const initialEdges: Edge[] = useMemo(() => 
    relationships.map((rel) => ({
      id: rel.id,
      source: rel.member1Id,
      target: rel.member2Id,
      type: 'relationship',
      data: { 
        type: rel.type,
        label: rel.customLabel || rel.marriageDate ? new Date(rel.marriageDate!).getFullYear().toString() : undefined
      },
    })),
  [relationships]);

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges, 'TB'),
    [initialNodes, initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Re-layout if data changes
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(initialNodes, initialEdges, 'TB');
    setNodes(newNodes);
    setEdges(newEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleAddMember = useCallback(() => {
    console.log('Open Add Member Modal');
  }, []);

  const handleLayoutToggle = useCallback(() => {
    console.log('Toggle Layout Direction');
  }, []);

  const handleSelectMember = useCallback((id: string) => {
    console.log('Selected member:', id);
    // Here we could fly the viewport to the node, or open the detail panel
  }, []);

  return (
    <div className="relative w-full h-full bg-[var(--color-cream)] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
      <ReactFlowProvider>
        <TreeSidebar onSelectMember={handleSelectMember} />
        <TreeToolbar 
          onAddMember={handleAddMember} 
          onLayoutToggle={handleLayoutToggle} 
        />
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-right"
        >
          <Background color="#ccc" gap={24} variant={BackgroundVariant.Dots} />
          <Controls showInteractive={false} className="mb-4 mr-4" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
