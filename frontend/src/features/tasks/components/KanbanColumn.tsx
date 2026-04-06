import React, { useState } from 'react';
import KanbanCard from './KanbanCard';

export type TaskStatus = 'BACKLOG' | 'DEVELOPMENT' | 'DONE';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: any[];
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onTaskClick: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  status, 
  tasks,
  onDragStart,
  onDragEnd,
  onDrop,
  onTaskClick,
  onTaskDelete
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const statusConfig = {
    BACKLOG: { 
      bg: 'bg-vedata-text', 
      light: 'bg-vedata-status-todo',
      border: 'border-vedata-accent',
      badge: 'bg-white text-vedata-text',
      label: 'Backlog' 
    },
    DEVELOPMENT: { 
      bg: 'bg-vedata-warning', 
      light: 'bg-vedata-status-progress',
      border: 'border-vedata-accent',
      badge: 'bg-white text-vedata-text',
      label: 'Desenvolvimento' 
    },
    DONE: { 
      bg: 'bg-vedata-success', 
      light: 'bg-vedata-status-done',
      border: 'border-vedata-accent',
      badge: 'bg-white text-vedata-text',
      label: 'Concluído' 
    }
  };

  const config = statusConfig[status] || statusConfig.BACKLOG;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop();
  };

  return (
    <div className="kanban-column flex-1 flex flex-col h-fit">
      {/* Header Estilizado */}
      <div className={`${config.bg} rounded-t-xl px-4 py-3 shadow-sm`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest truncate">
            {title}
          </h3>
          <span className={`${config.badge} text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Zona de Drop */}
      <div 
        className={`${config.light} ${isDragOver ? 'ring-2 ring-offset-2 ' + config.bg : ''} border-x border-b ${config.border} rounded-b-xl p-4 flex flex-col gap-3 min-h-[500px] shadow-inner transition-all duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Cards */}
        <div className="space-y-3 flex-1">
          {tasks.map((task) => (
            <KanbanCard 
              key={task.id} 
              task={task}
              onDragStart={() => onDragStart(task.id)}
              onDragEnd={onDragEnd}
              onClick={() => onTaskClick(task.id)}
              onDelete={onTaskDelete ? (e) => {
                e.stopPropagation();
                onTaskDelete(task.id);
              } : undefined}
            />
          ))}
        </div>

        {/* Estado Vazio */}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-vedata-accent rounded-lg h-24 flex items-center justify-center">
            <span className="text-sm text-vedata-text opacity-40 italic font-light">Solte tarefas aqui</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
