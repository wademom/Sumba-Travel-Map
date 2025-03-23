const locations = {
    transport: [
        {
            name: "Tambolaka Airport",
            position: [-9.4097, 119.2445],
            description: "The main airport in West Sumba, serving domestic flights from major Indonesian cities.",
            icon: "fa-plane",
            iconLibrary: "fa",
            iconClass: "icon-transport",
            photo: "images/Tambolaka airport.png"
        },
        {
            name: "Waikelo Port",
            position: [-9.391270, 119.219794],
            description: "A small but important port connecting Sumba to other islands. Here, you can catch ferries to and from Sumba, Flores, and other parts of Indonesia, making it a key hub for travelers and trade.",
            icon: "fa-anchor",
            iconLibrary: "fa",
            iconClass: "icon-transport",
            photo: "images/Waikelo Port.png"
        },
        {
            name: "Mau Hau Airport",
            position: [-9.669346, 120.298907],
            description: "The main gateway to East Sumba, offering domestic flights to Bali, Kupang, and beyond. The airport is small but efficient, with easy access to Waingapu's hotels, restaurants, and car rentals.",
            icon: "fa-plane",
            iconLibrary: "fa",
            iconClass: "icon-transport",
            photo: "images/Mau Hau Airport.png"
        },
        {
            name: "Waingapu Port",
            position: [-9.642880, 120.248430],
            description: "A bustling harbor connecting East Sumba to nearby islands. Ferries and cargo ships regularly pass through, and it's a great place to see traditional wooden boats in action.",
            icon: "fa-anchor",
            iconLibrary: "fa",
            iconClass: "icon-transport",
            photo: "images/Waingapu Port.png"
        }
    ],
    tourist: [
        {
            name: "Pantai Kerewei",
            position: [-9.761046, 119.331675],
            description: "A stunning beach with a powerful and consistent left-hand wave, making it a favorite for experienced surfers. The sandy shoreline and scenic cliffs also make it a great spot to relax and take in Sumba's raw coastal beauty.",
            icon: "fa-person-swimming",
            iconClass: "icon-surf",
            iconLibrary: "fa",
            photo: "images/Pantai Kerewei.png"
        },
        {
            name: "Pero Surf Break",
            position: [-9.607095, 118.985405],
            description: "A long, powerful left-hand reef break that can run for up to 100 meters on a good swell. Best for experienced surfers, Pero offers fast sections and hollow barrels, making it one of Sumba's top surf spots.",
            icon: "fa-person-swimming",
            iconClass: "icon-surf",
            iconLibrary: "fa",
            photo: "images/Pero Surf Break.png"
        },
        {
            name: "Bukit Wairinding",
            position: [-9.679697, 120.101302],
            description: "A breathtaking hilltop with rolling green landscapes that turn golden in the dry season. A favorite for photographers and sunset lovers, this scenic spot offers panoramic views of Sumba's unique countryside.",
            icon: "fa-camera",
            iconLibrary: "fa",
            iconClass: "icon-hill",
            photo: "images/Bukit Wairinding.png"
        },
        {
            name: "Rua Beach",
            position: [-9.765129, 119.413771],
            description: "A quiet, picturesque beach with soft golden sand and calm waters, perfect for swimming, sunbathing, and watching local fishermen bring in their daily catch. A great spot to unwind away from the crowds.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water",
            photo: "images/Rua Beach.png"
        },
        {
            name: "Weekuri Lake",
            position: [-9.491014, 118.959897],
            description: "A breathtaking saltwater lagoon with crystal-clear turquoise waters, separated from the ocean by rugged rock formations. Perfect for swimming, floating, and enjoying the serene surroundings, this natural wonder is a must-visit for those looking to experience Sumba's unique coastal beauty.",
            icon: "fa-person-swimming",
            iconLibrary: "fa",
            iconClass: "icon-water",
            photo: "images/Weekuri Lake.png"
        },
        {
            name: "Mandorak Beach",
            position: [-9.498578, 118.954658],
            description: "A secluded paradise with soft white sand, turquoise waters, and dramatic rock formations. This hidden gem is perfect for relaxing, swimming, and soaking in Sumba's natural beauty. Nearby, you'll find small cliffs ideal for cliff jumping and a peaceful lagoon to explore.",
            icon: "fa-camera",
            iconLibrary: "fa",
            iconClass: "icon-water",
            photo: "images/Mandorak Beach.png"
        },
        {
            name: "Lapopu Waterfall",
            position: [-9.678795, 119.492741],
            description: "One of Sumba's most spectacular waterfalls, Lapopu cascades down multiple tiers into a clear natural pool, perfect for a refreshing swim. Surrounded by lush jungle, this hidden gem requires a short hike to reach but rewards visitors with its breathtaking beauty and peaceful atmosphere.",
            icon: "fa-person-hiking",
            iconLibrary: "fa",
            iconClass: "icon-waterfall",
            photo: "images/Lapopu Waterfall.png"
        },
        {
            name: "Air Terjun Laindamuki",
            position: [-9.991977, 120.009692],
            description: "A beautiful multi-tiered waterfall surrounded by lush jungle. With easy access and natural pools for swimming, it's a great stop for a refreshing dip in nature.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-waterfall",
            photo: "images/Air Terjun Laindamuki.png"
        },
        {
            name: "Air Terjun Tanggedu",
            position: [-9.574912, 120.090483],
            description: "Nicknamed 'The Grand Canyon of Sumba,' this stunning tiered waterfall is surrounded by unique rock formations and turquoise pools. The short hike to reach it adds to the adventure.",
            icon: "fa-person-hiking",
            iconLibrary: "fa",
            iconClass: "icon-waterfall",
            photo: "images/Air Terjun Tanggedu.png"
        },
        {
            name: "Air Terjun Wai Marang",
            position: [-9.963813, 120.601731],
            description: "A hidden jungle waterfall featuring a turquoise rock pool, perfect for swimming. The hike through lush forest makes the journey as rewarding as the destination itself.",
            icon: "fa-person-hiking",
            iconLibrary: "fa",
            iconClass: "icon-waterfall",
            photo: "images/Air Terjun Wai Marang.png"
        },
        {
            name: "Walakiri Beach",
            position: [-9.628854, 120.427745],
            description: "Famous for its iconic mangrove trees and magical sunset views, Walakiri Beach is one of Sumba's most photographed spots. The shallow, calm waters make it perfect for a relaxed beach walk.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water",
            photo: "images/Walakiri Beach.png"
        },
        {
            name: "Pantai Tarimbang",
            position: [-9.972773, 119.945693],
            description: "A remote paradise for surfers and nature lovers. With its long stretch of golden sand, powerful surf break, and lush green cliffs, Tarimbang is a true hidden gem for those seeking adventure and solitude.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water",
            photo: "images/Pantai Tarimbang.png"
        },
        {
            name: "Wee Kacura",
            position: [-9.599430, 119.337033],
            description: "A surreal landscape that looks like a scene from Avatar. This unique spot features crystal-clear water flowing over smooth, layered rock formations, creating a natural masterpiece hidden deep in Sumba's wilderness.",
            icon: "fa-camera",
            iconLibrary: "fa",
            iconClass: "icon-water",
            photo: "images/Wee Kacura.png"
        },
        {
            name: "Secret Spring (Hidden Rock Pool)",
            position: [-9.431951, 119.040955],
            description: "A hidden rock pool oasis, perfect for a refreshing swim or an exhilarating jump into its deep, clear waters. Tucked away off the beaten path, this secluded gem is the ultimate spot to escape the heat and experience untouched nature.",
            icon: "fa-person-swimming",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Pantai Hameli Ate",
            position: [-9.468209, 118.978852],
            description: "A peaceful, unspoiled beach with soft sand, crystal-clear waters, and rolling green hills in the background. Perfect for a quiet escape, whether you want to swim, explore, or simply soak in the beauty of Sumba's coastline.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Sumba Sunset Cliff",
            position: [-9.777723, 119.376266],
            description: "A stunning cliffside location offering breathtaking views of the Indian Ocean and spectacular sunsets. This iconic spot is perfect for photography, meditation, or simply taking in the natural beauty of Sumba's coastline.",
            icon: "fa-camera",
            iconLibrary: "fa",
            iconClass: "icon-hill",
            photo: "images/Sumba Sunset Cliff.png"
        }
    ],
    hotels: [
        {
            name: "Nihi Sumba",
            position: [-9.777723, 119.376266],
            description: "Luxury resort offering world-class amenities and experiences, including horseback riding.",
            icon: "fa-horse",
            iconLibrary: "fa",
            iconClass: "icon-horse",
            photo: "images/Nihi Hotel Sumba.png"
        },
        {
            name: "Lelewatu Resort Sumba",
            position: [-9.791145, 119.380839],
            description: "Exclusive resort with traditional Sumbanese architecture and modern luxury.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed",
            photo: "images/Lelewatu Resort Sumba.png"
        },
        {
            name: "Maringi Sumba",
            position: [-9.388728, 119.302076],
            description: "An eco-friendly boutique resort offering beautifully designed bungalows, farm-to-table dining, and a peaceful tropical setting. As part of a hospitality school, your stay supports local students training in sustainable tourism and hospitality. Perfect for travelers looking to relax while contributing to a meaningful cause.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed",
            photo: "images/Maringi Sumba.png"
        },
        {
            name: "Sanurbari Resort",
            position: [-9.751442, 119.307919],
            description: "A peaceful oceanfront retreat offering comfortable stays, delicious dining, and breathtaking views. Perfect for travelers looking to unwind by the beach while enjoying modern amenities in a serene Sumbanese setting.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed",
            photo: "images/Sanurbari Resort.png"
        },
        {
            name: "Ngalung Kalla Retreat",
            position: [-9.746430, 119.284601],
            description: "A remote eco-retreat immersed in nature, offering off-grid bungalows, organic meals, and a chance to disconnect from the modern world. Surrounded by lush jungle and stunning coastline, it's the perfect escape for nature lovers and adventure seekers.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed",
            photo: "images/Ngalung Kalla Retreat.png"
        },
        {
            name: "Cap Karoso",
            position: [-9.529067, 118.935896],
            description: "A luxurious beachside resort blending sustainability, modern design, and Sumbanese culture. With a stunning beachfront, farm-to-table dining, and creative spaces, it offers a unique experience for travelers seeking both relaxation and inspiration.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed",
            photo: "images/Cap KAroso.png"
        },
        {
            name: "Mario Hotel Sumba",
            position: [-9.358636, 119.295182],
            description: "A beachfront hotel with comfortable rooms, a swimming pool, and an on-site restaurant. A great choice for travelers looking for a relaxing stay near the beach with easy access to West Sumba's attractions.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed",
            photo: "images/Mario Hotel .png"
        }
    ],
    cultural: [
        {
            name: "Praijing Village",
            position: [-9.642601, 119.431096],
            description: "A living showcase of Sumbanese culture, Praijing Village is home to traditional thatched-roof houses, megalithic tombs, and a strong sense of community. Surrounded by scenic hills, this village offers a glimpse into the island's rich heritage, where locals still practice age-old traditions. A must-visit for those seeking an authentic cultural experience.",
            icon: "fa-monument",
            iconLibrary: "fa",
            iconClass: "icon-house",
            photo: "images/Praijing Village.png"
        },
        {
            name: "Tarung Village",
            position: [-9.632962, 119.409889],
            description: "One of Sumba's most populated traditional villages, Tarung offers visitors a chance to experience authentic Sumbanese culture. The village is known for its towering traditional houses and skilled artisans. Travelers can explore, interact with locals, and even find small shops selling snacks and handcrafted souvenirs.",
            icon: "fa-monument",
            iconLibrary: "fa",
            iconClass: "icon-house",
            photo: "images/Tarung Village.png"
        },
        {
            name: "Ratenggaro Village",
            position: [-9.627680, 119.002862],
            description: "A historic Sumbanese village known for its towering thatched-roof houses and ancient megalithic tombs. Overlooking a stunning beach, Ratenggaro blends rich cultural heritage with breathtaking coastal scenery. Visitors can explore centuries-old traditions, meet the local community, and take in panoramic ocean views from this unique and sacred site.",
            icon: "fa-monument",
            iconLibrary: "fa",
            iconClass: "icon-house",
            photo: "images/Ratenggaro Village.png"
        },
        {
            name: "Makan Dulu",
            position: [-9.431712, 119.245066],
            description: "A training restaurant serving Indonesian food with a Sumbanese twist. It's a real-life learning environment for students of the Sumba Hospitality School, who learn about either the culinary or food and beverage departments as part of a one-year vocational training programme.",
            icon: "fa-utensils",
            iconLibrary: "fa",
            iconClass: "icon-food",
            photo: "images/Makan Dulu.png"
        }
    ],
    dining: []
}; 