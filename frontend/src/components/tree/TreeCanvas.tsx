import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import type { Node, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { MemberNode } from './MemberNode';
import { RelationshipEdge } from './RelationshipEdge';
import { TreeToolbar } from './TreeToolbar';
import { TreeSidebar } from './TreeSidebar';
import { AddMemberModal } from '../profile/AddMemberModal';
import { CreateRelationshipModal } from './CreateRelationshipModal';
import { useFamilyStore } from '../../store/familyStore';
import { getLayoutedElements } from '../../utils/layout';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const nodeTypes = {
  member: MemberNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

const TreeCanvasInner: React.FC = () => {
  const { members, relationships, activeTree } = useFamilyStore();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isCreateRelOpen, setIsCreateRelOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const reactFlowInstance = useReactFlow();

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
    setIsAddMemberOpen(true);
  }, []);

  const handleLayoutToggle = useCallback(() => {
    console.log('Toggle Layout Direction');
  }, []);

  const handleExport = useCallback(async () => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element || !activeTree) return;

    setIsExporting(true);

    try {
      reactFlowInstance.fitView();
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await toPng(element, {
        backgroundColor: '#f9fafb',
        quality: 1,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
      
      const width = imgProps.width * ratio;
      const height = imgProps.height * ratio;
      const x = (pdfWidth - width) / 2;
      const y = (pdfHeight - height) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, width, height);
      pdf.save(`${activeTree.name.replace(/\s+/g, '_')}_Family_Tree.pdf`);
    } catch (error) {
      console.error('Failed to export tree:', error);
      alert('Failed to export tree. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [activeTree, reactFlowInstance]);

  const handleSelectMember = useCallback((id: string) => {
    console.log('Selected member:', id);
    // Here we could fly the viewport to the node, or open the detail panel
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    // Show the modal to pick relationship type
    setPendingConnection(connection);
    setIsCreateRelOpen(true);
  }, []);

  return (
    <>
        <TreeSidebar onSelectMember={handleSelectMember} />
        <TreeToolbar 
          onAddMember={handleAddMember} 
          onLayoutToggle={handleLayoutToggle} 
          onExport={handleExport}
        />
        
        {isExporting && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-saffron)] border-t-transparent mb-4"></div>
            <p className="text-gray-700 font-medium">Generating PDF Export...</p>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
        
        <AddMemberModal 
          isOpen={isAddMemberOpen} 
          onClose={() => setIsAddMemberOpen(false)} 
        />

        <CreateRelationshipModal
          isOpen={isCreateRelOpen}
          onClose={() => {
            setIsCreateRelOpen(false);
            setPendingConnection(null);
          }}
          sourceId={pendingConnection?.source || null}
          targetId={pendingConnection?.target || null}
        />
    </>
  );
};

export const TreeCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[var(--color-cream)] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
      <ReactFlowProvider>
        <TreeCanvasInner />
      </ReactFlowProvider>
    </div>
  );
};
