import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const release = 'v32-google-seo-speed';
const baseUrl = 'https://ohgs.co.tz';

const pages = {
  'index.html': ['OHGS Hardware Arusha | Tools, Pumps & Equipment', 'Shop tools, water pumps, construction equipment and hardware from OHGS on Uhuru Road, Arusha. Ask for current stock and prices on WhatsApp.', '/'],
  'products.html': ['Hardware Products in Arusha | OHGS', 'Browse OHGS tools, pumps, workshop equipment, outdoor power products and construction supplies in Arusha. Check current stock and prices.', '/products'],
  'services.html': ['Hardware Supply Services in Arusha | OHGS', 'Get product guidance, WhatsApp ordering and site supply support from OHGS Hardware in Arusha for tools, pumps and construction equipment.', '/services'],
  'projects.html': ['Project Tools & Site Equipment in Arusha | OHGS', 'Find reliable tools, safety equipment and construction supplies for building and maintenance projects from OHGS Hardware in Arusha.', '/projects'],
  'gallery.html': ['OHGS Hardware Showroom Gallery | Arusha', 'See the OHGS Hardware showroom, tools, equipment and customer support in Arusha through real photos and videos.', '/gallery'],
  'promotions.html': ['Hardware Promotions & New Stock | OHGS Arusha', 'View current OHGS product highlights, new stock and hardware promotions in Arusha. Confirm availability and today’s price on WhatsApp.', '/promotions'],
  'about.html': ['About OHGS Hardware & General Supply | Arusha', 'Learn about OHGS Hardware & General Supply LTD, a local Arusha supplier of tools, pumps, equipment and construction materials.', '/about'],
  'contact.html': ['Contact OHGS Hardware in Arusha', 'Call or WhatsApp OHGS Hardware on 0689 528 193 for product advice, current stock and prices. Visit us on Uhuru Road, Arusha.', '/contact'],
  'cleaning-equipment.html': ['Pressure Washers & Cleaning Equipment | OHGS Arusha', 'Ask OHGS in Arusha about FERREX pressure washers and cleaning equipment for homes, workshops and professional jobs.', '/cleaning-equipment'],
  'construction-materials.html': ['Construction Equipment & Materials | OHGS Arusha', 'Find tamping rammers, compactors, road equipment and construction supplies at OHGS Hardware in Arusha.', '/construction-materials'],
  'outdoor-power.html': ['Outdoor Power Tools & Grass Trimmers | OHGS Arusha', 'Shop cordless grass trimmers and outdoor power equipment from OHGS Hardware in Arusha. Ask for current models, stock and price.', '/outdoor-power'],
  'water-systems.html': ['Water Pumps & Water Systems | OHGS Arusha', 'Find submersible pumps, engine-powered water pumps and water system equipment from OHGS Hardware in Arusha.', '/water-systems'],
  'workshop-equipment.html': ['Workshop Equipment & Air Compressors | OHGS Arusha', 'Shop air compressors and workshop equipment at OHGS Hardware in Arusha. Ask for the right size, current stock and price.', '/workshop-equipment'],
  'product-chainsaws.html': ['Chainsaws in Arusha | OHGS Hardware', 'Shop chainsaws and cutting equipment for landscaping, farming and site work from OHGS Hardware in Arusha.', '/product-chainsaws'],
  'product-compressors.html': ['EDON Air Compressors in Arusha | OHGS', 'Ask OHGS Hardware in Arusha about EDON air compressors for workshop, repair and site use, including current stock and prices.', '/product-compressors'],
  'product-construction-supply.html': ['EDON Road Cutter in Arusha | OHGS Hardware', 'Ask OHGS Hardware about the EDON ED-WLQ500 gasoline road cutter for road works and concrete cutting in Arusha.', '/product-construction-supply'],
  'product-diesel-pumps.html': ['Engine-Powered Water Pumps in Arusha | OHGS', 'Find engine-powered water pumps for construction, farming and water transfer from OHGS Hardware in Arusha.', '/product-diesel-pumps'],
  'product-hand-tools.html': ['Hand Tools & Accessories in Arusha | OHGS', 'Shop hand tools and accessories for repair, construction and workshop jobs from OHGS Hardware in Arusha.', '/product-hand-tools'],
  'product-power-tools.html': ['Power Tools in Arusha | OHGS Hardware', 'Shop drills, grinders, cutters and cordless power tools for construction and workshop work from OHGS Hardware in Arusha.', '/product-power-tools'],
  'product-pressure-washers.html': ['FERREX Pressure Washers in Arusha | OHGS', 'Ask OHGS Hardware in Arusha about FERREX pressure washers for vehicle, home, workshop and professional cleaning.', '/product-pressure-washers'],
  'product-water-pumps.html': ['Submersible Water Pumps in Arusha | OHGS', 'Shop submersible water pumps for tanks, wells and water transfer from OHGS Hardware in Arusha. Confirm the right model and price.', '/product-water-pumps'],
  'product-wood-boards.html': ['Plywood & Wood Boards in Arusha | OHGS', 'Ask OHGS Hardware in Arusha about plywood and wood boards for building, furniture, fit-out and workshop projects.', '/product-wood-boards']
};

function esc(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function dimensions() {
  const result = new Map();
  const files = fs.readdirSync(path.join(root, 'media'))
    .filter((name) => /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(name));
  for (const name of files) {
    try {
      const output = execFileSync('identify', ['-format', '%w %h', path.join(root, 'media', name)], { encoding: 'utf8' });
      const [width, height] = output.trim().split(/\s+/).map(Number);
      if (width > 0 && height > 0) result.set(`media/${name}`, { width, height });
    } catch {
      // A missing intrinsic size is non-fatal; the CSS aspect ratios still prevent layout jumps.
    }
  }
  return result;
}

const sizes = dimensions();

for (const [file, [title, description, urlPath]] of Object.entries(pages)) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/src="data:image\/[^"\s]+"\s+data-source="([^"]+)"/g, 'src="$1"');
  html = html.replaceAll('v31-final-light-mode-contrast', release);
  html = html.replaceAll('stable-launch-v31-final-light-mode-contrast', `stable-launch-${release}`);
  html = html.replaceAll('premium-2026-08-v31-final-light-mode-contrast', `premium-2026-10-${release}`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${esc(description)}">`);
  html = html.replace(/<meta\s+property="og:(?:title|site_name|image)"\s+content="[^"]*"\s*\/?\s*>/gi, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<meta\s+name="robots"[^>]*>/gi, '');
  html = html.replace(/<!-- OHGS SEO START -->[\s\S]*?<!-- OHGS SEO END -->/gi, '');
  html = html.replace(/<link\s+rel="preload"\s+as="image"[^>]*>/gi, '');

  html = html.replace(/<video\b([^>]*)>/gi, (tag, attrs) => {
    let cleaned = attrs
      .replace(/\s+preload="[^"]*"/gi, '')
      .replace(/\s+autoplay\b/gi, '')
      .replace(/\s+muted\b/gi, '')
      .replace(/\s+loop\b/gi, '');
    return `<video${cleaned} preload="none">`;
  });
  if (file === 'index.html') html = html.replace(/<video([^>]*)preload="none"/, '<video$1preload="metadata"');

  let firstContentImage = '';
  html = html.replace(/<img\b([^>]*?)>/gi, (tag, attrs) => {
    const src = (attrs.match(/\bsrc="([^"]+)"/i) || [])[1];
    if (!src) return tag;
    const size = sizes.get(src);
    let next = attrs;
    if (size && !/\bwidth="/i.test(next)) next += ` width="${size.width}"`;
    if (size && !/\bheight="/i.test(next)) next += ` height="${size.height}"`;
    const isLogo = src.includes('ohgs-header-pro-badge');
    if (isLogo) {
      next = next.replace(/\s+loading="lazy"/i, ' loading="eager"');
    } else if (src.startsWith('media/') && !firstContentImage) {
      firstContentImage = src;
      next = next.replace(/\s+loading="lazy"/i, ' loading="eager"');
      if (!/\bfetchpriority=/i.test(next)) next += ' fetchpriority="high"';
    } else if (src.startsWith('media/')) {
      next = next.replace(/\s+loading="eager"/i, ' loading="lazy"');
      if (!/\bloading=/i.test(next)) next += ' loading="lazy"';
      next = next.replace(/\s+fetchpriority="high"/i, '');
    }
    return `<img${next}>`;
  });

  const canonical = `${baseUrl}${urlPath}`;
  const pageImage = `${baseUrl}/${firstContentImage || 'media/ohgs-social-preview.png'}`;
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HardwareStore',
        '@id': `${baseUrl}/#store`,
        name: 'OHGS Hardware & General Supply LTD',
        legalName: 'Olotu Hardware & General Supply LTD',
        url: baseUrl,
        logo: `${baseUrl}/media/ohgs-header-pro-badge.svg`,
        image: `${baseUrl}/media/ohgs-social-preview.png`,
        telephone: '+255689528193',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Uhuru Road',
          addressLocality: 'Arusha',
          addressCountry: 'TZ'
        },
        sameAs: ['https://www.instagram.com/olotuhardware/']
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'OHGS Hardware',
        inLanguage: ['en', 'sw'],
        publisher: { '@id': `${baseUrl}/#store` }
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': `${baseUrl}/#website` },
        about: { '@id': `${baseUrl}/#store` },
        primaryImageOfPage: { '@type': 'ImageObject', url: pageImage },
        inLanguage: ['en', 'sw']
      }
    ]
  };
  if (file !== 'index.html') {
    pageSchema['@graph'].push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: title.replace(/ \|.*$/, ''), item: canonical }
      ]
    });
  }

  const preload = file === 'index.html'
    ? '\n<link rel="preload" as="image" href="media/ohgs-v19-staff-showroom-tour-poster.jpg" fetchpriority="high">'
    : '';
  const seo = `\n<!-- OHGS SEO START -->
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${canonical}">
<link rel="manifest" href="site.webmanifest">
<meta property="og:type" content="website">
<meta property="og:site_name" content="OHGS Hardware">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${pageImage}">
<meta property="og:image:alt" content="OHGS Hardware in Arusha">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${pageImage}">${preload}
<script type="application/ld+json">${JSON.stringify(pageSchema)}</script>
<!-- OHGS SEO END -->\n`;
  html = html.replace(/<\/head>/i, `${seo}</head>`);
  fs.writeFileSync(filePath, html);
}

const deployPath = path.join(root, 'deploy-test.html');
let deploy = fs.readFileSync(deployPath, 'utf8')
  .replace(/src="data:image\/[^"\s]+"\s+data-source="([^"]+)"/g, 'src="$1"')
  .replaceAll('v31-final-light-mode-contrast', release)
  .replace(/<meta\s+name="robots"[^>]*>/gi, '')
  .replace(/<\/head>/i, '<meta name="robots" content="noindex,nofollow,noarchive">\n</head>');
fs.writeFileSync(deployPath, deploy);

console.log(`Optimized ${Object.keys(pages).length} public pages for ${release}.`);
