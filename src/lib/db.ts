import fs from 'fs';
import path from 'path';

const TEACHERS_FILE = path.join(process.cwd(), 'data', 'teachers.json');
const VOTES_FILE = path.join(process.cwd(), 'data', 'votes.json');

export interface VoteRecord {
  ipHash: string;
  teacherId: number;
  category: string;
  rating: number;
  timestamp: number;
}

/**
 * Read all teachers from JSON file
 */
export function readTeachers() {
  try {
    const data = fs.readFileSync(TEACHERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading teachers:', error);
    return [];
  }
}

/**
 * Write teachers to JSON file
 */
export function writeTeachers(teachers: any[]) {
  try {
    fs.writeFileSync(TEACHERS_FILE, JSON.stringify(teachers, null, 2));
  } catch (error) {
    console.error('Error writing teachers:', error);
  }
}

/**
 * Read all votes from JSON file
 */
export function readVotes(): VoteRecord[] {
  try {
    if (!fs.existsSync(VOTES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(VOTES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading votes:', error);
    return [];
  }
}

/**
 * Write votes to JSON file
 */
export function writeVotes(votes: VoteRecord[]) {
  try {
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
  } catch (error) {
    console.error('Error writing votes:', error);
  }
}

/**
 * Check if IP has already voted
 */
export function hasVoted(ipHash: string): boolean {
  const votes = readVotes();
  return votes.some((vote) => vote.ipHash === ipHash);
}

/**
 * Add a new vote
 */
export function addVote(ipHash: string, teacherId: number, category: string, rating: number) {
  const votes = readVotes();
  votes.push({
    ipHash,
    teacherId,
    category,
    rating,
    timestamp: Date.now(),
  });
  writeVotes(votes);

  // Update teacher votes
  const teachers = readTeachers();
  const teacher = teachers.find((t: any) => t.id === teacherId);
  if (teacher) {
    teacher.votes[category] = (teacher.votes[category] || 0) + rating;
    teacher.totalVotes = (teacher.totalVotes || 0) + 1;
    writeTeachers(teachers);
  }
}
