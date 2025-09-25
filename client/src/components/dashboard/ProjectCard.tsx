import React from 'react';
import { Progress } from '../ui/progress';
import { Project } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'on-hold':
        return 'text-amber-600 bg-amber-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTeamAvatars = () => {
    return project.team.slice(0, 3).map((member, index) => (
      <Avatar key={member._id} className="w-6 h-6 border-2 border-white">
        <AvatarImage src={member.avatar} alt={member.firstName || member.username} />
        <AvatarFallback className="text-xs">
          {(member.firstName?.[0] || member.username[0]).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    ));
  };

  const remainingMembers = Math.max(0, project.team.length - 3);

  return (
    <div className="space-y-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-1">{project.name}</h4>
          {project.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-2">
              {project.description}
            </p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="text-slate-900 font-medium">{project.progress}%</span>
        </div>
        <Progress 
          value={project.progress} 
          className="h-2 bg-slate-100"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {getTeamAvatars()}
          </div>
          {remainingMembers > 0 && (
            <span className="text-xs text-slate-500">
              +{remainingMembers} more
            </span>
          )}
        </div>
        
        <div className="text-xs text-slate-500">
          {project.startDate && project.endDate && (
            <span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          )}
        </div>
      </div>
      
      {onView && (
        <button
          onClick={() => onView(project)}
          className="w-full text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          View Details →
        </button>
      )}
    </div>
  );
};
