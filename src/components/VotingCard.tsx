'use client';

import React, { useState } from 'react';
import { StarRating } from './StarRating';

interface Teacher {
  id: number;
  name: string;
  subject: string;
}

interface Category {
  id: string;
  label: string;
  description: string;
}

interface VotingCardProps {
  teacher: Teacher;
  categories: Category[];
  onSubmit: (ratings: Record<string, number>) => Promise<void>;
  disabled?: boolean;
}

export function VotingCard({ teacher, categories, onSubmit, disabled = false }: VotingCardProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (categoryId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [categoryId]: rating,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(ratings).length !== categories.length) {
      alert('Bitte alle Kategorien bewerten!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(ratings);
      setSubmitted(true);
      setRatings({});
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert('Fehler beim Speichern der Abstimmung!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{teacher.name}</h3>
      <p className="text-gray-600 mb-4">{teacher.subject}</p>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="border-t pt-4">
            <label className="block mb-3">
              <span className="font-semibold text-gray-700">{category.label}</span>
              <span className="text-sm text-gray-500 ml-2">{category.description}</span>
            </label>
            <StarRating
              value={ratings[category.id] || 0}
              onChange={(rating) => handleRatingChange(category.id, rating)}
              disabled={disabled || isSubmitting}
            />
          </div>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          ✓ Abstimmung erfolgreich gespeichert!
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={disabled || isSubmitting || Object.keys(ratings).length !== categories.length}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Wird gespeichert...' : 'Abstimmung abschließen'}
      </button>
    </div>
  );
}
