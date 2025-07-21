const sharp = require('sharp');
const path = require('path');

async function generateOGImage() {
  const width = 1200;
  const height = 630;

  // Create SVG content for the OG image
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fef2f2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGradient)"/>
      
      <!-- Blood drop icon -->
      <g transform="translate(100, 150)">
        <path d="M60 0C60 0 0 50 0 90C0 118 27 130 60 130C93 130 120 118 120 90C120 50 60 0 60 0Z" 
              fill="white" opacity="0.9"/>
      </g>
      
      <!-- Main title -->
      <text x="300" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
            fill="white" text-anchor="start">
        জরুরি রক্তদান
      </text>
      
      <!-- Subtitle -->
      <text x="300" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="600" 
            fill="white" opacity="0.9" text-anchor="start">
        মাইলস্টোন কলেজ দুর্ঘটনা
      </text>
      
      <!-- Description -->
      <text x="300" y="340" font-family="Arial, sans-serif" font-size="32" 
            fill="white" opacity="0.8" text-anchor="start">
        বিমান দুর্ঘটনার আহতদের জন্য
      </text>
      
      <text x="300" y="380" font-family="Arial, sans-serif" font-size="32" 
            fill="white" opacity="0.8" text-anchor="start">
        জরুরি রক্তদান প্রয়োজন
      </text>
      
      <!-- Call to action -->
      <rect x="300" y="420" width="350" height="70" rx="35" fill="white" opacity="0.2"/>
      <text x="475" y="470" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            fill="white" text-anchor="middle">
        ★ দ্রুত যোগাযোগ করুন ★
      </text>
      
      <!-- Website -->
      <text x="300" y="540" font-family="Arial, sans-serif" font-size="28" 
            fill="white" opacity="0.9" text-anchor="start">
        gienie.xyz
      </text>
      
      <!-- Heart icon -->
      <g transform="translate(1050, 450)">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="white" opacity="0.7" transform="scale(3)"/>
      </g>
    </svg>
  `;

  try {
    // Convert SVG to PNG using Sharp
    await sharp(Buffer.from(svgContent))
      .png({ quality: 90 })
      .toFile(path.join(process.cwd(), 'public', 'og-image.jpg'));

    console.log('✅ Open Graph image generated successfully at /public/og-image.jpg');
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
  }
}

generateOGImage();