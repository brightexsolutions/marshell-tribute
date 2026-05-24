-- ── Test seed data — 20 tributes + 20 contributions ─────────────────────
-- Run this ONLY in a development/staging environment.
-- Delete these records before going live, or simply skip this file.

-- ── Tributes ─────────────────────────────────────────────────────────────
INSERT INTO public.tributes (id, name, contact, message, is_anonymous, relationship, created_at) VALUES

(gen_random_uuid(), 'Wanjiru Kamau', 'wanjiru.k@gmail.com',
 'Marshell was one of the kindest people I have ever had the privilege of knowing. His laughter could fill an entire room, and his warmth never faded no matter how tough things got. Rest easy, my friend. You will always be in my heart.',
 false, 'Friend', now() - interval '15 days'),

(gen_random_uuid(), 'David Otieno', '+254722345678',
 'I worked alongside Marshell for six years and every single day he showed up with a smile and a willingness to help anyone who needed it. The office has not been the same since we lost him. We will carry his spirit forward in everything we do.',
 false, 'Colleague', now() - interval '13 days'),

(gen_random_uuid(), null, null,
 'Words cannot express how much Marshell meant to all of us. He was the kind of person who made you feel seen and valued just by being in the same room. May his soul rest in eternal peace.',
 true, null, now() - interval '12 days'),

(gen_random_uuid(), 'Aisha Mwangi', 'aisha.mwangi@yahoo.com',
 'Marshell, you were a brother to me even though we were not related by blood. Thank you for always being there during the difficult seasons of my life. I will miss your wisdom, your jokes, and your unwavering faith. Go well.',
 false, 'Close Friend', now() - interval '11 days'),

(gen_random_uuid(), 'Kipchoge Ngetich', '+254733456789',
 'A true gentleman and a man of integrity. Marshell never spoke ill of anyone and always found something good to say. The world is a little dimmer without him in it. Our deepest condolences to the family.',
 false, 'Neighbour', now() - interval '10 days'),

(gen_random_uuid(), 'Grace Adhiambo', null,
 'I met Marshell at a community fundraiser three years ago and was immediately struck by his generosity. He gave without expecting anything in return. That spirit of giving is what I will remember most. Rest well, Marshell.',
 false, 'Community Member', now() - interval '9 days'),

(gen_random_uuid(), null, null,
 'To the Okatch family — please know that Marshell touched many lives far beyond what you may realise. He was a pillar to many of us. We grieve with you and hold you in our prayers.',
 true, null, now() - interval '9 days'),

(gen_random_uuid(), 'Samuel Njoroge', 'sam.njoroge@hotmail.com',
 'Marshell and I grew up in the same village. We walked to school together, chased each other through maize fields, and dreamed big dreams under the stars. I am proud of the man he became. Until we meet again, brother.',
 false, 'Childhood Friend', now() - interval '8 days'),

(gen_random_uuid(), 'Fatuma Hassan', '+254700123456',
 'Working with Marshell was one of the highlights of my career. He mentored me when I was just starting out and never made me feel small for asking questions. His patience and wisdom are gifts I will carry forever.',
 false, 'Mentee', now() - interval '7 days'),

(gen_random_uuid(), 'James Kariuki', null,
 'A great man, a faithful friend, and a devoted family man. Marshell lived his values every single day. We were lucky to have him among us. May God comfort his family during this difficult time.',
 false, 'Friend', now() - interval '7 days'),

(gen_random_uuid(), null, null,
 'There are no words. Marshell was simply irreplaceable. The kindness he showed me during one of the hardest periods of my life changed everything for me. I will never forget it. Rest in perfect peace.',
 true, null, now() - interval '6 days'),

(gen_random_uuid(), 'Ruth Chebet', 'ruth.chebet@gmail.com',
 'Marshell had a gift for listening. Whenever I was going through something, he would sit with me, not to offer solutions, but just to be present. That kind of friendship is rare. I am deeply grateful I knew him.',
 false, 'Friend', now() - interval '6 days'),

(gen_random_uuid(), 'Peter Omondi', '+254711987654',
 'Marshell was the life of every gathering we attended together. His stories, his humour, and his big heart made every moment memorable. I keep reaching for my phone to call him and then remembering. It still does not feel real.',
 false, 'Best Friend', now() - interval '5 days'),

(gen_random_uuid(), 'Naomi Waweru', null,
 'To the family of Marshell Okatch — your loss is our loss too. He was a beloved member of our church community and a man of deep faith. We will continue to pray for each one of you as you walk through this grief.',
 false, 'Church Member', now() - interval '4 days'),

(gen_random_uuid(), null, null,
 'Marshell, thank you for every conversation, every laugh, and every moment of genuine connection. You made this world better simply by being in it. Fly high.',
 true, null, now() - interval '4 days'),

(gen_random_uuid(), 'Collins Ochieng', 'collins.o@outlook.com',
 'He was my classmate, my study partner, and one of my closest friends. Marshell had this incredible ability to stay calm under pressure and always helped the rest of us find perspective. A giant has fallen. We will carry your memory.',
 false, 'Classmate', now() - interval '3 days'),

(gen_random_uuid(), 'Mercy Wanjala', '+254744567890',
 'Our neighbourhood will not be the same. Marshell organised the youth football team, the clean-up drives, the holiday gatherings. He gave so much of himself to this community. Thank you for everything, Marshell.',
 false, 'Neighbour', now() - interval '3 days'),

(gen_random_uuid(), 'Isaac Mutua', null,
 'Marshell was the kind of man who made you want to be better. Not through lectures or pressure, but simply by the example of how he lived. I am a better person for having known him. May he rest in glory.',
 false, 'Colleague', now() - interval '2 days'),

(gen_random_uuid(), null, null,
 'To his children — your father was known and loved by so many people. Wherever you go in life, you will meet someone whose life he touched. That is a beautiful legacy to carry. Be proud of him. We certainly are.',
 true, null, now() - interval '1 day'),

(gen_random_uuid(), 'Esther Akinyi', 'esther.akinyi@gmail.com',
 'Marshell, I still cannot believe you are gone. You were too full of life, too full of plans, too full of love for any of us to accept this easily. But we trust that God knows best. Sleep well, dear friend. Until we see you again.',
 false, 'Friend', now() - interval '6 hours');


-- ── Contributions ─────────────────────────────────────────────────────────
INSERT INTO public.contributions (id, contributor, payment_method, mpesa_ref, amount, confirmed, is_anonymous, note, created_at) VALUES

(gen_random_uuid(), 'Wanjiru Kamau', 'mpesa', 'QK7P2MNX84', 2000.00, true, false, null, now() - interval '14 days'),

(gen_random_uuid(), 'David Otieno', 'mpesa', 'PA3Y8KL921', 5000.00, true, false, 'From the office team', now() - interval '13 days'),

(gen_random_uuid(), 'Anonymous', 'mpesa', 'RB6T4WQ537', 1000.00, true, true, null, now() - interval '12 days'),

(gen_random_uuid(), 'Aisha Mwangi', 'cash', null, 3000.00, true, false, 'Handed over at the home', now() - interval '11 days'),

(gen_random_uuid(), 'Kipchoge Ngetich', 'mpesa', 'SC9U5ER248', 2500.00, true, false, null, now() - interval '10 days'),

(gen_random_uuid(), 'Grace Adhiambo', 'mpesa', 'TD2V6FS359', 1500.00, true, false, null, now() - interval '10 days'),

(gen_random_uuid(), 'Anonymous', 'cash', null, 500.00, true, true, null, now() - interval '9 days'),

(gen_random_uuid(), 'Samuel Njoroge', 'mpesa', 'UE3W7GT460', 10000.00, true, false, 'From the village', now() - interval '8 days'),

(gen_random_uuid(), 'Fatuma Hassan', 'mpesa', 'VF4X8HU571', 2000.00, true, false, null, now() - interval '7 days'),

(gen_random_uuid(), 'James Kariuki', 'mpesa', 'WG5Y9IV682', 3500.00, false, false, null, now() - interval '7 days'),

(gen_random_uuid(), 'Anonymous', 'mpesa', 'XH6Z0JW793', 1000.00, true, true, null, now() - interval '6 days'),

(gen_random_uuid(), 'Ruth Chebet', 'cash', null, 2000.00, false, false, 'Will drop off tomorrow', now() - interval '6 days'),

(gen_random_uuid(), 'Peter Omondi', 'mpesa', 'YI7A1KX804', 5000.00, true, false, null, now() - interval '5 days'),

(gen_random_uuid(), 'Naomi Waweru', 'mpesa', 'ZJ8B2LY915', 1500.00, true, false, 'From the church members', now() - interval '4 days'),

(gen_random_uuid(), 'Anonymous', 'mpesa', 'AK9C3MZ026', 500.00, false, true, null, now() - interval '4 days'),

(gen_random_uuid(), 'Collins Ochieng', 'mpesa', 'BL0D4NA137', 4000.00, true, false, null, now() - interval '3 days'),

(gen_random_uuid(), 'Mercy Wanjala', 'cash', null, 1000.00, true, false, null, now() - interval '3 days'),

(gen_random_uuid(), 'Isaac Mutua', 'mpesa', 'CM1E5OB248', 2000.00, false, false, null, now() - interval '2 days'),

(gen_random_uuid(), 'Anonymous', 'mpesa', 'DN2F6PC359', 3000.00, false, true, null, now() - interval '1 day'),

(gen_random_uuid(), 'Esther Akinyi', 'mpesa', 'EO3G7QD460', 2500.00, false, false, null, now() - interval '3 hours');
