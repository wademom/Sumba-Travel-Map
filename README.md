# Sumba Interactive Map

An interactive map showcasing various locations in Sumba, Indonesia. The map features tourist attractions, hotels, cultural sites, and transportation hubs, with travel time calculation capabilities between locations.

## Features

- Interactive markers for various locations
- Location categories: Transport, Tourist Attractions, Hotels, Cultural Sites, and Dining
- Travel time calculation between any two points
- Route visualization with dotted lines
- Popup information for each location
- Integration with Google Maps for detailed directions
- Mobile-responsive design

## Project Structure

```
.
├── index.html           # Main HTML file
├── css/
│   └── styles.css      # Custom styles
├── js/
│   └── map.js          # Map functionality
└── data/
    └── locations.js    # Location data
```

## Dependencies

- [Leaflet](https://leafletjs.com/) v1.9.4 - Main mapping library
- [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) v3.2.12 - Route calculation
- [Font Awesome](https://fontawesome.com/) v6.0.0 - Icons
- [Material Icons](https://fonts.google.com/icons) - Google's Material Design icons
- [Bootstrap Icons](https://icons.getbootstrap.com/) v1.11.1 - Bootstrap icon set
- [Lucide Icons](https://lucide.dev/) v0.294.0 - Additional icon set

## Setup

1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - the project uses CDN-hosted dependencies

## Usage

- Click on any marker to view location information
- Click "Calculate Travel Time" in a location's popup to start route calculation
- Select another location to view the route and travel information
- Click "Get Directions on Google Maps" for detailed driving directions

## Browser Support

The map is tested and works on modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 