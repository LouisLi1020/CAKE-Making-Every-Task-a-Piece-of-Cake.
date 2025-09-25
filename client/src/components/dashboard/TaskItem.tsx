import React from 'react';
import { CheckCircle, Circle, Clock, MoreVertical } from 'lucide-react';
import { Task } from '../../types';
import { components } from '../../lib/design-system';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../UI/dropdown-menu';

interface TaskItemProps {
  task: Task;
  onStatusToggle: (taskId: string, status: Task['status']) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onStatusToggle, 
  onEdit, 
  onDelete 
}) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50';
      case 'in-progress':
        return 'text-amber-600 bg-amber-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getNextStatus = (currentStatus: Task['status']): Task['status'] => {
    switch (currentStatus) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      case 'completed':
        return 'todo';
      default:
        return 'todo';
    }
  };

  const handleStatusToggle = () => {
    const nextStatus = getNextStatus(task.status);
    onStatusToggle(task._id, nextStatus);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-sm group">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={handleStatusToggle} 
          className="hover:scale-110 transition-transform flex-shrink-0"
        >
          {getStatusIcon(task.status)}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-slate-500 truncate mt-1">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {task.dueDate && (
              <span className="text-xs text-slate-500">
                Due: {formatDate(task.dueDate)}
              </span>
            )}
            {task.assignee && (
              <span className="text-xs text-slate-500">
                Assigned to: {task.assignee.firstName || task.assignee.username}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
        <span className="text-sm text-slate-600 capitalize hidden sm:inline">
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(task)}>
                Edit Task
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(task._id)}
                className="text-red-600 focus:text-red-600"
              >
                Delete Task
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
