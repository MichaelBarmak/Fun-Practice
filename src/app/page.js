// Server component — loads questions from the JSON file and passes them to the client.
// To add new questions, just edit data/questions.json and redeploy (or restart dev server).
import questions from '../../data/questions.json';
import QuestionList from '../components/QuestionList';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-indigo-200 text-sm font-medium tracking-widest uppercase mb-2">
            Interview Prep
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Probability Questions
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg max-w-xl">
            {questions.length} curated problems with full solutions. Test your
            intuition, check your answers, and deepen your understanding.
          </p>
        </div>
      </div>

      {/* ── Question list (client component handles search/filter/state) ── */}
      <QuestionList questions={questions} />
    </main>
  );
}
