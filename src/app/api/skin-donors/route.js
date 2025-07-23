import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skin-donors - Get all skin donors
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospital = searchParams.get('hospital');
    const status = searchParams.get('status');
    const available = searchParams.get('available');

    const where = {};
    
    if (hospital && hospital !== 'all') {
      where.nearbyHospital = {
        contains: hospital,
        mode: 'insensitive'
      };
    }
    
    if (status && status !== 'all') {
      where.donationStatus = status;
    }
    
    if (available === 'true') {
      where.available = true;
    }

    const donors = await prisma.skinDonor.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    // Sort alphabetically by name
    const sortedDonors = donors.sort((a, b) => {
      return a.name.localeCompare(b.name, 'bn');
    });

    return NextResponse.json(sortedDonors);
  } catch (error) {
    console.error('Error fetching skin donors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skin donors' },
      { status: 500 }
    );
  }
}

// POST /api/skin-donors - Create a new skin donor
export async function POST(request) {
  try {
    const data = await request.json();
    
    const {
      name,
      phoneNumber,
      nearbyHospital,
      isAbove18,
      voluntaryConsent,
      hasDiabetes = false,
      hasHypertension = false,
      hasCancer = false,
      hasSevereIllness = false,
      medicalNotes = '',
      available = true
    } = data;

    // Validate required fields
    if (!name || !phoneNumber || !nearbyHospital) {
      return NextResponse.json(
        { error: 'Name, phone number, and nearby hospital are required' },
        { status: 400 }
      );
    }

    // Validate age and consent
    if (!isAbove18) {
      return NextResponse.json(
        { error: 'Donor must be above 18 years old' },
        { status: 400 }
      );
    }

    if (!voluntaryConsent) {
      return NextResponse.json(
        { error: 'Voluntary consent is required' },
        { status: 400 }
      );
    }

    // Check eligibility based on medical conditions
    if (hasCancer || hasSevereIllness) {
      return NextResponse.json(
        { error: 'Donation not allowed for cancer or severe illness' },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingDonor = await prisma.skinDonor.findUnique({
      where: { phoneNumber }
    });

    if (existingDonor) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 409 }
      );
    }

    const newDonor = await prisma.skinDonor.create({
      data: {
        name: name.trim(),
        phoneNumber,
        nearbyHospital: nearbyHospital.trim(),
        isAbove18,
        voluntaryConsent,
        hasDiabetes,
        hasHypertension,
        hasCancer,
        hasSevereIllness,
        medicalNotes: medicalNotes.trim(),
        available,
        donationStatus: 'registered'
      }
    });

    return NextResponse.json(newDonor, { status: 201 });
  } catch (error) {
    console.error('Error creating skin donor:', error);
    
    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Phone number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register skin donor' },
      { status: 500 }
    );
  }
}