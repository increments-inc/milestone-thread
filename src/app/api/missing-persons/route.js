import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all missing persons
export async function GET() {
  try {
    const missingPersons = await prisma.missingPerson.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert photo blob to base64 for frontend display
    const processedPersons = missingPersons.map(person => ({
      ...person,
      photo: person.photo ? `data:${person.photoMimeType || 'image/jpeg'};base64,${person.photo.toString('base64')}` : null,
      parentContacts: person.parentContacts || []
    }));

    return NextResponse.json(processedPersons);
  } catch (error) {
    console.error('Error fetching missing persons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missing persons' },
      { status: 500 }
    );
  }
}

// POST - Create new missing person report
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const fullName = formData.get('fullName');
    const className = formData.get('class');
    const code = formData.get('code');
    const section = formData.get('section');
    const parentContactsStr = formData.get('parentContacts');
    const photoFile = formData.get('photo');
    
    // Validation
    if (!fullName || fullName.trim() === '') {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    // Parse parent contacts
    let parentContacts = [];
    if (parentContactsStr) {
      try {
        parentContacts = JSON.parse(parentContactsStr);
      } catch (error) {
        parentContacts = [];
      }
    }

    // Process photo if provided
    let photoBuffer = null;
    let photoMimeType = null;
    
    if (photoFile && photoFile.size > 0) {
      // Validate file size (max 5MB)
      if (photoFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Photo size must be less than 5MB' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!photoFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      photoBuffer = Buffer.from(await photoFile.arrayBuffer());
      photoMimeType = photoFile.type;
    }

    // Create missing person record
    const missingPerson = await prisma.missingPerson.create({
      data: {
        fullName: fullName.trim(),
        class: className ? className.trim() : null,
        code: code ? code.trim() : null,
        section: section ? section.trim() : null,
        parentContacts: parentContacts.length > 0 ? parentContacts : null,
        photo: photoBuffer,
        photoMimeType: photoMimeType,
        status: 'missing'
      }
    });

    // Return the created record without the binary photo data
    const response = {
      ...missingPerson,
      photo: missingPerson.photo ? 'uploaded' : null
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating missing person report:', error);
    return NextResponse.json(
      { error: 'Failed to create missing person report' },
      { status: 500 }
    );
  }
}