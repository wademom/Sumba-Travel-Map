// Global variables
let map;
let startLocation = null;
let calculatingTravelTime = false;
let routingControl = null;
let routeLine = null;
let markers = new Map(); // Store markers for easy access
let labels = new Map(); // Store labels for easy access

// Get icon HTML based on library
function getIconHtml(icon, library) {
    switch(library) {
        case 'material':
            return `<span class="material-icons">${icon}</span>`;
        case 'fa':
            return `<i class="fa-solid ${icon}"></i>`;
        case 'bi':
            return `<i class="bi ${icon}"></i>`;
        case 'lucide':
            return `<i class="lucide lucide-${icon}" style="width: 18px; height: 18px;"></i>`;
        default:
            return `<span class="material-icons">${icon}</span>`;
    }
}

// Initialize map
function initMap() {
    // Create the map
    map = L.map('map', {
        center: [-9.6725, 119.3906],
        zoom: 9,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Add tile layer with minimal style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20,
        minZoom: 3
    }).addTo(map);

    // Add location markers
    addLocationMarkers();
    markCliffArea();

    // Add selection prompt
    const selectionPrompt = document.createElement('div');
    selectionPrompt.className = 'selection-prompt';
    selectionPrompt.textContent = 'Select a destination';
    document.body.appendChild(selectionPrompt);

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
    resetButton.onclick = resetTravelTime;
    document.body.appendChild(resetButton);

    // Add zoom change handler
    map.on('zoomend', updateLabelsVisibility);
    map.on('moveend', updateLabelsVisibility);
}

// Create marker icon
function createMarkerIcon(location) {
    const iconHtml = `
        <div class="location-marker">
            ${getIconHtml(location.icon, location.iconLibrary)}
        </div>
    `;

    return L.divIcon({
        html: iconHtml,
        className: `location-icon ${location.iconClass || ''}`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

// Add location markers
function addLocationMarkers() {
    Object.values(locations).flat().forEach(location => {
        // Add default icon library if not specified
        location.iconLibrary = location.iconLibrary || 'material';
        
        const marker = L.marker(location.position, { 
            icon: createMarkerIcon(location),
            riseOnHover: true,
            riseOffset: 500,
            zIndexOffset: 1000,
            draggable: false
        })
        .addTo(map);

        // Create label but don't add to map yet
        const label = L.marker(location.position, {
            icon: L.divIcon({
                className: 'location-label hidden',
                html: location.name,
                iconSize: [100, 20],
                iconAnchor: [50, -12]
            }),
            interactive: false,
            zIndexOffset: 999,
            draggable: false
        });

        // Store markers and labels for later use
        markers.set(location.name, marker);
        labels.set(location.name, label);

        // Add hover handlers for marker
        marker.on('mouseover', () => {
            if (!calculatingTravelTime) {
                label.getElement()?.classList.remove('hidden');
                label.addTo(map);
            }
        });

        marker.on('mouseout', () => {
            if (!calculatingTravelTime && !isMobile && map.getZoom() < 11) {
                label.getElement()?.classList.add('hidden');
                map.removeLayer(label);
            }
        });

        // Bind popup and other event handlers
        marker.bindPopup(createPopupContent(location), {
            maxWidth: 300,
            className: 'custom-popup',
            closeButton: true,
            closeOnClick: false,
            autoClose: true
        });

        // Add click handler
        marker.on('click', () => {
            // Close travel information window if it's open
            const distanceOverlay = document.getElementById('distance-overlay');
            if (distanceOverlay && distanceOverlay.classList.contains('active')) {
                distanceOverlay.classList.remove('active');
                if (routeLine) {
                    map.removeLayer(routeLine);
                    routeLine = null;
                }
                if (routingControl) {
                    map.removeControl(routingControl);
                    routingControl = null;
                }
            }

            if (calculatingTravelTime) {
                map.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        layer.closePopup();
                    }
                });
                handleMarkerClick(location, marker);
            } else {
                map.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        layer.closePopup();
                    }
                });
                marker.openPopup();
            }
        });

        // Override popup opening behavior
        marker.off('popupopen').on('popupopen', (e) => {
            if (calculatingTravelTime) {
                marker.closePopup();
            }
        });
    });
}

// Update labels visibility based on zoom level
function updateLabelsVisibility() {
    const zoom = map.getZoom();
    const bounds = map.getBounds();
    const isMobile = window.innerWidth <= 768;
    
    labels.forEach((label, locationName) => {
        const marker = markers.get(locationName);
        if (!marker) return;

        const isInView = bounds.contains(marker.getLatLng());
        
        if (isMobile || (zoom >= 11 && isInView)) {
            label.addTo(map);
            label.getElement()?.classList.remove('hidden');
        } else {
            label.getElement()?.classList.add('hidden');
            map.removeLayer(label);
        }
    });
}

// Create popup content
function createPopupContent(location) {
    const container = document.createElement('div');
    container.className = 'location-popup';

    const imagePlaceholder = document.createElement('div');
    imagePlaceholder.className = 'image-placeholder';
    imagePlaceholder.textContent = 'Image Coming Soon';

    const content = document.createElement('div');
    content.className = 'popup-content';

    const title = document.createElement('h3');
    title.textContent = location.name;

    const description = document.createElement('p');
    description.textContent = location.description;

    const button = document.createElement('button');
    button.className = 'travel-time-btn';
    button.innerHTML = '<i class="fas fa-route"></i> Get Directions From Here';
    button.onclick = () => {
        startLocation = location;
        calculatingTravelTime = true;
        
        // Show the selection prompt
        const selectionPrompt = document.querySelector('.selection-prompt');
        if (selectionPrompt) {
            selectionPrompt.textContent = 'Select destination';
            selectionPrompt.classList.add('active');
        }

        // Show reset button
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.classList.add('active');
        }

        // Close the popup
        map.closePopup();
    };

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(button);

    container.appendChild(imagePlaceholder);
    container.appendChild(content);

    return container;
}

// Handle marker click during travel time calculation
function handleMarkerClick(location, marker) {
    if (calculatingTravelTime && startLocation) {
        // If clicking the same location, just return
        if (location.name === startLocation.name) {
            return;
        }
        
        // Create Google Maps directions URL
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.position[0]},${startLocation.position[1]}&destination=${location.position[0]},${location.position[1]}&travelmode=driving`;
        
        // Check if location is Sumba Sunset Cliff for website link
        const websiteLink = location.name === "Sumba Sunset Cliff" 
            ? '<a href="https://www.sumbasunsetcliff.com" target="_blank" class="website-link"><i class="fas fa-globe"></i> Visit Website</a>'
            : '';

        // Create or update the overlay
        let existingOverlay = document.getElementById('distance-overlay');
        if (!existingOverlay) {
            existingOverlay = document.createElement('div');
            existingOverlay.id = 'distance-overlay';
            existingOverlay.className = 'distance-overlay';
            document.body.appendChild(existingOverlay);
        }

        existingOverlay.innerHTML = `
            <button class="distance-overlay-close" onclick="closeTravelTime()">
                <i class="fas fa-times"></i>
            </button>
            <div class="distance-overlay-content">
                <h3>Travel Information</h3>
                <div class="location-details">
                    <h4>From: ${startLocation.name}</h4>
                    <p>${startLocation.description}</p>
                    
                    <h4>To: ${location.name}</h4>
                    ${websiteLink}
                    <p>${location.description}</p>
                </div>
                <div class="travel-details" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.1);">
                    <p style="color: var(--text-light); font-size: 14px; margin-bottom: 16px;">
                        Click the button below to get accurate travel directions, including real-time traffic conditions and road information.
                    </p>
                    <a href="${directionsUrl}" target="_blank" class="directions-link">
                        <i class="fas fa-directions"></i> Get Directions on Google Maps
                    </a>
                </div>
            </div>
        `;
        existingOverlay.classList.add('active');

        // Remove existing route if any
        if (routingControl) {
            map.removeControl(routingControl);
        }
        if (routeLine) {
            map.removeLayer(routeLine);
        }

        // Create route following roads
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(startLocation.position[0], startLocation.position[1]),
                L.latLng(location.position[0], location.position[1])
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: false,
            lineOptions: {
                styles: [
                    {
                        color: '#FF5A5F',
                        weight: 3,
                        opacity: 0.8,
                        dashArray: '10, 10'
                    }
                ]
            },
            createMarker: function() { return null; },
            addWaypoints: false,
            draggableWaypoints: false,
            show: false
        }).addTo(map);

        // Add route event handler
        routingControl.on('routesfound', function(e) {
            const routes = e.routes;
            const coords = routes[0].coordinates;
            
            // Remove existing route line if any
            if (routeLine) {
                map.removeLayer(routeLine);
            }
            
            // Create new route line with dotted style
            routeLine = L.polyline(coords, {
                color: '#FF5A5F',
                weight: 3,
                opacity: 0.8,
                dashArray: '10, 10'
            }).addTo(map);

            // Fit the map to show the route
            map.fitBounds(routeLine.getBounds(), {
                padding: [50, 50]
            });
        });

        // Reset calculation state
        calculatingTravelTime = false;
        startLocation = null;
        
        // Hide the selection prompt
        const selectionPrompt = document.querySelector('.selection-prompt');
        if (selectionPrompt) {
            selectionPrompt.classList.remove('active');
        }

        // Hide reset button after calculation
        document.getElementById('reset-button').classList.remove('active');
    } else if (!calculatingTravelTime) {
        // If not calculating travel time, just show the popup
        marker.openPopup();
    }
}

// Mark Sumba Sunset Cliff area
function markCliffArea() {
    // Fixed coordinates for Sumba Sunset Cliff area
    const centerPoint = [-9.425511, 119.054617];

    // Create virtual location object for the cliff
    const cliffLocation = {
        name: "Sumba Sunset Cliff",
        position: centerPoint,
        description: "A stunning oceanfront getaway set to become a top spot in West Sumba. Sitting on a high coastal cliff, this hidden gem offers wide-open sunset views over the endless blue sea. With its clear waters, rich marine life, and peaceful surroundings, it's a perfect place for snorkeling, swimming, and relaxing in nature.",
        icon: "fa-sun",
        iconLibrary: "fa",
        iconClass: "icon-cliff"
    };

    const marker = L.marker(centerPoint, { 
        icon: createMarkerIcon(cliffLocation),
        riseOnHover: true,
        riseOffset: 500,
        zIndexOffset: 1000
    })
    .addTo(map);

    // Create label but don't add to map yet
    const label = L.marker(centerPoint, {
        icon: L.divIcon({
            className: 'location-label hidden', // Start hidden
            html: cliffLocation.name,
            iconSize: [100, 20],
            iconAnchor: [50, -12]
        }),
        interactive: false,
        zIndexOffset: 999
    });

    // Store markers and labels
    markers.set(cliffLocation.name, marker);
    labels.set(cliffLocation.name, label);

    // Add hover handlers
    marker.on('mouseover', () => {
        if (!calculatingTravelTime) {
            label.getElement()?.classList.remove('hidden');
            label.addTo(map);
        }
    });

    marker.on('mouseout', () => {
        if (!calculatingTravelTime && !isMobile && map.getZoom() < 11) {
            label.getElement()?.classList.add('hidden');
            map.removeLayer(label);
        }
    });

    // Rest of the cliff marker setup...
    marker.bindPopup(createPopupContent(cliffLocation), {
        maxWidth: 300,
        className: 'custom-popup',
        closeButton: true,
        closeOnClick: false,
        autoClose: true
    });

    marker.on('click', () => {
        const distanceOverlay = document.getElementById('distance-overlay');
        if (distanceOverlay && distanceOverlay.classList.contains('active')) {
            distanceOverlay.classList.remove('active');
            if (routeLine) {
                map.removeLayer(routeLine);
                routeLine = null;
            }
            if (routingControl) {
                map.removeControl(routingControl);
                routingControl = null;
            }
        }

        if (calculatingTravelTime) {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layer.closePopup();
                }
            });
            handleMarkerClick(cliffLocation, marker);
        } else {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layer.closePopup();
                }
            });
            marker.openPopup();
        }
    });

    marker.off('popupopen').on('popupopen', (e) => {
        if (calculatingTravelTime) {
            marker.closePopup();
        }
    });
}

// Reset travel time calculation
function resetTravelTime() {
    calculatingTravelTime = false;
    startLocation = null;

    // Hide the selection prompt
    const selectionPrompt = document.querySelector('.selection-prompt');
    if (selectionPrompt) {
        selectionPrompt.classList.remove('active');
    }

    // Hide reset button
    document.getElementById('reset-button').classList.remove('active');

    // Remove route line and routing control if they exist
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    // Close any open popups
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            layer.closePopup();
        }
    });
}

// Close travel time overlay
function closeTravelTime() {
    const overlay = document.getElementById('distance-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }

    // Remove route line and routing control if they exist
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initMap); 