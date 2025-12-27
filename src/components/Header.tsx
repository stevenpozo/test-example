import { BookOpen, GraduationCap, PenTool } from 'lucide-react';
import { useExamStore } from '@/store/examStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const { mode, setMode } = useExamStore();
  
  return (
    <header className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Simulador de Examen
          </h1>
          <p className="text-sm text-muted-foreground">
            Practica con más de 300 preguntas
          </p>
        </div>
      </div>
      
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={mode === 'practice' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode('practice')}
          className={cn(
            'gap-2',
            mode === 'practice' && 'shadow-sm'
          )}
        >
          <PenTool className="w-4 h-4" />
          Modo Práctica
        </Button>
        <Button
          variant={mode === 'exam' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode('exam')}
          className={cn(
            'gap-2',
            mode === 'exam' && 'shadow-sm'
          )}
        >
          <GraduationCap className="w-4 h-4" />
          Modo Examen
        </Button>
      </div>
    </header>
  );
}
