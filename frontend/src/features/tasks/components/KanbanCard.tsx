import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority?: string;
}

interface KanbanCardProps {
  task: Task;
  onDragStart: () => void;
  onDragEnd: () => void;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onDragStart, onDragEnd, onClick, onDelete }) => {
  const priorityConfig = {
    LOW: { color: 'bg-vedata-accent', icon: '🔵' },
    MEDIUM: { color: 'bg-vedata-warning', icon: '🟡' },
    HIGH: { color: 'bg-vedata-primary', icon: '🔴' }
  };

  const priority = task.priority || 'MEDIUM';
  const priorityStyle = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(e);
    }
  };

  return (
    <div
      className="task-card bg-vedata-white rounded-lg p-4 cursor-grab active:cursor-grabbing hover:scale-[1.03] transition-all duration-200 shadow-sm hover:shadow-md border border-vedata-accent group"
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Cabeçalho do Card */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-vedata-text leading-snug flex-1 line-clamp-2 uppercase tracking-tight">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {onDelete && (
            <button
              type="button"
              title="Excluir tarefa"
              onClick={handleDeleteClick}
              className="p-0.5 hover:bg-vedata-bg rounded transition-colors"
            >
              <Trash2 className="w-3 h-3 text-vedata-text" />
            </button>
          )}
          <GripVertical className="w-4 h-4 text-vedata-accent group-hover:text-vedata-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </div>

      {/* Divisor Sutil */}
      <div className="h-px bg-vedata-accent opacity-30 mb-3"></div>

      {/* Rodapé do Card */}
      <div className="flex items-center justify-between gap-2">
        {/* Projeto e Prioridade */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-vedata-text opacity-50 uppercase tracking-widest truncate">
            {task.project}
          </p>
        </div>

        {/* Badge de Prioridade */}
        <div className={`w-2.5 h-2.5 rounded-full ${priorityStyle.color} flex-shrink-0 shadow-sm border border-white`}></div>
      </div>
    </div>
  );
};

export default KanbanCard;
