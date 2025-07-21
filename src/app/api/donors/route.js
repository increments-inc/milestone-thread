import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/donors - Get all blood donors
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const location = searchParams.get('location');
    const available = searchParams.get('available');

    const where = {};
    
    if (bloodGroup && bloodGroup !== 'all') {
      where.bloodGroup = bloodGroup;
    }
    
    if (location && location !== 'all') {
      where.location = location;
    }
    
    if (available === 'true') {
      where.available = true;
    }

    const donors = await prisma.bloodDonor.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    // Sort by social media count and then alphabetically
    const sortedDonors = donors.sort((a, b) => {
      const aSocialCount = (a.socialMedia || []).length;
      const bSocialCount = (b.socialMedia || []).length;
      
      if (bSocialCount !== aSocialCount) {
        return bSocialCount - aSocialCount;
      }
      
      return a.name.localeCompare(b.name, 'bn');
    });

    return NextResponse.json(sortedDonors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donors' },
      { status: 500 }
    );
  }
}

// POST /api/donors - Create a new blood donor
export async function POST(request) {
  try {
    const data = await request.json();
    
    const {
      name,
      phoneNumber,
      bloodGroup,
      location,
      socialMedia = [],
      available = true
    } = data;

    // Validate required fields
    if (!name || !phoneNumber || !bloodGroup || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingDonor = await prisma.bloodDonor.findUnique({
      where: { phoneNumber }
    });

    if (existingDonor) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 409 }
      );
    }

    // Filter valid social media entries
    const validSocialMedia = socialMedia.filter(sm => sm.platform && sm.url);

    const newDonor = await prisma.bloodDonor.create({
      data: {
        name,
        phoneNumber,
        bloodGroup,
        location,
        available,
        socialMedia: validSocialMedia
      }
    });

    return NextResponse.json(newDonor, { status: 201 });
  } catch (error) {
    console.error('Error creating donor:', error);
    
    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Phone number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create donor' },
      { status: 500 }
    );
  }
}