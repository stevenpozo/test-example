import { useExamStore } from '@/store/examStore';
import { CheckCircle2, XCircle, Circle, Percent } from 'lucide-react';

export function StatsBar() {
  const stats = useExamStore((state) => state.getStats());
  
  return (
    <div className="w-full bg-card rounded-2xl border p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatItem
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          label="Correctas"
          value={stats.correct}
          color="text-success"
        />
        <StatItem
          icon={<XCircle className="w-5 h-5 text-destructive" />}
          label="Incorrectas"
          value={stats.incorrect}
          color="text-destructive"
        />
        <StatItem
          icon={<Circle className="w-5 h-5 text-muted-foreground" />}
          label="Sin responder"
          value={stats.unanswered}
          color="text-muted-foreground"
        />
        <StatItem
          icon={<Percent className="w-5 h-5 text-primary" />}
          label="Porcentaje"
          value={`${stats.percentage}%`}
          color="text-primary"
        />
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full flex">
          <div 
            className="bg-success transition-all duration-500 ease-out"
            style={{ width: `${(stats.correct / stats.total) * 100}%` }}
          />
          <div 
            className="bg-destructive transition-all duration-500 ease-out"
            style={{ width: `${(stats.incorrect / stats.total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
