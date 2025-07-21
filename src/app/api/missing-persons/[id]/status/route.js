import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Update missing person status
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Validation
    const allowedStatuses = ['missing', 'found_alive', 'found_dead', 'verified'];
    if (!allowedStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    if (!data.location || !data.foundAt) {
      return NextResponse.json(
        { error: 'Location and found date are required' },
        { status: 400 }
      );
    }

    // Check if the missing person exists
    const existingPerson = await prisma.missingPerson.findUnique({
      where: { id }
    });

    if (!existingPerson) {
      return NextResponse.json(
        { error: 'Missing person not found' },
        { status: 404 }
      );
    }

    // Prepare found details
    const foundDetails = {
      location: data.location.trim(),
      foundAt: new Date(data.foundAt).toISOString(),
      condition: data.condition ? data.condition.trim() : null,
      note: data.note ? data.note.trim() : null,
      reporterName: data.reporterName ? data.reporterName.trim() : null,
      reporterContact: data.reporterContact ? data.reporterContact.trim() : null,
      updatedAt: new Date().toISOString()
    };

    // Update the missing person record
    const updatedPerson = await prisma.missingPerson.update({
      where: { id },
      data: {
        status: data.status,
        foundDetails: foundDetails,
        updatedAt: new Date()
      }
    });

    // Return the updated record with photo converted to base64
    const response = {
      ...updatedPerson,
      photo: updatedPerson.photo ? `data:${updatedPerson.photoMimeType || 'image/jpeg'};base64,${updatedPerson.photo.toString('base64')}` : null,
      parentContacts: updatedPerson.parentContacts || []
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating missing person status:', error);
    return NextResponse.json(
      { error: 'Failed to update missing person status' },
      { status: 500 }
    );
  }
}