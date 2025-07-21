const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Splash screen sizes for different devices
const splashScreens = [
  // iPhone
  { width: 1170, height: 2532, name: 'splash-1170x2532.png' }, // iPhone 12/13/14 Pro
  { width: 1125, height: 2436, name: 'splash-1125x2436.png' }, // iPhone X/XS/11 Pro
  { width: 1242, height: 2688, name: 'splash-1242x2688.png' }, // iPhone XS Max/11 Pro Max
  { width: 828, height: 1792, name: 'splash-828x1792.png' },   // iPhone XR/11
  { width: 750, height: 1334, name: 'splash-750x1334.png' },   // iPhone 6/7/8
  { width: 1242, height: 2208, name: 'splash-1242x2208.png' }, // iPhone 6/7/8 Plus
  
  // iPad
  { width: 2048, height: 2732, name: 'splash-2048x2732.png' }, // iPad Pro 12.9"
  { width: 1668, height: 2388, name: 'splash-1668x2388.png' }, // iPad Pro 11"
  { width: 1668, height: 2224, name: 'splash-1668x2224.png' }, // iPad Pro 10.5"
  { width: 1536, height: 2048, name: 'splash-1536x2048.png' }, // iPad Mini, Air
  
  // Landscape versions
  { width: 2732, height: 2048, name: 'splash-2732x2048.png' }, // iPad Pro 12.9" landscape
  { width: 2388, height: 1668, name: 'splash-2388x1668.png' }, // iPad Pro 11" landscape
  { width: 2224, height: 1668, name: 'splash-2224x1668.png' }, // iPad Pro 10.5" landscape
  { width: 2048, height: 1536, name: 'splash-2048x1536.png' }, // iPad landscape
];

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function generateBaseIcon() {
  const iconSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="512" height="512" rx="128" fill="#000000"/>
      
      <!-- Thread/Timeline representation -->
      <g>
        <!-- Central vertical thread -->
        <line x1="256" y1="80" x2="256" y2="432" stroke="#ffffff" stroke-width="4" opacity="0.3"/>
        
        <!-- Milestone nodes -->
        <circle cx="256" cy="128" r="24" fill="#3b82f6" stroke="#ffffff" stroke-width="4"/>
        <circle cx="256" cy="256" r="32" fill="#8b5cf6" stroke="#ffffff" stroke-width="4"/>
        <circle cx="256" cy="384" r="24" fill="#10b981" stroke="#ffffff" stroke-width="4"/>
        
        <!-- Connecting lines -->
        <path d="M 232 128 Q 180 192 232 256" fill="none" stroke="#3b82f6" stroke-width="3" opacity="0.6"/>
        <path d="M 280 256 Q 330 320 280 384" fill="none" stroke="#8b5cf6" stroke-width="3" opacity="0.6"/>
        
        <!-- M letter integration -->
        <text x="256" y="280" text-anchor="middle" font-family="system-ui, -apple-system" font-size="72" font-weight="bold" fill="#ffffff" opacity="0.9">M</text>
      </g>
    </svg>
  `;
  
  return Buffer.from(iconSvg);
}

async function generateIcons() {
  try {
    const iconsDir = path.join(__dirname, '../public/icons');
    const splashDir = path.join(__dirname, '../public/splash');
    
    // Ensure directories exist
    await ensureDirectoryExists(iconsDir);
    await ensureDirectoryExists(splashDir);
    
    // Generate base icon SVG
    const baseIcon = await generateBaseIcon();
    const tempSvgPath = path.join(__dirname, 'temp-icon.svg');
    await fs.writeFile(tempSvgPath, baseIcon);
    
    console.log('Generating app icons...');
    
    // Generate icons in different sizes
    for (const size of iconSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(tempSvgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${size}x${size} icon`);
    }
    
    // Also generate Apple touch icons
    const appleSizes = [180, 167, 152, 120];
    for (const size of appleSizes) {
      const outputPath = path.join(iconsDir, `apple-touch-icon-${size}x${size}.png`);
      
      await sharp(tempSvgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated Apple touch icon ${size}x${size}`);
    }
    
    // Generate favicon
    await sharp(tempSvgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon.png'));
    console.log('✓ Generated favicon');
    
    // Generate splash screens
    console.log('\nGenerating splash screens...');
    
    for (const splash of splashScreens) {
      const outputPath = path.join(splashDir, splash.name);
      
      // Create splash screen with centered icon
      const iconSize = Math.min(splash.width, splash.height) * 0.3;
      
      await sharp({
        create: {
          width: splash.width,
          height: splash.height,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background
        }
      })
      .composite([
        {
          input: await sharp(tempSvgPath)
            .resize(Math.round(iconSize), Math.round(iconSize))
            .png()
            .toBuffer(),
          gravity: 'centre'
        }
      ])
      .png()
      .toFile(outputPath);
      
      console.log(`✓ Generated ${splash.name}`);
    }
    
    // Generate shortcut icons
    console.log('\nGenerating shortcut icons...');
    
    // Add icon
    const addIconSvg = `
      <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <rect width="96" height="96" rx="24" fill="#3b82f6"/>
        <path d="M48 24 L48 72 M24 48 L72 48" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `;
    
    await fs.writeFile(path.join(__dirname, 'temp-add-icon.svg'), addIconSvg);
    await sharp(path.join(__dirname, 'temp-add-icon.svg'))
      .resize(96, 96)
      .png()
      .toFile(path.join(iconsDir, 'add-icon-96x96.png'));
    
    // Timeline icon
    const timelineIconSvg = `
      <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <rect width="96" height="96" rx="24" fill="#8b5cf6"/>
        <line x1="48" y1="20" x2="48" y2="76" stroke="#ffffff" stroke-width="3"/>
        <circle cx="48" cy="30" r="6" fill="#ffffff"/>
        <circle cx="48" cy="48" r="6" fill="#ffffff"/>
        <circle cx="48" cy="66" r="6" fill="#ffffff"/>
      </svg>
    `;
    
    await fs.writeFile(path.join(__dirname, 'temp-timeline-icon.svg'), timelineIconSvg);
    await sharp(path.join(__dirname, 'temp-timeline-icon.svg'))
      .resize(96, 96)
      .png()
      .toFile(path.join(iconsDir, 'timeline-icon-96x96.png'));
    
    console.log('✓ Generated shortcut icons');
    
    // Clean up temporary files
    await fs.unlink(tempSvgPath);
    await fs.unlink(path.join(__dirname, 'temp-add-icon.svg'));
    await fs.unlink(path.join(__dirname, 'temp-timeline-icon.svg'));
    
    console.log('\n✨ All PWA assets generated successfully!');
    
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

generateIcons();