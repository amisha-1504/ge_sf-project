import os
from sqlalchemy.orm import Session
from app.core.db import engine, SessionLocal, Base
from app.models import User, Category, SubCategory
from app.models.product import Product, ProductImage
from app.core.security import get_password_hash

TAXONOMY = {
    "Electronics": {
        "slug": "electronics",
        "description": "Home electronics, coolers, TVs, washing machines, and kitchen appliances",
        "subcategories": [
            ("Steel/Plastic Cooler", "cooler"),
            ("Television", "tv"),
            ("Mixer/Grinder", "mixer-grinder"),
            ("Refrigerator", "refrigerator"),
            ("Washing Machine", "washing-machine"),
            ("Fans", "fans"),
            ("Induction", "induction"),
        ]
    },
    "Wood Furniture": {
        "slug": "wood-furniture",
        "description": "Premium wooden beds, mattresses, almirahs, sofas, and tables",
        "subcategories": [
            ("Beds", "beds"),
            ("Mattress", "mattress"),
            ("Almirah", "almirah"),
            ("Dressing", "dressing"),
            ("Table", "table"),
            ("Study Table", "study-table"),
            ("Sofas", "sofas"),
            ("Shoe Racks", "shoe-racks"),
            ("Book Shelves", "book-shelves"),
            ("Bed Table", "bed-table"),
        ]
    },
    "Steel Furniture": {
        "slug": "steel-furniture",
        "description": "Durable steel trunks, almirahs, racks, and office furniture",
        "subcategories": [
            ("Trunks", "trunks"),
            ("Almirah", "steel-almirah"),
            ("Kitchen Cabinet", "kitchen-cabinet"),
            ("Shoe Stands", "shoe-stands"),
            ("Storage Rack / Rek", "rack-rek"),
            ("Beds", "steel-beds"),
            ("Office Almirah", "office-almirah"),
        ]
    },
    "Plastic Furniture": {
        "slug": "plastic-furniture",
        "description": "High grade plastic chairs, tables, and office seating",
        "subcategories": [
            ("Chairs", "plastic-chairs"),
            ("Tables", "plastic-tables"),
            ("Bed Table", "plastic-bed-table"),
            ("Office Chair", "office-chair"),
        ]
    }
}

PRODUCT_SEEDS = {
    # Electronics
    "steel_cooler": {
        "sub_slug": "cooler",
        "title": "Clarion Heavy-Gauge Galvanized Steel Desert Air Cooler",
        "slug": "clarion-heavy-gauge-steel-desert-cooler",
        "description": "Heavy commercial-grade galvanized sheet steel desert cooler by Clarion. Features a durable white powder-coated exterior with copper-toned trim, front directional horizontal louvers with motorized vertical swing, slotted side air-intake grilles with high-density cooling pads, dual top rotary dials (Pump/Swing & Fan speed), and 4 heavy-duty industrial caster wheels.",
        "price": 6499.00,
        "dimensions": "48 x 26 x 26 inches",
        "material": "Galvanized Heavy-Gauge Sheet Steel (GI) with Powder Coating",
        "is_featured": True,
    },
    "plastic_cooler": {
        "sub_slug": "cooler",
        "title": "Heavy-Duty Dual-Tone Molded Plastic Desert Cooler",
        "slug": "heavy-duty-dual-tone-plastic-desert-cooler",
        "description": "High-airflow rust-proof plastic desert cooler in modern dual-tone slate grey and white. Engineered with an aerodynamic 3-blade fan protected by an artistic swirl safety guard, 3 ergonomic rotary control knobs, extra-deep bottom water reservoir with vertical turquoise water level indicator, and smooth caster legs for easy room-to-room mobility.",
        "price": 7999.00,
        "dimensions": "45 x 24 x 20 inches",
        "material": "Engineered High-Impact ABS Plastic Body",
        "is_featured": True,
    },
    "television": {
        "sub_slug": "tv",
        "title": "Samsung Neo QLED 4K Ultra HD Smart LED Television",
        "slug": "samsung-neo-qled-4k-uhd-smart-tv",
        "description": "Premium Samsung Neo QLED 4K Ultra HD Smart TV featuring an ultra-slim bezel-less Infinity Screen, quantum dot color technology, dual minimalist black blade stand feet, BEE energy rating, Dolby Audio stereo speakers, built-in Wi-Fi, and multiple HDMI/USB ports.",
        "price": 34999.00,
        "dimensions": "96.5 x 56 x 8 cm (43-Inch)",
        "material": "Quantum Dot Neo QLED Panel & Slim Metal Chassis",
        "is_featured": True,
    },
    "mixer_grinder": {
        "sub_slug": "mixer-grinder",
        "title": "Philips Multi-Jar Mixer Grinder & Smoothie Blender System",
        "slug": "philips-multi-jar-mixer-grinder-blender",
        "description": "Versatile Philips food prep system with dual-tone matte black finish and metallic copper accent band. Powered by a high-torque pure copper motor with a central 3-speed rotary dial and pulse control. Includes heavy-duty stainless steel wet grinding jar with clear dome lid, stainless steel chutney jar, high-capacity transparent blender jug, and personal portable smoothie bullet jar.",
        "price": 3499.00,
        "dimensions": "38 x 22 x 25 cm",
        "material": "Stainless Steel Jars & Shock-Proof ABS Housing",
        "is_featured": False,
    },
    "refrigerator": {
        "sub_slug": "refrigerator",
        "title": "LG Single-Door Inverter Refrigerator with Base Stand Drawer",
        "slug": "lg-single-door-inverter-refrigerator-base-drawer",
        "description": "LG Smart Inverter direct-cool single-door refrigerator featuring a high-gloss royal blue door adorned with an artistic peony floral bouquet design. Equipped with an inset vertical chrome handle with lock, BEE 5-star energy saving efficiency, toughened glass internal shelves, and an integrated bottom base drawer for storing dry vegetables like potatoes and onions.",
        "price": 18499.00,
        "dimensions": "135 x 54 x 63 cm (190L)",
        "material": "High-Gloss Floral Curved Glass-Look Metal Door",
        "is_featured": True,
    },
    "washing_machine": {
        "sub_slug": "washing-machine",
        "title": "LG 5-Star Smart Inverter Top-Load Washing Machine",
        "slug": "lg-5-star-smart-inverter-top-load-washing-machine",
        "description": "Fully automatic LG Smart Inverter top-load washing machine finished in sophisticated titanium graphite grey. Features a wide soft-closing tinted toughened glass lid, digital LED touch control console, TurboDrum stainless steel pulsator technology, 10-year motor warranty, and BEE 5-star power saving certification.",
        "price": 17999.00,
        "dimensions": "54 x 56 x 98 cm (7.0 kg)",
        "material": "Rust-Proof PCM Steel Cabinet & Stainless Steel Tub",
        "is_featured": True,
    },
    "fans": {
        "sub_slug": "fans",
        "title": "Crompton High-Speed 1200mm Ceiling Fan",
        "slug": "crompton-high-speed-1200mm-ceiling-fan",
        "description": "Crompton 3-blade high-velocity ceiling fan in a rich matte chocolate brown / coffee finish. Crafted with aerodynamic wide contoured aluminum blades, heavy-duty double ball bearings, conical top and bottom canopies, and a 100% copper winding motor delivering maximum airflow throw across domestic and commercial rooms.",
        "price": 1899.00,
        "dimensions": "1200 mm Sweep (48 inches)",
        "material": "High-Grade Aluminum Blades & Heavy Copper Wound Motor",
        "is_featured": False,
    },
    "induction_cooktops": {
        "sub_slug": "induction",
        "title": "Croma Infrared Induction Cooktop with Dual Metal Handles",
        "slug": "croma-infrared-induction-cooktop-metal-handles",
        "description": "Heavy-duty Croma radiant infrared / induction cooktop with a polished crystal black glass top plate, glowing circular heating coil zone, and sturdy dual side metal carrying handles. Equipped with a bright red 4-digit digital LED readout, tactile preset cooking modes (Fry, BBQ, Soup), auto-timer, child lock, and a smooth rotary dial knob for precision temperature and power adjustment.",
        "price": 2699.00,
        "dimensions": "36 x 28 x 7 cm",
        "material": "Micro-Crystal Glass Plate & Cast Aluminum Side Handles",
        "is_featured": False,
    },

    # Wood Furniture
    "wooden_bed": {
        "sub_slug": "beds",
        "title": "Mahogany Walnut Platform Bed with Channel-Tufted Storage Headboard",
        "slug": "mahogany-walnut-platform-bed-storage-headboard",
        "description": "King/Queen platform bed finished in warm reddish mahogany/walnut woodgrain. Features a multi-functional headboard with twin channel-tufted padded leatherette backrests for comfortable reading, flanked around central recessed storage niches/cubbies for phones, clocks, and books. Supported on a robust solid enclosed box bed frame with rounded protective corners.",
        "price": 27999.00,
        "dimensions": "82 x 64 x 42 inches",
        "material": "Engineered Wood with Melamine Finish & Padded Leatherette",
        "is_featured": True,
    },
    "mattress": {
        "sub_slug": "mattress",
        "title": "Ortho Essential High-Density Dual-Tone Orthopedic Mattress",
        "slug": "ortho-essential-orthopedic-memory-foam-mattress",
        "description": "Doctor-recommended Ortho Essential orthopedic mattress engineered for ergonomic spine alignment and zero partner disturbance. Features a breathable quilted white micro-dot dimpled stretch-knit top cover, accented by a tailored heather-grey woven linen border with official Ortho Essential embroidered branding.",
        "price": 8999.00,
        "dimensions": "78 x 60 x 6 inches (Queen)",
        "material": "Multi-Layer High-Resilience Ortho Foam & Quilted Knit Fabric",
        "is_featured": False,
    },
    "wooden_almirah": {
        "sub_slug": "almirah",
        "title": "Nordic Minimalist 3-Door Wardrobe Almirah in Matte White",
        "slug": "nordic-minimalist-3-door-wardrobe-almirah-white",
        "description": "Modern Scandinavian-inspired 3-door full-height wardrobe finished in clean matte pure white. Designed with sleek vertical brushed silver bar handles, dual key-lock cylinders for security, generous full-length hanging space, multi-tier shelving compartments, and an integrated plinth base.",
        "price": 19499.00,
        "dimensions": "78 x 46 x 20 inches",
        "material": "High-Density Moisture-Resistant Engineered Wood with Matte Lamination",
        "is_featured": True,
    },
    "dressing_table": {
        "sub_slug": "dressing",
        "title": "Sheesham Wood Dressing Table with Full Mirror & Cabinet",
        "slug": "sheesham-wood-dressing-table-full-mirror-cabinet",
        "description": "Artisan-crafted dressing table in natural Sheesham / rosewood grain finish. Features a tall vertical framed vanity mirror with brass knob pull, a countertop ledge for daily essentials, a spacious two-door bottom storage cupboard with circular brass handles, and stylish mid-century tapered wooden legs.",
        "price": 8499.00,
        "dimensions": "72 x 32 x 16 inches",
        "material": "Solid Sheesham Wood & Beveled Glass Mirror",
        "is_featured": False,
    },
    "office_table": {
        "sub_slug": "table",
        "title": "Executive Walnut Workstation Desk with Lockable Cabinet & Drawer",
        "slug": "executive-walnut-workstation-desk-cabinet-drawer",
        "description": "Executive wooden computer office desk finished in warm walnut laminate with white contrast edge trim. Right pedestal features a lockable top stationery drawer and a large lower storage cabinet with vertical silver handle and keys, combined with a spacious legroom kneehole space and full modesty back panel.",
        "price": 7999.00,
        "dimensions": "48 x 24 x 30 inches",
        "material": "Commercial Grade Pre-Laminated Engineered Board",
        "is_featured": False,
    },
    "study_table": {
        "sub_slug": "study-table",
        "title": "Solid Sheesham Wood Writing Study Table with Dual Drawers",
        "slug": "solid-sheesham-wood-writing-study-table-drawers",
        "description": "Minimalist study and laptop writing desk handcrafted from solid Sheesham wood in rich honey/walnut natural grain. Features two seamless concealed drawers directly beneath the desktop with finger-pull grooves, supported on sturdy square wooden legs with lower horizontal stabilizing stretchers.",
        "price": 5999.00,
        "dimensions": "38 x 22 x 30 inches",
        "material": "100% Solid Seasoned Sheesham Wood",
        "is_featured": False,
    },
    "sofa": {
        "sub_slug": "sofas",
        "title": "Contemporary 3-Seater Living Room Sofa with Accent Cushions",
        "slug": "contemporary-3-seater-beige-fabric-sofa",
        "description": "Modern 3-seater sofa upholstered in plush woven textured cream/beige fabric. Designed with clean boxy square track armrests, deep continuous bench seating cushion, three plush back support pillows, two matching side lumbar toss cushions, and tapered solid block wooden feet.",
        "price": 22999.00,
        "dimensions": "84 x 34 x 32 inches",
        "material": "Solid Hardwood Frame, 32-Density Foam & Linen-Cotton Blend Fabric",
        "is_featured": True,
    },
    "wooden_shoe_rack": {
        "sub_slug": "shoe-racks",
        "title": "5-Tier Wooden Shoe Cabinet with Louvered Ventilation Doors",
        "slug": "5-tier-wooden-shoe-cabinet-louvered-doors",
        "description": "Vertical 5-tier wooden shoe organizer cabinet in natural honey teak/walnut woodgrain finish. Features dual opening doors with horizontal ventilation slits for odor-free breathability, vertical chrome handles, magnetic door catches, and 4 raised protective moisture-resistant legs. Holds 15 to 20 pairs of footwear.",
        "price": 5499.00,
        "dimensions": "42 x 30 x 14 inches",
        "material": "Engineered Wood with Water-Resistant Melamine Finish",
        "is_featured": False,
    },
    "book_shelves": {
        "sub_slug": "book-shelves",
        "title": "4-Tier Nordic Ladder Bookshelf with Dual-Tone Pink Accent Panels",
        "slug": "4-tier-nordic-ladder-bookshelf-pink-panels",
        "description": "Charming Scandinavian open ladder bookshelf featuring a slender ivory/beige frame and playful dual-tone pink back panels (soft pastel pink on the top tier, vibrant magenta pink on the bottom tier). The two open middle tiers provide light and airy display space for books, indoor potted plants, and decorative photo frames.",
        "price": 3799.00,
        "dimensions": "62 x 22 x 12 inches",
        "material": "Engineered Wood Frame with Dual-Tone Laminate Panels",
        "is_featured": False,
    },
    "wooden_bed_table": {
        "sub_slug": "bed-table",
        "title": "Handcrafted Wooden Bed Breakfast & Laptop Tray with Butterfly Art",
        "slug": "handcrafted-wooden-bed-laptop-tray-butterfly-art",
        "description": "Foldable breakfast-in-bed and laptop serving table crafted from solid dark walnut-toned wood. Features foldable legs, dual side cutout carry handles, raised spill-guard perimeter rims, and a delightful folk-art floral butterfly illustration with the inspirational quote: 'And just when the caterpillar thought her life was over, she began to fly'.",
        "price": 1299.00,
        "dimensions": "22 x 14 x 9 inches",
        "material": "Solid Hardwood Frame with Waterproof Printed Graphic Top",
        "is_featured": False,
    },

    # Steel Furniture
    "trunks": {
        "sub_slug": "trunks",
        "title": "Heavy-Gauge Galvanized Iron Security Storage Box / Trunk (Sandook)",
        "slug": "heavy-gauge-galvanized-iron-storage-trunk-sandook",
        "description": "Traditional heavy-duty Anand galvanized iron (GI) metal storage trunk with brilliant rust-resistant zinc spangle finish. Reinforced with heavy rolled top rim tubing, a hinged lid with interior restraint chains, front drop handle with heavy-duty center padlock hasp and staple, and dual riveted side handles for secure heavy luggage or household storage.",
        "price": 3499.00,
        "dimensions": "36 x 22 x 18 inches",
        "material": "Heavy-Gauge Galvanized Iron (GI) Sheet",
        "is_featured": True,
    },
    "steel_almirah": {
        "sub_slug": "steel-almirah",
        "title": "Heavy 3-Door Steel Wardrobe with Dressing Mirror & Drawers",
        "slug": "heavy-3-door-steel-wardrobe-mirror-drawers",
        "description": "Commercial-grade 3-door steel almirah in luxurious dark wine / burgundy maroon powder coating with a contrasting white plinth base. Features an integrated vertical dressing mirror on the right door, two lower external storage drawers, central multi-lever brass lock with vertical handle, full-width hanger rod, and concealed inner security locker.",
        "price": 15499.00,
        "dimensions": "78 x 48 x 20 inches",
        "material": "Heavy 20/22-Gauge Cold-Rolled CRCA Steel Sheet",
        "is_featured": True,
    },
    "office_almirah": {
        "sub_slug": "office-almirah",
        "title": "4-Tier Steel Office Bookcase with Lift-and-Slide Glass Doors",
        "slug": "4-tier-steel-office-bookcase-glass-doors",
        "description": "Commercial 4-tier barrister-style metal office filing almirah in durable off-white/light-grey electrostatic powder-coat. Features four independent lift-and-slide tempered glass flipper doors with individual cylinder locks and chrome bow handles, providing dust-proof storage and instant visual access for files, office records, and accounting binders.",
        "price": 12499.00,
        "dimensions": "68 x 34 x 16 inches",
        "material": "Heavy-Duty CRCA Steel with Toughened Glass Door Panels",
        "is_featured": False,
    },
    "kitchen_cabinet": {
        "sub_slug": "kitchen-cabinet",
        "title": "4-Tier Mobile Kitchen Storage Utility Cart with Swivel Wheels",
        "slug": "4-tier-mobile-kitchen-utility-cart-wheels",
        "description": "Modern 4-tier space-saving rolling organizer trolley in matte charcoal grey. Features four deep perimeter-walled basket shelves designed to securely hold spice jars, condiment bottles, fruits, and vegetables, mounted on 360-degree smooth-rolling swivel caster wheels to easily slide between kitchen counters and appliances.",
        "price": 2499.00,
        "dimensions": "34 x 16 x 9 inches",
        "material": "Reinforced Anti-Rust Powder-Coated Metal & Heavy Duty Polypropylene",
        "is_featured": False,
    },
    "steel_shoe_stand": {
        "sub_slug": "shoe-stands",
        "title": "3-Tier Tubular Metal Shoe Rack with Top Carry Handle",
        "slug": "3-tier-tubular-metal-shoe-rack-carry-handle",
        "description": "Sturdy 3-tier open grid shoe rack in matte black powder-coated steel. Features a continuous tubular steel side frame crowned by an arched top carry handle for effortless lifting, and three open wire mesh grid tiers that promote air circulation and quick drying for shoes, slippers, and sports footwear.",
        "price": 1299.00,
        "dimensions": "28 x 20 x 10 inches",
        "material": "Rust-Resistant Powder-Coated Tubular Steel & Wire Grid",
        "is_featured": False,
    },
    "steel_beds": {
        "sub_slug": "steel-beds",
        "title": "Foldable Single Metal Cot Bed with Geometric Fretwork & Floral Cushion",
        "slug": "foldable-single-metal-cot-bed-floral-cushion",
        "description": "Space-saving foldable single metal charpai / cot bed in black powder-coated steel. Designed with distinctive geometric fretwork on both headboard and footboard, center-folding hinges for compact storage against walls, multi-leg tubular floor supports, and an integrated padded mattress top adorned with a colorful floral fabric print.",
        "price": 4499.00,
        "dimensions": "72 x 36 x 28 inches (Single Bed)",
        "material": "Tubular Steel Frame with Integrated Padded Floral Fabric Top",
        "is_featured": True,
    },

    # Plastic Furniture
    "plastic_chair": {
        "sub_slug": "plastic-chairs",
        "title": "Ergonomic Molded Plastic Armchair with Slatted Backrest",
        "slug": "ergonomic-molded-plastic-armchair-slatted-back",
        "description": "Heavy-duty virgin plastic armchair in elegant warm beige/taupe. Features a high ergonomic backrest with vertical ventilation slats and a lower lumbar cutout, contoured supportive armrests with ribbed decorative pillars, solid square-profile legs, and stackable all-weather durability for living rooms, dining, or outdoor verandahs.",
        "price": 1399.00,
        "dimensions": "33 x 23 x 22 inches",
        "material": "100% Virgin High-Impact Polypropylene (PP)",
        "is_featured": True,
    },
    "plastic_table": {
        "sub_slug": "plastic-tables",
        "title": "Molded Plastic Center Table with Rattan Wicker Rim & Shelf",
        "slug": "molded-plastic-center-table-rattan-rim-shelf",
        "description": "Heavy molded plastic coffee / center table in deep espresso dark brown. Features an elegant woven rattan/wicker textured perimeter border, a smooth slatted-look central tabletop, an integrated bottom utility shelf for newspapers and magazines, and sturdy angular flared legs engineered for zero wobbling.",
        "price": 1799.00,
        "dimensions": "32 x 22 x 18 inches",
        "material": "Weatherproof UV-Stabilized Heavy Molded Polymer",
        "is_featured": False,
    },
    "plastic_bed_table": {
        "sub_slug": "plastic-bed-table",
        "title": "Foldable Laptop Bed Desk with Docking Groove & Cup Holder",
        "slug": "foldable-laptop-bed-desk-docking-cup-holder",
        "description": "Ergonomic multipurpose portable laptop bed desk finished in textured charcoal black woodgrain. Features rounded safety corners, an integrated tablet/smartphone docking groove slot, a recessed circular cup/tumbler holder, and foldable white U-shaped tubular metal legs fitted with anti-slip protective black foam pads.",
        "price": 799.00,
        "dimensions": "24 x 16 x 11 inches",
        "material": "Engineered Polymer Top & Powder-Coated Metal Legs",
        "is_featured": False,
    },
    "office_chair": {
        "sub_slug": "office-chair",
        "title": "Ergonomic Mid-Back Revolving Desk Chair in Ocean Teal Blue",
        "slug": "ergonomic-mid-back-revolving-desk-chair-teal-blue",
        "description": "Modern ergonomic office task chair upholstered in vibrant ocean teal blue fabric. Features a supportive contoured backrest, thick high-density foam seat with a waterfall front edge to alleviate thigh pressure, height-adjustable black T-shaped armrests, pneumatic gas lift height adjustment, and a heavy-duty 5-star wheeled base with smooth 360-degree nylon casters.",
        "price": 4999.00,
        "dimensions": "40 x 24 x 24 inches",
        "material": "High-Density Foam, Breathable Woven Fabric & Reinforced Nylon Base",
        "is_featured": True,
    },
}

def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # 1. Seed Admin User
        admin_email = "admin@gesf.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash("admin123"),
                full_name="Default Admin",
                role="admin",
                is_active=True
            )
            db.add(admin)
            print(f"Created Admin User: {admin_email}")

        # 2. Seed Taxonomy
        for cat_name, cat_data in TAXONOMY.items():
            category = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not category:
                category = Category(
                    name=cat_name,
                    slug=cat_data["slug"],
                    description=cat_data["description"]
                )
                db.add(category)
                db.flush()
                print(f"Created Category: {cat_name}")

            for sub_name, sub_slug in cat_data["subcategories"]:
                sub = db.query(SubCategory).filter(
                    SubCategory.category_id == category.id,
                    SubCategory.slug == sub_slug
                ).first()
                if not sub:
                    sub = SubCategory(
                        category_id=category.id,
                        name=sub_name,
                        slug=sub_slug
                    )
                    db.add(sub)
                    print(f"  |- Created SubCategory: {sub_name}")

        # Clean up obsolete categories and subcategories not in TAXONOMY
        valid_cat_slugs = [t["slug"] for t in TAXONOMY.values()]
        obsolete_cats = db.query(Category).filter(~Category.slug.in_(valid_cat_slugs)).all()
        for obs_cat in obsolete_cats:
            # Delete any subcategories under this category
            db.query(SubCategory).filter(SubCategory.category_id == obs_cat.id).delete(synchronize_session=False)
            db.delete(obs_cat)
            print(f"  [-] Removed non-catalog category: {obs_cat.name}")

        # 3. Clean up legacy placeholder products (including Desert Cooler Supreme)
        valid_slugs = [p["slug"] for p in PRODUCT_SEEDS.values()]
        deleted_count = db.query(Product).filter(
            (~Product.slug.in_(valid_slugs)) |
            (Product.slug.like("%desert-cooler-supreme%")) |
            (Product.title.like("%Desert Cooler Supreme%"))
        ).delete(synchronize_session=False)
        if deleted_count > 0:
            print(f"  [-] Removed {deleted_count} stale/placeholder product(s)")

        # 4. Seed Products and Multi-Angle Images from static/images directory
        images_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "static", "images"))
        print(f"\nScanning image directories in: {images_dir}")

        total_seeded = 0
        total_images = 0
        valid_exts = {".webp", ".jpg", ".jpeg", ".png", ".avif"}

        for folder_name, prod_data in PRODUCT_SEEDS.items():
            folder_path = os.path.join(images_dir, folder_name)
            if not os.path.isdir(folder_path):
                print(f"  [!] Skipping {folder_name}: directory not found")
                continue

            # Gather and sort all angle image files naturally (e.g. 1, 2, ... 9, 10)
            def natural_sort_key(s):
                import re
                return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

            image_files = sorted(
                [f for f in os.listdir(folder_path) if os.path.splitext(f)[1].lower() in valid_exts],
                key=natural_sort_key
            )

            if not image_files:
                print(f"  [!] Skipping {folder_name}: no valid images found")
                continue

            # Resolve subcategory
            sub = db.query(SubCategory).filter(SubCategory.slug == prod_data["sub_slug"]).first()
            if not sub:
                print(f"  [!] SubCategory '{prod_data['sub_slug']}' not found in DB!")
                continue

            # Check if product exists
            product = db.query(Product).filter(Product.slug == prod_data["slug"]).first()
            if not product:
                product = Product(
                    subcategory_id=sub.id,
                    title=prod_data["title"],
                    slug=prod_data["slug"],
                    description=prod_data["description"],
                    price=prod_data["price"],
                    dimensions=prod_data["dimensions"],
                    material=prod_data["material"],
                    in_stock=True,
                    is_featured=prod_data["is_featured"],
                )
                db.add(product)
                db.flush()
                print(f"  [+] Created Product: {product.title}")
            else:
                product.subcategory_id = sub.id
                product.title = prod_data["title"]
                product.description = prod_data["description"]
                product.price = prod_data["price"]
                product.dimensions = prod_data["dimensions"]
                product.material = prod_data["material"]
                product.in_stock = True
                product.is_featured = prod_data["is_featured"]
                db.flush()
                print(f"  [*] Updated Product: {product.title}")

            # Re-sync product angle images
            db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()

            for idx, img_file in enumerate(image_files):
                img_rel_path = f"/static/images/{folder_name}/{img_file}"
                img_obj = ProductImage(
                    product_id=product.id,
                    image_path=img_rel_path,
                    is_primary=(idx == 0)
                )
                db.add(img_obj)

            total_seeded += 1
            total_images += len(image_files)
            print(f"      -> Linked {len(image_files)} angle images (Primary: {image_files[0]})")

        db.commit()
        print(f"\nSeeding Completed: {total_seeded} Products Seeded with {total_images} Total Angle Images!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

