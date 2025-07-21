import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  {
    name: 'আব্দুল করিম',
    phoneNumber: '+880 1712-345678',
    bloodGroup: 'A+',
    location: 'ঢাকা মেডিক্যাল বার্ন ইউনিট',
    lastDonation: new Date('2024-01-15'),
    available: true,
    socialMedia: [
      { platform: 'facebook', url: 'https://facebook.com/abdulkarim' },
      { platform: 'instagram', url: 'https://instagram.com/abdulkarim' }
    ]
  },
  {
    name: 'ফাতেমা খাতুন',
    phoneNumber: '+880 1898-765432',
    bloodGroup: 'B+',
    location: 'কুর্মিটোলা জেনারেল হাসপাতাল',
    lastDonation: new Date('2024-02-20'),
    available: true,
    socialMedia: [
      { platform: 'facebook', url: 'https://facebook.com/fatema' }
    ]
  },
  {
    name: 'রফিকুল ইসলাম',
    phoneNumber: '+880 1756-234567',
    bloodGroup: 'O+',
    location: 'উত্তরা আধুনিক মেডিক্যাল কলেজ',
    lastDonation: new Date('2024-01-05'),
    available: false,
    socialMedia: []
  },
  {
    name: 'সালমা বেগম',
    phoneNumber: '+880 1923-456789',
    bloodGroup: 'AB+',
    location: 'কুয়েত মৈত্রী হাসপাতাল',
    lastDonation: new Date('2023-12-28'),
    available: true,
    socialMedia: []
  },
  {
    name: 'জাহিদ হাসান',
    phoneNumber: '+880 1612-987654',
    bloodGroup: 'A-',
    location: 'উত্তরা উইমেন্স মেডিক্যাল কলেজ',
    lastDonation: new Date('2024-02-01'),
    available: true,
    socialMedia: [
      { platform: 'twitter', url: 'https://twitter.com/jahid' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/jahid' },
      { platform: 'website', url: 'https://jahidhasan.dev' }
    ]
  },
  {
    name: 'নাজমা আক্তার',
    phoneNumber: '+880 1845-321098',
    bloodGroup: 'B-',
    location: 'মনসুরআলী মেডিকেল কলেজ',
    lastDonation: new Date('2024-01-20'),
    available: true,
    socialMedia: []
  },
  {
    name: 'কামাল উদ্দিন',
    phoneNumber: '+880 1790-654321',
    bloodGroup: 'O-',
    location: 'ঢাকা মেডিক্যাল বার্ন ইউনিট',
    lastDonation: new Date('2023-11-15'),
    available: true,
    socialMedia: [
      { platform: 'facebook', url: 'https://facebook.com/kamal' }
    ]
  },
  {
    name: 'রুবিনা পারভীন',
    phoneNumber: '+880 1567-890123',
    bloodGroup: 'AB-',
    location: 'কুর্মিটোলা জেনারেল হাসপাতাল',
    lastDonation: new Date('2024-02-10'),
    available: false,
    socialMedia: []
  }
];

async function main() {
  console.log('Start seeding...');

  for (const donor of seedData) {
    const result = await prisma.bloodDonor.upsert({
      where: { phoneNumber: donor.phoneNumber },
      update: {},
      create: donor
    });
    console.log(`Created/Updated donor: ${result.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });