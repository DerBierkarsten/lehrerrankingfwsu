import { NextRequest, NextResponse } from 'next/server';
import { hashIP } from '@/lib/hash';
import { hasVoted, addVote, readTeachers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { teacherId, category, rating } = await request.json();

    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const ipHash = hashIP(ip);

    // Check if already voted
    if (hasVoted(ipHash)) {
      return NextResponse.json({ error: 'Sie haben bereits abgestimmt!' }, { status: 400 });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Ungültige Bewertung!' }, { status: 400 });
    }

    // Add vote
    addVote(ipHash, teacherId, category, rating);

    // Return updated teachers
    const teachers = readTeachers();
    return NextResponse.json({ success: true, teachers });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Speichern der Abstimmung!' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teachers = readTeachers();
    return NextResponse.json({ teachers });
  } catch (error) {
    console.error('Get error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Daten!' },
      { status: 500 }
    );
  }
}
