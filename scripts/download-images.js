const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const BASE_URL = "https://api.pexels.com/v1/search";
const OUTPUT_ROOT = path.join(process.cwd(), "public", "images");
const API_DELAY_MS = 300;
const MIN_WIDTH_PX = 1200;

const force = process.argv.includes("--force") || process.argv.includes("-f");
const apiKey = process.argv[2] || process.env.PEXELS_API_KEY;

if (!apiKey) {
  console.error("Usage: node scripts/download-images.js YOUR_PEXELS_API_KEY");
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isProductShot(outputPath) {
  // Treat the "-main" variants as product shots that should be square.
  // Example: shop/cup-organizer-main.jpg
  return outputPath.startsWith("shop/") && outputPath.endsWith("-main.jpg");
}

function getOrientation(outputPath) {
  return isProductShot(outputPath) ? "square" : "landscape";
}

const IMAGES = [
  // HERO
  {
    output: "hero/hero-main.jpg",
    query: "organized living room bright airy",
  },
  {
    output: "hero/transformation-before.jpg",
    query: "cluttered messy room",
  },
  {
    output: "hero/transformation-after.jpg",
    query: "clean organized minimal room",
  },

  // ROOMS (room navigator)
  {
    output: "rooms/kitchen.jpg",
    query: "organized kitchen minimal Scandinavian",
  },
  { output: "rooms/living-room.jpg", query: "bright minimal living room" },
  { output: "rooms/bedroom.jpg", query: "organized bedroom minimal white" },
  {
    output: "rooms/home-office.jpg",
    query: "clean minimal home office desk",
  },
  { output: "rooms/moving.jpg", query: "moving boxes organized packing" },
  {
    output: "rooms/whole-home.jpg",
    query: "bright Scandinavian home interior",
  },

  // SERVICES (before/after)
  {
    output: "services/decluttering-before-1.jpg",
    query: "cluttered bedroom messy",
  },
  {
    output: "services/decluttering-after-1.jpg",
    query: "clean organized bedroom minimal",
  },
  {
    output: "services/whole-house-before-1.jpg",
    query: "messy living room cluttered",
  },
  {
    output: "services/whole-house-after-1.jpg",
    query: "organized living room minimal",
  },
  {
    output: "services/moving-before-1.jpg",
    query: "disorganized boxes moving",
  },
  {
    output: "services/moving-after-1.jpg",
    query: "neatly packed boxes organized",
  },
  {
    output: "services/shelving-before-1.jpg",
    query: "empty wall messy storage",
  },
  {
    output: "services/shelving-after-1.jpg",
    query: "organized shelves minimal storage",
  },
  {
    output: "services/paperwork-before-1.jpg",
    query: "messy papers documents pile",
  },
  {
    output: "services/paperwork-after-1.jpg",
    query: "organized files folders office",
  },
  {
    output: "services/office-before-1.jpg",
    query: "cluttered office desk messy",
  },
  {
    output: "services/office-after-1.jpg",
    query: "clean organized office desk",
  },
  {
    output: "services/coaching-hero.jpg",
    query: "woman video call laptop home",
  },
  {
    output: "services/staging-before-1.jpg",
    query: "empty unfurnished room",
  },
  {
    output: "services/staging-after-1.jpg",
    query: "beautifully staged room interior",
  },
  {
    output: "services/space-planning-hero.jpg",
    query: "interior design floor plan measuring",
  },
  {
    output: "services/packing-before-1.jpg",
    query: "unorganized items to pack",
  },
  {
    output: "services/packing-after-1.jpg",
    query: "neatly stacked organized boxes",
  },

  // SHOP
  { output: "shop/shop-hero.jpg", query: "organizing products flatlay minimal" },
  {
    output: "shop/cup-organizer-main.jpg",
    query: "cup organizer white background",
  },
  { output: "shop/cup-organizer-lifestyle.jpg", query: "cup organizer kitchen" },
  {
    output: "shop/fruit-holder-main.jpg",
    query: "fruit bowl white background",
  },
  {
    output: "shop/fruit-holder-lifestyle.jpg",
    query: "fruit bowl kitchen counter",
  },
  {
    output: "shop/fridge-organizer-main.jpg",
    query: "fridge organizer white background",
  },
  {
    output: "shop/fridge-organizer-lifestyle.jpg",
    query: "organized fridge interior",
  },

  // ABOUT
  {
    output: "about/faith-working.jpg",
    query: "woman organizing home professional",
  },
  {
    output: "about/faith-with-client.jpg",
    query: "professional woman client home",
  },
  {
    output: "about/office-exterior.jpg",
    query: "small business office exterior Nairobi",
  },
  {
    output: "about/office-interior.jpg",
    query: "small organized office interior",
  },

  // BLOG (cover images)
  {
    output: "blog/nairobi-kitchen-organize.jpg",
    query: "kitchen organization tips",
  },
  {
    output: "blog/runda-transformation.jpg",
    query: "home transformation before after",
  },
  {
    output: "blog/kenya-products.jpg",
    query: "home organizing products flatlay",
  },
  {
    output: "blog/moving-nairobi.jpg",
    query: "moving house boxes packed",
  },
  {
    output: "blog/signs-organizer.jpg",
    query: "cluttered home need organizing",
  },
  {
    output: "blog/home-office-nairobi.jpg",
    query: "home office setup minimal",
  },

  // CONTACT
  {
    output: "contact/membley-location.jpg",
    query: "petrol station shopping centre Kenya",
  },
];

async function downloadBinary(url, outputPath) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Download failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await fsp.mkdir(path.dirname(outputPath), { recursive: true });
  await fsp.writeFile(outputPath, buf);
}

async function fetchFirstPexelsPhotoSrcLarge({ query, orientation }) {
  const url = new URL(BASE_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("size", "large");
  url.searchParams.set("per_page", "1");
  url.searchParams.set("page", "1");

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pexels API error (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const photo = data?.photos?.[0];
  if (!photo?.src?.large) {
    throw new Error(`No src.large found for query="${query}"`);
  }

  if (photo?.width && photo.width < MIN_WIDTH_PX) {
    console.warn(
      `Warning: first result width ${photo.width}px < ${MIN_WIDTH_PX}px for query="${query}"`
    );
  }

  return photo.src.large;
}

(async () => {
  console.log(`Downloading ${IMAGES.length} placeholder images to ${OUTPUT_ROOT}`);

  for (let i = 0; i < IMAGES.length; i++) {
    const { output, query } = IMAGES[i];
    const orientation = getOrientation(output);
    const outputPath = path.join(OUTPUT_ROOT, output);

    try {
      if (!force && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
        console.log(`✓ Skipped existing ${output}`);
        continue;
      }

      const imgUrl = await fetchFirstPexelsPhotoSrcLarge({ query, orientation });
      await downloadBinary(imgUrl, outputPath);
      console.log(`✓ Saved ${output}`);
    } catch (err) {
      console.error(`✗ Failed ${output}: ${err?.message || String(err)}`);
    }

    // Respect the Pexels API by spacing out search requests.
    if (i < IMAGES.length - 1) {
      await sleep(API_DELAY_MS);
    }
  }

  console.log("Done.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

