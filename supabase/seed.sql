-- ====================================================================
-- DesiLearCode - Development & Local Test Seed Data
-- ISOLATED FROM PRODUCTION: Marked with is_fictional_demo = TRUE
-- ====================================================================

-- 1. Organizations
INSERT INTO public.organizations (
    id, slug, name, tagline, description, registration_number, website, 
    contact_person, email, phone, location, areas_served, programs, 
    technology_needs_summary, verification_status, verified_at, logo_url, 
    hero_image_url, is_fictional_demo
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'bright-futures-foundation',
    'Bright Futures Foundation',
    'Empowering underprivileged children through digital literacy & computer science',
    'Registered non-profit providing evening computer learning labs and STEM education to underprivileged children across Pune & Maharashtra.',
    'MAH/PUN/2019/883492',
    'https://brightfutures.example.org',
    'Priya Sundaram',
    'contact@brightfutures.example.org',
    '+91 20 2567 8900',
    'Pune Urban & Rural, Maharashtra',
    ARRAY['Pune', 'Pimpri-Chinchwad', 'Haveli'],
    ARRAY['After-School Coding Lab', 'Hardware Refurbishment', 'Digital Safety Workshops'],
    'Needs 15 refurbished laptops for new batch and 2 computer mentors.',
    'verified',
    NOW(),
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000002',
    'rural-tech-bridge',
    'Rural Tech Bridge Trust',
    'Connecting rural village learning centers with hardware and offline digital education',
    'Dedicated to deploying solar-powered computer labs and open-source educational software to children without reliable internet access.',
    'KA/BLR/2021/410982',
    'https://ruraltechbridge.example.org',
    'Kiran Narayana',
    'info@ruraltechbridge.example.org',
    '+91 80 2345 6789',
    'Tumkur & Hassan Districts, Karnataka',
    ARRAY['Tumkur', 'Hassan', 'Gubbi'],
    ARRAY['Solar Computer Labs', 'Offline Wikipedia & Khan Academy', 'Robotics Basics'],
    'Urgent need for Raspberry Pi 4 kits, keyboards, monitors, and solar power packs.',
    'verified',
    NOW(),
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    TRUE
);

-- 2. Projects
INSERT INTO public.projects (
    id, organization_id, slug, title, tagline, description, why_it_matters, 
    what_support_provides, category, region, beneficiary_group, target_students, 
    status, urgency, hero_image_url, goal_value, current_value, progress_percentage, 
    is_fictional_demo
) VALUES
(
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'pune-evening-coding-lab',
    'Pune Digital Learning Lab & Python Mentorship',
    'Equipping 40 middle-school children from urban informal settlements with refurbished laptops and weekly coding mentors.',
    'Children from low-income communities lack access to computing devices at home or school. This initiative provides structured after-school technology access with guided curriculum.',
    'Donated laptops allow children to practice foundational computational thinking, Scratch, and Python programming.',
    'Funding covers hardware refurbishment (SSDs, chargers, OS installation) and classroom connectivity.',
    'Coding',
    'Pune Urban, Maharashtra',
    '40 Middle School Students in Urban Learning Hub',
    40,
    'active',
    'high',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    120000,
    85000,
    71,
    TRUE
),
(
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'solar-powered-stem-lab-tumkur',
    'Solar-Powered STEM & Robotics Station for Village Center',
    'Installing a 6-seat offline STEM learning lab powered by solar batteries in an outlying rural center.',
    'Power outages and non-existent internet cut students off from modern STEM education. This lab runs self-contained offline learning stacks.',
    'Enables hands-on science experiments, basic block coding, and interactive mathematics simulations.',
    'Provides solar battery units, 6 refurbished desktop workstations, and preloaded curriculum drives.',
    'STEM',
    'Tumkur District, Karnataka',
    '65 Primary and Middle School Children',
    65,
    'active',
    'medium',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    180000,
    95000,
    53,
    TRUE
);

-- 3. Project Needs
INSERT INTO public.project_needs (
    id, project_id, title, need_type, category, quantity_required, quantity_fulfilled, 
    unit, priority, purpose, is_fulfilled
) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Refurbished Dual-Core / Core i3+ Laptops',
    'laptop',
    'Technology',
    15,
    9,
    'Laptops',
    'urgent',
    'Direct hands-on coding stations for students.',
    FALSE
),
(
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'Hardware Refurbishment & SSD Replacement Fund',
    'refurbishment_fund',
    'Technology',
    35000,
    25000,
    '₹',
    'high',
    'Purchasing new SSDs and replacement battery packs for donated second-hand hardware.',
    FALSE
);

-- 4. Impact Reports
INSERT INTO public.impact_reports (
    id, project_id, organization_id, period, headline, summary, before_state, 
    after_state, computers_provided, students_trained, volunteer_hours, 
    workshops_conducted, verified_by_admin, published_at
) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Q1 2026',
    'First Batch of 30 Students Completed Foundational Computational Thinking',
    'Over 12 weeks, volunteer tech mentors conducted weekly programming workshops using 10 donated and refurbished laptops.',
    'Zero students had ever typed on a keyboard or created a digital project before the lab installation.',
    '100% of participants built their first animated interactive story in Scratch, and 12 started basic Python.',
    10,
    30,
    72,
    12,
    TRUE,
    NOW()
);

-- 5. Additional NGOs
INSERT INTO public.organizations (
    id, slug, name, tagline, description, registration_number, website, 
    contact_person, email, phone, location, areas_served, programs, 
    technology_needs_summary, verification_status, verified_at, logo_url, 
    hero_image_url, is_fictional_demo
) VALUES 
(
    'a0000000-0000-0000-0000-000000000003',
    'delhi-digital-empower',
    'Delhi Digital Empower',
    'Bridging the IT gap in urban slums',
    'Focuses on IT literacy in Delhi slums.',
    'DEL/2021/112233',
    'https://delhidigital.example.org',
    'Amit Kumar',
    'amit@delhidigital.example.org',
    '+91 11 2233 4455',
    'Delhi NCR',
    ARRAY['Delhi', 'Noida'],
    ARRAY['Digital Literacy'],
    'Requires 50 desktops.',
    'verified',
    NOW(),
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000004',
    'bangalore-tech-for-all',
    'Bangalore Tech For All',
    'Equipping rural Karnataka with 21st-century skills',
    'Registered NGO operating out of Bangalore rural.',
    'KAR/2018/887766',
    'https://blrtech.example.org',
    'Kavita Rao',
    'kavita@blrtech.example.org',
    '+91 80 5566 7788',
    'Bangalore Rural, Karnataka',
    ARRAY['Bangalore Rural', 'Mysore'],
    ARRAY['Girls in Tech', 'Advanced Programming'],
    'Needs 20 refurbished laptops for Girls in Tech batch.',
    'verified',
    NOW(),
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    TRUE
);

-- 6. Additional Projects
INSERT INTO public.projects (
    id, organization_id, slug, title, summary, full_description, 
    cover_image_url, status, published_at, category, primary_location, 
    target_students, beneficiary_group, current_value, goal_value, 
    fulfillment_percentage, is_fictional_demo
) VALUES
(
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000004',
    'girls-in-tech-mysore',
    'Mysore Girls Tech Cohort 2026',
    'Providing 20 laptops for an advanced Python programming course for rural girls.',
    'A 6-month intensive program targeting 20 girls in Mysore rural. We are raising funds for 20 laptops and mentorship.',
    'https://images.unsplash.com/photo-1571260899304-425f190bc1b9?w=800&auto=format&fit=crop&q=80',
    'active',
    NOW(),
    'After-School Lab',
    'Mysore, Karnataka',
    20,
    'Girls aged 14-17',
    40000,
    150000,
    26,
    TRUE
);

-- 7. Devices (Simulating Lifecycle)
INSERT INTO public.devices (
    id, tracking_code, device_type, manufacturer, model, specifications, 
    condition_notes, donor_id, status, is_fictional_demo, created_at
) VALUES 
(
    'e0000000-0000-0000-0000-000000000001',
    'DLC-8F2A-4C1B',
    'Laptop',
    'Lenovo',
    'ThinkPad T480',
    'Core i5, 8GB RAM, 256GB SSD',
    'Good condition, battery holds charge',
    NULL,
    'Received',
    TRUE,
    NOW() - INTERVAL '30 days'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'DLC-9X3B-5D2C',
    'Laptop',
    'Dell',
    'Latitude 5490',
    'Core i5, 16GB RAM, 512GB SSD',
    'Keyboard has sticky keys',
    NULL,
    'Repair',
    TRUE,
    NOW() - INTERVAL '15 days'
),
(
    'e0000000-0000-0000-0000-000000000003',
    'DLC-1A2B-3C4D',
    'Desktop',
    'HP',
    'ProDesk 600',
    'Core i3, 8GB RAM, 500GB HDD',
    'Perfect working condition',
    NULL,
    'Ready',
    TRUE,
    NOW() - INTERVAL '5 days'
);

-- 8. Audit Logs
INSERT INTO public.audit_logs (
    id, actor_id, actor_role, action, target_type, target_id, details
) VALUES 
(
    gen_random_uuid(),
    NULL,
    'admin',
    'VERIFIED_ORGANIZATION',
    'organization',
    'a0000000-0000-0000-0000-000000000004',
    'System generated verification for seed data'
),
(
    gen_random_uuid(),
    NULL,
    'admin',
    'UPDATED_DEVICE_STATUS',
    'device',
    'e0000000-0000-0000-0000-000000000002',
    'Device status transitioned from Inspection to Repair'
);
