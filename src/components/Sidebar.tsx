import { useState, useRef } from 'react';
import { 
  Menu, 
  X, 
  Settings, 
  Upload, 
  FileText, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Shuffle,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useExamStore } from '@/store/examStore';
import { Question } from '@/types/question';
import { toast } from '@/hooks/use-toast';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { questions, setQuestions, resetExam, shuffleQuestions, resetToOriginal, examConfig, setExamConfig } = useExamStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      toast({
        title: 'Archivo inválido',
        description: 'Por favor selecciona un archivo JSON válido.',
        variant: 'destructive'
      });
    }
  };
  
  const handleProcessJSON = async () => {
    if (!selectedFile) return;
    
    // Check if there are existing questions
    if (questions.length > 0) {
      setShowConfirmDialog(true);
      return;
    }
    
    await processFile();
  };
  
  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setShowConfirmDialog(false);
    
    try {
      const fileContent = await selectedFile.text();
      const parsedData = JSON.parse(fileContent);
      
      if (!Array.isArray(parsedData)) {
        throw new Error('El JSON debe ser un array de preguntas.');
      }
      
      // Validate and normalize questions
      const parsedQuestions: Question[] = parsedData
        .filter(Boolean)
        .map((q: any) => ({
          id: Number(q.id) || 0,
          text: q.text || '',
          options: Array.isArray(q.options)
            ? q.options.map((o: any) => ({ id: String(o.id), text: o.text || '' }))
            : [],
          correctOptionId: q.correctOptionId ?? ''
        }))
        .filter(q => q.text && q.options.length > 0);
      
      if (parsedQuestions.length === 0) {
        toast({
          title: 'No se encontraron preguntas válidas',
          description: 'El JSON no contiene preguntas con el formato correcto.',
          variant: 'destructive'
        });
        return;
      }
      
      setQuestions(parsedQuestions);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      toast({
        title: '¡JSON procesado exitosamente!',
        description: `Se cargaron ${parsedQuestions.length} preguntas.`,
      });
    } catch (error) {
      toast({
        title: 'Error al procesar JSON',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    resetExam();
    toast({
      title: 'Examen reiniciado',
      description: 'Todas las respuestas han sido borradas.',
    });
  };
  
  const handleShuffle = () => {
    shuffleQuestions();
    toast({
      title: 'Preguntas mezcladas',
      description: 'El orden de las preguntas ha sido aleatorizado.',
    });
  };
  
  const handleResetToOriginal = () => {
    resetToOriginal();
    toast({
      title: 'Orden original restaurado',
      description: 'Las preguntas han vuelto a su orden original.',
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 rounded-xl shadow-lg bg-card hover:bg-muted"
      >
        <Menu className="w-5 h-5" />
      </Button>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Panel */}
      <div className={cn(
        'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-card border-l shadow-2xl',
        'transform transition-transform duration-300 ease-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Configuración</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-6 overflow-auto h-[calc(100%-65px)] scrollbar-thin">
          {/* JSON Upload Section */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Cargar Preguntas desde JSON
            </h3>
            
            <div className="space-y-3">
              {/* File Input */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">Clic para subir</span> o arrastra aquí
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Solo archivos JSON</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleFileChange}
                />
              </label>
              
              {/* Selected File Preview */}
              {selectedFile && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl animate-scale-in">
                  <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="flex-shrink-0 rounded-lg h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {/* Process Button */}
              <Button
                onClick={handleProcessJSON}
                disabled={!selectedFile || isProcessing}
                className="w-full gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Procesar JSON
                  </>
                )}
              </Button>
            </div>
          </section>
          
          {/* Current Status */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Estado Actual
            </h3>
            <div className="p-4 bg-muted rounded-xl">
              <p className="text-2xl font-bold text-primary">{questions.length}</p>
              <p className="text-sm text-muted-foreground">preguntas cargadas</p>
            </div>
          </section>
          
          {/* Reset Section */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Acciones
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Reiniciar Respuestas
              </Button>
              <Button
                variant="outline"
                onClick={handleShuffle}
                className="w-full gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Mezclar Preguntas
              </Button>
              <Button
                variant="outline"
                onClick={handleResetToOriginal}
                className="w-full gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Orden Original
              </Button>
            </div>
          </section>
          
          {/* Legend */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Leyenda de Colores
            </h3>
            <div className="space-y-2">
              <LegendItem color="bg-success" label="Respuesta correcta" />
              <LegendItem color="bg-destructive" label="Respuesta incorrecta" />
              <LegendItem color="bg-unanswered" label="Sin responder" />
            </div>
          </section>
        </div>
      </div>
      
      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <>
          <div className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm animate-fade-in" />
          <div className="fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-card rounded-2xl shadow-2xl border p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-warning/10 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold text-lg">¿Reemplazar preguntas?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Ya tienes {questions.length} preguntas cargadas. Si continúas, se reemplazarán todas las preguntas actuales y se perderá tu progreso.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={processFile}
                className="flex-1"
              >
                Reemplazar
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-4 h-4 rounded', color)} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
