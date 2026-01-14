'use client';

import React from 'react';

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
}

interface ResultsDisplayProps {
  teachers: Teacher[];
  categories: Category[];
}

export function ResultsDisplay({ teachers, categories }: ResultsDisplayProps) {
  const getAverageRating = (teacher: Teacher, categoryId: string): number => {
    if (teacher.totalVotes === 0) return 0;
    return parseFloat((teacher.votes[categoryId] / teacher.totalVotes).toFixed(2));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Abstimmungsergebnisse</h2>

      <div className="space-y-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{teacher.subject}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => {
                const avg = getAverageRating(teacher, category.id);
                const progress = (avg / 5) * 100;

                return (
                  <div key={category.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{category.label}</span>
                      <span className="text-sm font-semibold text-blue-600">{avg.toFixed(2)}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              {teacher.totalVotes} Abstimmung{teacher.totalVotes !== 1 ? 'en' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
