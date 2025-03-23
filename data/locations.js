const locations = {
    transport: [
        {
            name: "Tambolaka Airport",
            position: [-9.4097, 119.2445],
            description: "The main airport in West Sumba, serving domestic flights from major Indonesian cities.",
            icon: "fa-plane",
            iconLibrary: "fa",
            iconClass: "icon-transport"
        },
        {
            name: "Waikelo Port",
            position: [-9.391270, 119.219794],
            description: "A port in West Sumba, serving as a gateway for sea transportation.",
            icon: "fa-anchor",
            iconLibrary: "fa",
            iconClass: "icon-transport"
        },
        {
            name: "Waingapu Airport",
            position: [-9.669346, 120.298907],
            description: "The main airport in East Sumba, connecting the region to other Indonesian destinations.",
            icon: "fa-plane",
            iconLibrary: "fa",
            iconClass: "icon-transport"
        },
        {
            name: "Waingapu Port",
            position: [-9.642880, 120.248430],
            description: "The main seaport in East Sumba, facilitating maritime transportation and trade.",
            icon: "fa-anchor",
            iconLibrary: "fa",
            iconClass: "icon-transport"
        }
    ],
    tourist: [
        {
            name: "Pantai Kerewei",
            position: [-9.761046, 119.331675],
            description: "A powerful and fast-breaking reef break, best for experienced surfers. This left-hand wave offers hollow sections and long rides, working best on mid to high tide with a solid southwest swell. Beyond surfing, the area around Pantai Kerewei is a beautiful escape with rugged cliffs, golden sand, and a peaceful, untouched feel.",
            icon: "fa-water",
            iconClass: "icon-surf",
            iconLibrary: "fa"
        },
        {
            name: "Pero Surf Break",
            position: [-9.607095, 118.985405],
            description: "A powerful and fast-breaking left-hand reef break that offers rides up to 100 meters or more on the right swell. With a solid southwest swell and mid to high tide, the wave lines up for long, fast rides with hollow sections and multiple turns. At lower tides, the sharp reef becomes more exposed, making it best suited for experienced surfers.",
            icon: "fa-water",
            iconClass: "icon-surf",
            iconLibrary: "fa"
        },
        {
            name: "Bukit Wairinding",
            position: [-9.679697, 120.101302],
            description: "A scenic hilltop offering panoramic views of the surrounding savanna landscape.",
            icon: "fa-mountain",
            iconLibrary: "fa",
            iconClass: "icon-hill"
        },
        {
            name: "RUA Beach",
            position: [-9.765129, 119.413771],
            description: "A beautiful beach known for its clear waters and pristine shoreline.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Weekuri Lake",
            position: [-9.491014, 118.959897],
            description: "A stunning saltwater lake separated from the ocean by limestone rocks.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Ratenggaro Village",
            position: [-9.627680, 119.002862],
            description: "Traditional Sumbanese village known for its high-peaked roofs and megalithic tombs.",
            icon: "fa-house",
            iconLibrary: "fa",
            iconClass: "icon-house"
        },
        {
            name: "Mandorak Beach",
            position: [-9.498578, 118.954658],
            description: "A pristine beach with white sand and crystal-clear waters.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Lapopu Waterfall",
            position: [-9.678795, 119.492741],
            description: "One of Sumba's most impressive waterfalls, surrounded by lush vegetation.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-waterfall"
        },
        {
            name: "Air Terjun Laindamuki",
            position: [-9.991977, 120.009692],
            description: "A beautiful waterfall in East Sumba.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-waterfall"
        },
        {
            name: "Air Terjun Tanggedu",
            position: [-9.574912, 120.090483],
            description: "A scenic waterfall with multiple tiers.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-waterfall"
        },
        {
            name: "Air Terjun Wai Marang",
            position: [-9.963813, 120.601731],
            description: "A hidden waterfall in East Sumba's wilderness.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-waterfall"
        },
        {
            name: "Pantai Walakiri",
            position: [-9.628854, 120.427745],
            description: "A unique beach known for its mangrove trees and sunset views.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Pantai Tarimbang",
            position: [-9.972773, 119.945693],
            description: "A long, curved beach with excellent surf breaks.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Wee Kacura",
            position: [-9.599430, 119.337033],
            description: "A natural pool with crystal clear water.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Pantai Hameli Ate",
            position: [-9.468209, 118.978852],
            description: "A secluded beach with pristine waters and white sand.",
            icon: "fa-umbrella-beach",
            iconLibrary: "fa",
            iconClass: "icon-water"
        },
        {
            name: "Secret Pool",
            position: [-9.431951, 119.040955],
            description: "A hidden natural pool with crystal clear waters, perfect for swimming and relaxation.",
            icon: "fa-water",
            iconLibrary: "fa",
            iconClass: "icon-water"
        }
    ],
    hotels: [
        {
            name: "Nihi Sumba",
            position: [-9.777723, 119.376266],
            description: "Luxury resort offering world-class amenities and experiences, including horseback riding.",
            icon: "fa-horse",
            iconLibrary: "fa",
            iconClass: "icon-horse"
        },
        {
            name: "Lelewatu Resort Sumba",
            position: [-9.791145, 119.380839],
            description: "Exclusive resort with traditional Sumbanese architecture and modern luxury.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed"
        },
        {
            name: "Maringi Sumba",
            position: [-9.388661, 119.301532],
            description: "Beachfront resort with comfortable accommodations.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed"
        },
        {
            name: "Sanubari",
            position: [-9.751442, 119.307919],
            description: "Boutique hotel offering personalized service and local experiences.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed"
        },
        {
            name: "Ngalung Kalla Retreat",
            position: [-9.746430, 119.284601],
            description: "Peaceful retreat with stunning ocean views.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed"
        },
        {
            name: "Cap Karoso",
            position: [-9.529067, 118.935896],
            description: "Modern resort blending luxury with local culture.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed"
        },
        {
            name: "Mario Hotel",
            position: [-9.358636, 119.295182],
            description: "Comfortable hotel in Tambolaka with easy access to transportation.",
            icon: "fa-bed",
            iconLibrary: "fa",
            iconClass: "icon-bed"
        }
    ],
    cultural: [
        {
            name: "Praijing Village",
            position: [-9.642601, 119.431096],
            description: "Traditional village showcasing Sumbanese architecture and culture.",
            icon: "fa-house",
            iconLibrary: "fa",
            iconClass: "icon-house"
        },
        {
            name: "Tarung Village",
            position: [-9.632962, 119.409889],
            description: "Ancient traditional village with authentic Sumbanese houses.",
            icon: "fa-house",
            iconLibrary: "fa",
            iconClass: "icon-house"
        }
    ],
    dining: [
        {
            name: "Makan Dulu",
            position: [-9.431878, 119.244925],
            description: "A popular local restaurant offering authentic Indonesian cuisine. Known for its fresh seafood and traditional Sumbanese dishes.",
            icon: "fa-utensils",
            iconLibrary: "fa",
            iconClass: "icon-dining"
        }
    ]
}; 