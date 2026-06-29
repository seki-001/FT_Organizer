-- Seed reference data for Faith The Organizer (run after migrations)
-- Products: import via scripts or Supabase dashboard — catalog is large; start with featured items below.

INSERT INTO public.coupons (code, type, value, min_order, usage_limit, uses, active, expires_at)
VALUES
  ('FIRSTORDER', 'percentage', 10, 0, 100, 0, TRUE, '2026-12-31'),
  ('FAITH20', 'percentage', 20, 5000, 50, 0, TRUE, '2026-06-30'),
  ('MARCH500', 'fixed', 500, 2000, 200, 0, TRUE, '2026-03-31')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.blog_posts (slug, title, excerpt, content, cover_image, category, author, published_at, read_time, tags, published)
VALUES
  (
    'organize-kitchen-nairobi-apartment',
    'How to Organize Your Kitchen in a Nairobi Apartment',
    'Small kitchens are the norm in Nairobi apartments — but with the right systems and products, you can have a beautifully organized kitchen that works hard for you every day.',
    '## Why This Matters in Nairobi Homes\n\nMost Nairobi homes were not built with storage in mind.',
    '/images/site/scene-kitchen.png',
    'home-tips',
    'Faith The Organizer',
    '2024-12-10',
    6,
    ARRAY['kitchen', 'apartment', 'nairobi', 'small-spaces'],
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (slug, name, description, price, category, images, in_stock, stock_count, rating, review_count, featured)
VALUES
  (
    'acrylic-curved-basket-lidless',
    'Acrylic Curved Basket Lidless',
    'Keep your baskets organised and clutter-free.',
    900,
    'baskets',
    '["/images/site/img-02.png"]'::jsonb,
    TRUE,
    6,
    4.4,
    44,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (slug, name, description, price, sale_price, category, images, in_stock, stock_count, rating, review_count, featured)
VALUES
  (
    'stackable-fridge-containers-set',
    'Stackable Fridge Containers Set',
    'Keep your fridge organised with clear, stackable containers.',
    2800, 2400, 'fridge',
    '["/images/site/img-18.png"]'::jsonb,
    TRUE, 12, 4.7, 28, TRUE
  ),
  (
    'bamboo-pantry-jars-set-of-4',
    'Bamboo Pantry Jars Set of 4',
    'Airtight pantry jars with bamboo lids for dry goods.',
    3200, NULL, 'pantry',
    '["/images/site/img-11.png"]'::jsonb,
    TRUE, 8, 4.5, 19, TRUE
  ),
  (
    'closet-divider-set',
    'Closet Divider Set',
    'Adjustable shelf dividers for wardrobes and closets.',
    1500, NULL, 'closet-bedroom',
    '["/images/site/img-28.png"]'::jsonb,
    TRUE, 15, 4.3, 12, FALSE
  ),
  (
    'under-sink-organiser',
    'Under Sink Organiser',
    'Expandable under-sink storage for bathroom or kitchen.',
    2100, 1800, 'bathroom',
    '["/images/site/img-20.png"]'::jsonb,
    TRUE, 10, 4.6, 22, TRUE
  ),
  (
    'desk-organiser-tray-set',
    'Desk Organiser Tray Set',
    'Minimal trays for stationery, cables, and desk clutter.',
    1200, NULL, 'stationery',
    '["/images/site/img-19.png"]'::jsonb,
    TRUE, 20, 4.2, 8, FALSE
  )
ON CONFLICT (slug) DO NOTHING;

-- Promote an admin after first sign-up (replace email):
-- UPDATE public.profiles SET role = 'admin' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'faith@organizer.co.ke'
-- );
