import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadmeHistoryLog } from '../types';
import { 
  History, 
  Trash2, 
  PlusCircle, 
  RefreshCw, 
  Download, 
  Copy, 
  XOctagon, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HistoryViewProps {
  logs: ReadmeHistoryLog[];
  onClearHistory: () => void;
}

interface GroupedHistoryLog {
  id: string;
  action: ReadmeHistoryLog['action'];
  projectName?: string;
  timestamp: string;
  count: number;
  originalLogs: ReadmeHistoryLog[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs, onClearHistory }) => {
  const { t, i18n } = useTranslation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Format standard dates for logs
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    } catch {
      return '';
    }
  };

  // Select dynamic visual badge details for action log items
  const getActionBadge = (action: ReadmeHistoryLog['action'], count: number = 1) => {
    switch (action) {
      case 'created':
        return {
          label: t('history.actions.created'),
          color: 'bg-green-500/10 text-green-600 border-green-500/20',
          icon: PlusCircle
        };
      case 'updated':
        return {
          label: count > 1 ? `${count}x ${t('history.actions.updated')}` : t('history.actions.updated'),
          color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          icon: RefreshCw
        };
      case 'exported':
        return {
          label: t('history.actions.exported'),
          color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
          icon: Download
        };
      case 'duplicated':
        return {
          label: t('history.actions.duplicated'),
          color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          icon: Copy
        };
      case 'deleted':
        return {
          label: t('history.actions.deleted'),
          color: 'bg-red-500/10 text-red-600 border-red-500/20',
          icon: XOctagon
        };
      default:
        return {
          label: t('history.actions.action'),
          color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          icon: Clock
        };
    }
  };

  // Group consecutive updated events for same project in 5-minute windows
  const getGroupedLogs = (rawLogs: ReadmeHistoryLog[]): GroupedHistoryLog[] => {
    const grouped: GroupedHistoryLog[] = [];
    
    for (const log of rawLogs) {
      if (grouped.length === 0) {
        grouped.push({
          id: log.id,
          action: log.action,
          projectName: log.projectName,
          timestamp: log.timestamp,
          count: 1,
          originalLogs: [log]
        });
        continue;
      }
      
      const lastGroup = grouped[grouped.length - 1];
      
      const isConsecutiveUpdated = log.action === 'updated' && lastGroup.action === 'updated';
      const isSameProject = log.projectName === lastGroup.projectName;
      
      let isWithinTimeWindow = false;
      if (isConsecutiveUpdated) {
        const lastLogTimestamp = new Date(lastGroup.originalLogs[lastGroup.originalLogs.length - 1].timestamp).getTime();
        const currentLogTimestamp = new Date(log.timestamp).getTime();
        const timeDiff = Math.abs(lastLogTimestamp - currentLogTimestamp);
        isWithinTimeWindow = timeDiff <= 5 * 60 * 1000; // 5 minutes
      }
      
      if (isConsecutiveUpdated && isSameProject && isWithinTimeWindow) {
        lastGroup.count += 1;
        lastGroup.originalLogs.push(log);
      } else {
        grouped.push({
          id: log.id,
          action: log.action,
          projectName: log.projectName,
          timestamp: log.timestamp,
          count: 1,
          originalLogs: [log]
        });
      }
    }
    
    return grouped;
  };

  const groupedLogs = getGroupedLogs(logs);

  return (
    <div className="space-y-6">
      {/* Intro Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary tracking-tight">
            {t('history.title')}
          </h2>
          <p className="text-sm text-text-secondary">
            {t('history.subtitle')}
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/10 dark:hover:bg-red-950/30 text-xs font-semibold px-4 py-2 rounded-xl border border-red-100 dark:border-red-950/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('history.clear_btn')}</span>
          </button>
        )}
      </div>

      {/* Audit Log Timeline */}
      {groupedLogs.length > 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-small">
          <div className="relative border-l-2 border-border pl-6 space-y-6 py-2 ml-3">
            {groupedLogs.map((group) => {
              const badge = getActionBadge(group.action, group.count);
              const Icon = badge.icon;
              const isExpanded = !!expandedGroups[group.id];
              const canExpand = group.count > 1;

              return (
                <div key={group.id} className="relative group">
                  {/* Timeline bullet icon dot */}
                  <span className="absolute -left-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface border border-border text-text-muted group-hover:border-primary group-hover:text-primary transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  <div className="flex flex-col bg-surface-secondary border border-border rounded-xl shadow-small overflow-hidden">
                    <div 
                      onClick={() => canExpand && toggleGroup(group.id)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 transition-transform ${canExpand ? 'cursor-pointer hover:bg-border/10' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded-full ${badge.color}`}>
                          {badge.label}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary">
                            {group.projectName || (i18n.language === 'en-US' ? 'Untitled Project' : i18n.language === 'es-419' ? 'Proyecto sin nombre' : 'Projeto sem Nome')}
                          </p>
                          {group.count > 1 && (
                            <span className="text-xs text-text-secondary bg-surface border border-border px-2 py-0.5 rounded-md font-medium">
                              {t('history.updated_many', { count: group.count })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="flex items-center text-xs text-text-muted font-mono">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>{formatTime(group.timestamp)}</span>
                        </div>
                        {canExpand && (
                          <div className="text-text-muted">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded sub-logs list */}
                    {canExpand && isExpanded && (
                      <div className="border-t border-border bg-surface-secondary/50 px-4 py-3 space-y-2">
                        {group.originalLogs.map((subLog, index) => (
                          <div key={subLog.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0 pl-4 relative">
                            <span className="absolute left-1 top-2.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-text-secondary">
                              {t('history.actions.updated')} #{group.count - index}
                            </span>
                            <span className="text-text-muted font-mono">
                              {formatTime(subLog.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center max-w-md mx-auto shadow-small">
          <div className="w-16 h-16 bg-background text-text-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
            <History className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-text-primary text-lg mb-1">{t('history.empty_title')}</h3>
          <p className="text-xs text-text-secondary">
            {t('history.empty_desc')}
          </p>
        </div>
      )}
    </div>
  );
};
