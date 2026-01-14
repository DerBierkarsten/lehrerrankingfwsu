import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const categoriesFile = path.join(process.cwd(), 'data', 'categories.json');
    const data = fs.readFileSync(categoriesFile, 'utf-8');
    const categories = JSON.parse(data);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Kategorien!' },
      { status: 500 }
    );
  }
}
