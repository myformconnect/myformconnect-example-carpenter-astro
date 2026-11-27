const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgOverlay = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A1B19" stop-opacity="0.94" />
      <stop offset="45%" stop-color="#232522" stop-opacity="0.88" />
      <stop offset="100%" stop-color="#232522" stop-opacity="0.65" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#grad)" />
  
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#A4774D" stroke-width="2" stroke-opacity="0.5" rx="4" />

  <rect x="80" y="90" width="5" height="56" fill="#A4774D" rx="2" />

  <text x="100" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="700" fill="#C39A70" letter-spacing="4">OAKLINE WORKSHOP</text>
  <text x="100" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="500" fill="#D9D5CD" letter-spacing="2">PORTLAND, OR • FINE WOODWORKING STUDIO</text>

  <text x="80" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="400" fill="#FFFFFF">Built with purpose.</text>
  <text x="80" y="345" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="400" fill="#C39A70">Crafted to last.</text>

  <text x="80" y="415" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="21" font-weight="400" fill="#EAE6DF">Bespoke Furniture • Kitchen Cabinetry • Fitted Wardrobes • Architectural Joinery</text>

  <line x1="80" y1="470" x2="1120" y2="470" stroke="#D9D5CD" stroke-opacity="0.25" stroke-width="1" />
  
  <text x="80" y="525" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="17" font-weight="600" fill="#FFFFFF">https://oaklineworkshop.vercel.app</text>
  <text x="1120" y="525" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" fill="#C39A70">Handcrafted Hardwood • Sustainable Forestry</text>
</svg>
`);

const inputImage = path.join(__dirname, '..', 'public', 'images', 'Custom_Furniture.jpg');
const outputImage = path.join(__dirname, '..', 'public', 'images', 'og-image.jpg');

sharp(inputImage)
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .composite([{ input: svgOverlay, blend: 'over' }])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outputImage)
  .then((info) => {
    console.log('Successfully created OG image:', outputImage, info);
  })
  .catch((err) => {
    console.error('Error generating OG image:', err);
    process.exit(1);
  });
