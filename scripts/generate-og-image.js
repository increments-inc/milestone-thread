const sharp = require('sharp');
const path = require('path');

async function generateOGImage() {
  const width = 1200;
  const height = 630;

  // Create SVG content for the OG image
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Black background -->
      <rect width="100%" height="100%" fill="#000000"/>
      
      <!-- Main heading -->
      <text x="100" y="140" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
            fill="white" text-anchor="start">
        We Mourn.
      </text>
      
      <!-- Call to action line 1 -->
      <text x="100" y="220" font-family="Arial, sans-serif" font-size="48" font-weight="400" 
            fill="white" text-anchor="start">
        Let's come forward to save the children
      </text>
      
      <!-- Call to action line 2 -->
      <text x="100" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="400" 
            fill="white" text-anchor="start">
        with Blood &amp; Skin Donation
      </text>
      
      <!-- Call to action line 3 -->
      <text x="100" y="340" font-family="Arial, sans-serif" font-size="48" font-weight="400" 
            fill="white" text-anchor="start">
        and Missing Report.
      </text>
      
      <!-- Black mourning ribbon positioned at right side (5x bigger) -->
      <g transform="translate(800, 100) scale(1.0)">
        <path d="m416.4 431.8c-109.3-119.2-178.9-204.3-218.6-267.7-24.8-39.5-38.3-70.9-41.2-96.7-19.1 34.4-29.6 72.7-30.7 112.6-.4 14.8 11.4 49 70.1 127.8 40.9 54.9 91.9 114.7 129.1 158.4 15.8 18.6 29.1 34.1 38.6 45.8zm-171.5-34.1c-20.5 24.7-40.3 48-57.8 68.5-15.8 18.6-29.1 34.1-38.6 45.8l-52.8-80.2c36.4-39.9 52.7-59.8 81.4-94.7 3.2-3.9 6.6-8 10.1-12.3 17.4 23.2 37 47.7 57.7 72.9zm11.1-305.2c-23.8 0-47.3 7.2-67.1 20.3-15.5-32.9-19.4-57.6-12-76.3 19.8-23.2 48.5-36.5 79.1-36.5s59.3 13.3 79.1 36.5c4.4 11.8 2.8 33.5-16.9 73.2-18.8-11.3-40.2-17.2-62.2-17.2zm7.6 134.9c35.3-48.1 60.6-88.7 75.1-120.7 7.5-16.5 12.3-30.9 14.4-43.5 20.6 35.4 32 75.3 33.1 116.9.4 14.2-10.5 46.5-64 119.5-22.2-26.3-41.7-50.3-58.6-72.2z" 
              fill="#333333" opacity="0.7"/>
      </g>
      
      <!-- Service icons - 100px each, no alterations -->
      <svg x="100" y="400" width="72" height="72" viewBox="0 0 474.136 474.136">
        <!-- Blood donation icon -->
        <g>
          <path style="fill:#D80027;" d="M201.068,466.136c61.856,0,112-50.144,112-112c0-61.856-112-176-112-176s-112,114.144-112,176
               C89.068,415.992,139.212,466.136,201.068,466.136z M193.068,418.136c-35.33-0.04-63.96-28.67-64-64
               C129.108,389.466,157.738,418.096,193.068,418.136z"/>
          <path style="fill:#D80027;" d="M385.068,138.136c0-16.936-27.752-61.048-64-104.408c-34.4,41.248-64,86.152-64,104.408
               c0,35.346,28.654,64,64,64S385.068,173.482,385.068,138.136z"/>
          <path style="fill:#D80027;" d="M209.068,67.328c-1.6-6.296-11.248-25.448-32-53.784c-19.544,26.656-30.312,46.4-32,53.6
               c-0.049,17.673,14.239,32.039,31.912,32.088s32.039-14.239,32.088-31.912V67.328z"/>
        </g>
      </svg>
      
      <svg x="250" y="400" width="72" height="72" viewBox="0 0 512.002 512.002">
        <!-- Skin donation icon -->
        <g><g><path d="m7.502 235.288h496.81v213.484h-496.81z" fill="#fdb4ba"/><path d="m478.448 235.288h25.864v213.484h-25.864z" fill="#fe99a0"/><path d="m7.502 448.772h496.81v42.996h-496.81z" fill="#fd8087"/><path d="m478.448 448.772h25.864v42.996h-25.864z" fill="#fe646f"/><path d="m7.502 185.376h496.81v49.912h-496.81z" fill="#ffdfcf"/><path d="m478.448 185.376h25.864v49.912h-25.864z" fill="#ffcebf"/><path d="m504.312 152.284v33.092h-213.384l39.515-14.408c33.897-12.36 69.698-18.683 105.779-18.683h68.09z" fill="#ffeee6"/></g></g>
      </svg>
      
      <svg x="400" y="400" width="72" height="72" viewBox="0 0 682.66669 682.66669">
        <!-- Missing person icon -->
        <g id="g4326" transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)">
          <g id="g4328">
            <g id="g4330" clip-path="url(#clipPath4334)">
              <g id="g4336" transform="translate(385.9712,229.5806)">
                <path d="M 0,0 -91.799,35.551 -130.109,-6.745 -168.224,35.664 -260.218,0 c 0,0 -34.935,-14.362 -34.935,-54.188 l 0.001,-156.236 c 0,-6.429 5.211,-11.64 11.64,-11.64 H 23.294 c 6.428,0 11.641,5.211 11.641,11.64 V -54.188 C 34.935,-14.362 0,0 0,0"
                      style="fill:#e4eaf8;fill-opacity:1;fill-rule:nonzero;stroke:none"/>
              </g>
              <g id="g4376" transform="translate(368.2173,392.1294)">
                <path d="m 0,0 c 0,-62.052 -50.304,-112.355 -112.355,-112.355 -62.052,0 -112.355,50.303 -112.355,112.355 0,62.052 50.303,112.355 112.355,112.355 C -50.304,112.355 0,62.052 0,0"
                      style="fill:#e4eaf8;fill-opacity:1;fill-rule:nonzero;stroke:none"/>
              </g>
            </g>
          </g>
        </g>
      </svg>
      
      <!-- Bottom message -->
      <text x="100" y="520" font-family="Arial, sans-serif" font-size="32" font-weight="500" 
            fill="#cccccc" text-anchor="start">
        Together we can make a difference
      </text>
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
