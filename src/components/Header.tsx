import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center gap-3 mb-2">
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
    </header>
  );
}
