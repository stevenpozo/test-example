import { Header } from '@/components/Header';
import { StatsBar } from '@/components/StatsBar';
import { QuestionGrid } from '@/components/QuestionGrid';
import { QuestionModal } from '@/components/QuestionModal';
import { Sidebar } from '@/components/Sidebar';
import { ExamResultsModal } from '@/components/ExamResultsModal';
import { ExamConfigModal } from '@/components/ExamConfigModal';
import { useExamStore } from '@/store/examStore';

const Index = () => {
  const mode = useExamStore((state) => state.mode);
  const isExamStarted = useExamStore((state) => state.isExamStarted);
  
  // In exam mode, show config screen if exam hasn't started
  const showExamConfig = mode === 'exam' && !isExamStarted;
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-6xl mx-auto px-4 py-6 sm:py-8 pb-20">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <Header />
          
          {showExamConfig ? (
            /* Exam Configuration Screen */
            <ExamConfigModal />
          ) : (
            <>
              {/* Stats Bar */}
              <StatsBar />
              
              {/* Question Grid */}
              <section>
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Preguntas
                </h2>
                <QuestionGrid />
              </section>
            </>
          )}
        </div>
      </main>
      
      {/* Sidebar for configuration */}
      <Sidebar />
      
      {/* Question Modal */}
      <QuestionModal />
      
      {/* Exam Results Modal */}
      <ExamResultsModal />
    </div>
  );
};

export default Index;
