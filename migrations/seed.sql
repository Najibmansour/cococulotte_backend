ALTER TABLE products
ADD CONSTRAINT uq_products_name_collection_type
UNIQUE (name, collection_slug, type_slug);

INSERT INTO product_types (slug, title) VALUES
('undies', 'Undies')
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title;

INSERT INTO collections (slug, title, header_image, description) VALUES
('summer-2024', 'Forgotten Valentines', 'https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/64b69360-44c4-4dba-a24c-2b13876e6808-IMG_8278.jpg', 'sold out'),
('xmas-25', 'Never Alone on Christmas', 'https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/8bbc5255-c24f-482a-83e7-cfbb9f651aa7-WhatsApp_Image_2025-12-26_at_1.58.10_PM.jpeg', 'newest drop'),
('winter-dreams', 'The Pilot', 'https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/b734fe0d-9b77-45cf-bdc9-78149194d689-WhatsApp_Image_2025-12-26_at_4.00.06_PM.jpeg', 'sold out'),
('vltns-26', 'VLTNS 26', 'https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/02c3fae8-e46f-4d1b-8b44-d6d936b43f01-1000388118.jpg', 'vltns 26')
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    header_image = EXCLUDED.header_image,
    description = EXCLUDED.description;


INSERT INTO products (
  name, price, collection_slug, type_slug,
  image_urls, quantity, colors, has_quantity, description, availability
) VALUES
(
  'Naughty & Nice', 15.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/c73b1eb4-1d6c-4da0-b981-897f8871af1e-CocoCulotte-107.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/94567948-dddf-4fbf-89d9-8668342a5afb-CocoCulotte-106.png}'), ','),
  1,
  '[{"hex": "#d71212", "name": "red"}]'::jsonb,
  true,
  'S-M . (flexible fit) . white embroidery / red patch on red . lace . bikini cut',
  'available'::availability_status
),
(
  'Snow Crush', 15.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/0ebcf041-2e8b-4829-ac57-c4536d83429e-CocoCulotte-105.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/a81087dc-f11d-4ffd-9755-4dd5a7392142-CocoCulotte-106.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/465ba28c-636f-4386-b34e-b6e877520865-CocoCulotte-50.jpg}'), ','),
  1,
  '[{"hex": "#db0e0e", "name": "red"}]'::jsonb,
  true,
  'S-M . (flexible fit) . white embroidery on red . lace . bikini cut',
  'available'::availability_status
),
(
  'Angel', 20.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/3fb72c23-5c4a-41da-b02a-94956a084e6e-CocoCulotte-97.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/5de09c94-e791-482c-8c2d-c0b4b955dde7-CocoCulotte-98.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/d281af2e-ddc3-4d4a-9a02-cb5b50f6ac88-CocoCulotte-25.jpg}'), ','),
  0,
  '[{"hex": "#ed0a0a", "name": "red"}]'::jsonb,
  true,
  'S . (flexible fit) . off-white embroidery on red . lace . thong cut',
  'out_of_stock'::availability_status
),
(
  'Star Girl', 20.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/651ef014-4ac3-4223-b90b-558e01447149-CocoCulotte-95.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/27873702-aa03-4120-b8ac-498618724fa5-CocoCulotte-96.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/59526a07-72d8-493e-a23d-91a9236947f3-CocoCulotte-10.jpg}'), ','),
  1,
  '[{"hex": "#000000", "name": "black"}]'::jsonb,
  true,
  'S-M .flexible fit . gold embroidery on black . cotton and lace . thong cut',
  'available'::availability_status
),
(
  'Sugar Rush', 20.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/75110656-09e3-407e-9f9d-9794e603af81-CocoCulotte-93__1_.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/488b3328-48e1-4f80-9abb-4c339da76fbb-CocoCulotte-94.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/17bdf803-2106-427e-9195-2e7385cae43c-CocoCulotte-41.jpg}'), ','),
  1,
  '[{"hex": "#f8f8f8", "name": "white"}]'::jsonb,
  true,
  'S-M . (flexible fit) . baby blue embroidery on white . mesh and lace . G-string cut',
  'available'::availability_status
),
(
  'Candy Ride', 20.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/013dec67-fbd7-4f1b-8216-d1ea72cc0bcd-CocoCulotte-85.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/b3c6352a-bb6e-4bff-b8ab-c93049be9391-CocoCulotte-54.jpg,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/b206600d-d84e-4d13-abf0-2a297663c32a-CocoCulotte-94.png}'), ','),
  0,
  '[{"hex": "#ffffff", "name": "white"}]'::jsonb,
  true,
  'S-M . (flexible fit) . red embroidery on white . mesh and lace . G-string cut',
  'out_of_stock'::availability_status
),
(
  'Forbidden Fruit', 20.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/8561b0c6-8181-4791-8ffc-6a9771bbdf18-CocoCulotte-87.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/f7d6cc95-8354-43b4-965e-10d93fa7512f-CocoCulotte-18.jpg,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/cee7f7d7-9b96-4386-914c-2eb23cd96149-CocoCulotte-88.png}'), ','),
  1,
  '[{"hex": "#000000", "name": "black"}]'::jsonb,
  true,
  'M . (flexible fit) . white embroidery on black . lace . boyshorts cut',
  'available'::availability_status
),
(
  'Love Bites', 12.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/0869d97b-98ec-4483-acf1-09c7059f678e-CocoCulotte-89.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/d95ecbdc-3fcc-4f52-b255-0249990ef4d1-CocoCulotte-102.png}'), ','),
  1,
  '[{"hex": "#000000", "name": "black"}]'::jsonb,
  true,
  'S . red embroidery on black . cotton . bikini cut',
  'available'::availability_status
),
(
  'Frozen Kisses', 12.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/c9704803-e7ff-4d5e-a22f-17cb6b385347-CocoCulotte-101.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/529a324e-b78a-41c9-8ba0-447eb55d0fbf-CocoCulotte-102.png}'), ','),
  1,
  '[{"hex": "#000000", "name": "black"}]'::jsonb,
  true,
  'S . lilac embroidery on black . cotton . bikini cut',
  'available'::availability_status
),
(
  'Lost Toy', 20.00, 'summer-2024', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/5d040ea1-ea63-4090-891f-2e966c14d1c1-CocoCulotte-91__1_.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/e871ee74-c842-4fff-bed2-a44e843a7133-CocoCulotte-92.png}'), ','),
  1,
  '[{"hex": "#c80f0f", "name": "red"}]'::jsonb,
  true,
  'S-M . (flexible fit) . white embroidery on red . cotton . thong cut',
  'available'::availability_status
),
(
  'Ceci n''est pas une Culotte', 20.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/5a8174b7-ea44-4e53-8a2e-6b0996a8eb21-CocoCulotte-84.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/b94ac961-f981-448e-8e17-59a3daaf443e-CocoCulotte-65.jpg}'), ','),
  0,
  '[{"hex": "#ffffff", "name": "white"}]'::jsonb,
  true,
  'S . red embroidery on white . lace . boyshorts cut',
  'available'::availability_status
),
(
  'Snow Angel', 22.00, 'xmas-25', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/76d59da2-6975-4041-affe-b84605c7f6d0-New_Project__3_.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/06cf2c9f-0818-45f5-990c-434dea24bd80-CocoCulotte-1.jpg,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/e75ba01e-f983-4638-96a7-c94511821f1e-CocoCulotte-104__1_.png}'), ','),
  1,
  '[{"hex": "#ffffff", "name": "white"}]'::jsonb,
  true,
  'S-M . (flexible fit) . burgundy embroidery on white . cotton and lace . thong cut',
  'available'::availability_status
),
(
  'bon appetit', 15.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/b349dbd3-5497-4492-ba62-1e217656057c-_RIF4081.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/df49fe0f-6a31-4765-8f91-569e6e6a4d60-_RIF4104.png}'), ','),
  1,
  '[{"hex": "#fffbfb", "name": "white"}]'::jsonb,
  true,
  'S-M ( flexible fit) . Red embroidery from the back on white . Lace and cotton . Thong',
  'available'::availability_status
),
(
  'Mini Ball Charm', 25.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/82eb408c-645b-4851-aecc-f15cea5a3110-_RIF4117.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/52e948dc-37b8-49c3-87a0-a4957f754580-_RIF4114.png}'), ','),
  1,
  '[{"hex": "#f9d6d6", "name": "pink"}, {"hex": "#000000", "name": "black"}]'::jsonb,
  true,
  'S-M ( flexible fit) . Silver chain , mini ball charm on black and pink . Lace and cotton . G-string',
  'available'::availability_status
),
(
  '3 Hearts charms', 25.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/663dcec4-6fb8-4880-bc0a-7e435d030432-_RIF4119.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/7a1a310e-a6d1-4ff2-8c09-09c86210ca3f-_RIF4113.png}'), ','),
  1,
  '[{"hex": "#f8dede", "name": "pink"}]'::jsonb,
  true,
  'S-M ( flexible fit) . Silver Chain, hearts charms on pink . Lace and cotton . G-string',
  'available'::availability_status
),
(
  'Heart n Key charms', 22.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/5ed4c71c-c4fc-43ab-9b56-cbb8638ca12e-_RIF4115.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/e35eb3b5-ce4f-4f1d-9495-fcef830b94ec-_RIF4111.png}'), ','),
  1,
  '[{"hex": "#fae3e3", "name": "pink"}]'::jsonb,
  true,
  'S-M ( flexible fit) . Sided silver chains, heart and key charms on pink. Lace and cotton . Thong',
  'available'::availability_status
),
(
  'ur fav snack <3', 15.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/3cfff1d2-aeda-4bad-bf88-209a71a0590e-_RIF4121.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/71dfa94e-1ec3-4b64-8e82-66bff0984690-_RIF4109.png}'), ','),
  1,
  '[{"hex": "#e81049", "name": "magenta"}]'::jsonb,
  true,
  'S-M ( flexible fit) . pink embroidery on magenta . Cotton . Thong',
  'available'::availability_status
),
(
  'Bunny is a rider', 12.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/11472b10-b0ad-4e3d-9c02-46248b288b0f-_RIF4127.png}'), ','),
  1,
  '[{"hex": "#ffffff", "name": "white"}]'::jsonb,
  true,
  'XS-S .pink embroidery on white . Lace . Boyshorts',
  'available'::availability_status
),
(
  'closer', 15.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/fec0b6e3-6b7b-47a1-8d99-dd76249e6e69-_RIF4130.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/e0c1ea8d-d3c3-4f5f-ba47-817af01d9c54-_RIF4108.png}'), ','),
  1,
  '[{"hex": "#000000", "name": "black"}]'::jsonb,
  true,
  'S . fushia embroidery on black . Lace and cotton . G-string',
  'available'::availability_status
),
(
  'Pretty Sinner', 20.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/4da60313-ff8b-4940-bd98-6c3d67b60c83-_RIF4122.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/1deec35f-159f-4ada-b34b-4bf3d1e61210-_RIF4110.png}'), ','),
  1,
  '[{"hex": "#ffffff", "name": "white"}]'::jsonb,
  true,
  'M (flexible fit) . Red embroidery on white with black polka dots. Lace and cotton . Thong',
  'available'::availability_status
),
(
  'Sugar High', 20.00, 'vltns-26', 'undies',
  string_to_array(trim(both '{}' from '{https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/42d9d552-7b59-48b5-86c8-b88c91665097-_RIF4125.png,https://pub-03e9107bd8694d868798de10b37b2a34.r2.dev/images/ff1d53a5-ac7c-45e7-ab13-849da2398c79-_RIF4107.png}'), ','),
  1,
  '[{"hex": "#ffffff", "name": "white"}]'::jsonb,
  true,
  'S-M (flexible fit) . Fushia embroidery on white . Cotton . G-string',
  'available'::availability_status
)
ON CONFLICT (name, collection_slug, type_slug) DO UPDATE
SET price = EXCLUDED.price,
    image_urls = EXCLUDED.image_urls,
    quantity = EXCLUDED.quantity,
    colors = EXCLUDED.colors,
    has_quantity = EXCLUDED.has_quantity,
    description = EXCLUDED.description,
    availability = EXCLUDED.availability,
    updated_at = now();



SELECT setval(
  pg_get_serial_sequence('products','id'),
  (SELECT COALESCE(MAX(id), 1) FROM products),
  true
);
