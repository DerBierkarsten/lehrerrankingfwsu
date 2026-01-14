'use client';

import { useEffect, useState } from 'react';
import { VotingCard } from '@/components/VotingCard';
import { ResultsDisplay } from '@/components/ResultsDisplay';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  votes: Record<string, number>;
  totalVotes: number;
}

interface Category {
  id: string;
  label: string;
  description: string;
}

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [view, setView] = useState<'vote' | 'results'>('vote');
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Load categories from JSON
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // Load teachers from API
        const teachersRes = await fetch('/api/votes');
        const teachersData = await teachersRes.json();
        setTeachers(teachersData.teachers);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleVoteSubmit = async (teacherId: number, ratings: Record<string, number>) => {
    try {
      for (const [category, rating] of Object.entries(ratings)) {
        const response = await fetch('/api/votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId, category, rating }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }

        const data = await response.json();
        setTeachers(data.teachers);
      }

      setHasVoted(true);
      setView('results');
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Lädt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-blue-600">Lehrervoting</h1>
          <p className="text-gray-600 mt-1">Bewerten Sie Ihre Lehrer</p>
        </div>
      </header>

      {/* View Toggle */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('vote')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              view === 'vote'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Abstimmung
          </button>
          <button
            onClick={() => setView('results')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              view === 'results'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ergebnisse
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {view === 'vote' ? (
          <div>
            {hasVoted && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                Vielen Dank für Ihre Abstimmung! Sie können jetzt die Ergebnisse ansehen.
              </div>
            )}
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <VotingCard
                  key={teacher.id}
                  teacher={teacher}
                  categories={categories}
                  onSubmit={(ratings) => handleVoteSubmit(teacher.id, ratings)}
                  disabled={hasVoted}
                />
              ))}
            </div>
          </div>
        ) : (
          <ResultsDisplay teachers={teachers} categories={categories} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12 py-8 text-center text-gray-600">
        <p className="mb-2">
          Diese Website speichert keine persönlichen Daten. Stimmen werden anonym gezählt. IPs werden
          gehasht, um doppelte Abstimmungen zu vermeiden.
        </p>
        <p className="text-sm">© 2026 Lehrervoting System</p>
      </footer>
    </div>
  );
}
