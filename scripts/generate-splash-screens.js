const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, '../public/vercel.svg');
const publicDir = path.join(__dirname, '../public');

// iOS splash screen sizes
const iosSplashScreens = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' }, // 12.9" iPad Pro
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388.png' }, // 11" iPad Pro
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png' }, // 9.7" iPad
  { width: 1668, height: 2224, name: 'apple-splash-1668-2224.png' }, // 10.5" iPad Pro
  { width: 1620, height: 2160, name: 'apple-splash-1620-2160.png' }, // 10.2" iPad
  { width: 1290, height: 2796, name: 'apple-splash-1290-2796.png' }, // iPhone 15 Pro Max
  { width: 1179, height: 2556, name: 'apple-splash-1179-2556.png' }, // iPhone 15 Pro
  { width: 1170, height: 2532, name: 'apple-splash-1170-2532.png' }, // iPhone 12/13/14
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' }, // iPhone X/XS/11 Pro
  { width: 1242, height: 2688, name: 'apple-splash-1242-2688.png' }, // iPhone XS Max/11 Pro Max
  { width: 828, height: 1792, name: 'apple-splash-828-1792.png' },   // iPhone XR/11
  { width: 1080, height: 1920, name: 'apple-splash-1080-1920.png' }, // iPhone 6/7/8 Plus
  { width: 750, height: 1334, name: 'apple-splash-750-1334.png' },   // iPhone 6/7/8
  { width: 640, height: 1136, name: 'apple-splash-640-1136.png' },   // iPhone 5
];

// Android splash screen sizes
const androidSplashScreens = [
  { width: 1920, height: 1080, name: 'android-splash-1920-1080.png' }, // hdpi landscape
  { width: 1080, height: 1920, name: 'android-splash-1080-1920.png' }, // hdpi portrait
  { width: 1280, height: 720, name: 'android-splash-1280-720.png' },  // xhdpi landscape
  { width: 720, height: 1280, name: 'android-splash-720-1280.png' },  // xhdpi portrait
  { width: 960, height: 540, name: 'android-splash-960-540.png' },    // xxhdpi landscape
  { width: 540, height: 960, name: 'android-splash-540-960.png' },    // xxhdpi portrait
  { width: 640, height: 360, name: 'android-splash-640-360.png' },    // xxxhdpi landscape
  { width: 360, height: 640, name: 'android-splash-360-640.png' },    // xxxhdpi portrait
];

async function generateSplashScreen(size) {
  const { width, height, name } = size;
  const outputPath = path.join(publicDir, name);

  // Create a canvas with the splash screen dimensions
  const iconSize = Math.min(width, height) * 0.3; // Icon takes 30% of smallest dimension

  // Create background
  const background = await sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
    }
  })
  .png()
  .toBuffer();

  // Resize SVG icon
  const icon = await sharp(inputSvg)
    .resize(Math.round(iconSize), Math.round(iconSize))
    .toBuffer();

  // Composite icon on background
  await sharp(background)
    .composite([{
      input: icon,
      top: Math.round((height - iconSize) / 2),
      left: Math.round((width - iconSize) / 2)
    }])
    .toFile(outputPath);

  console.log(`Generated ${name}`);
}

async function generateAllSplashScreens() {
  try {
    console.log('Generating iOS splash screens...');
    for (const size of iosSplashScreens) {
      await generateSplashScreen(size);
    }

    console.log('\nGenerating Android splash screens...');
    for (const size of androidSplashScreens) {
      await generateSplashScreen(size);
    }

    console.log('\nAll splash screens generated successfully!');
  } catch (error) {
    console.error('Error generating splash screens:', error);
  }
}

generateAllSplashScreens();
