// Global variables
let map;
let startLocation = null;
let calculatingTravelTime = false;
let routingControl = null;
let routeLine = null;
let markers = new Map(); // Store markers for easy access
let labels = new Map(); // Store labels for easy access

// Location tracking variables
let userMarker = null;
let userCircle = null;
let isTrackingLocation = false;
let userLocation = null;

// Initialize location button
const useLocationButton = document.getElementById('use-location-button');
const useCurrentLocationButton = document.getElementById('use-current-location');

// Location button click handler
useLocationButton.addEventListener('click', () => {
    if (!isTrackingLocation) {
        startLocationTracking();
    } else {
        stopLocationTracking();
    }
});

// Current location button in overlay click handler
useCurrentLocationButton.addEventListener('click', () => {
    if (userLocation) {
        // Use current location as starting point
        startLocation = {
            name: "Your Current Location",
            position: userLocation,
            description: "Your current position"
        };
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
    } else {
        startLocationTracking();
    }
});

// Get icon HTML based on library
function getIconHtml(icon, library) {
    switch(library) {
        case 'material':
            return `<span class="material-icons">${icon}</span>`;
        case 'fa':
            return `<i class="fas ${icon}"></i>`;
        case 'bi':
            return `<i class="bi ${icon}"></i>`;
        case 'lucide':
            return `<i class="lucide lucide-${icon}" style="width: 18px; height: 18px;"></i>`;
        default:
            return `<i class="fas ${icon}"></i>`;
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

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd'
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

    // Show tip box
    showTipBox();
}

// Show tip box function
function showTipBox() {
    const tipBox = document.querySelector('.tip-box');
    if (tipBox) {
        // Show the tip box
        tipBox.style.display = 'block';
        setTimeout(() => {
            tipBox.classList.add('active');
        }, 100);

        // Add click handler for OK button
        const okButton = tipBox.querySelector('.tip-ok-button');
        if (okButton) {
            okButton.onclick = () => {
                tipBox.classList.remove('active');
                setTimeout(() => {
                    tipBox.style.display = 'none';
                }, 300);
            };
        }
    }
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

// Create popup content
function createPopupContent(location) {
    const container = document.createElement('div');
    container.className = 'location-popup';

    // Add photo container if location has a photo
    if (location.photo) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'image-container';
        
        const img = document.createElement('img');
        img.src = location.photo;
        img.alt = location.name;
        img.className = 'location-image';
        img.loading = 'lazy';
        img.decoding = 'async';
        
        // Add error handling for image
        img.onerror = () => {
            console.error(`Failed to load image for ${location.name}`);
            photoContainer.remove();
        };
        
        photoContainer.appendChild(img);
        container.appendChild(photoContainer);
    }

    const content = document.createElement('div');
    content.className = 'popup-content';

    const title = document.createElement('h3');
    title.textContent = location.name;

    const description = document.createElement('p');
    description.textContent = location.description;

    // Add website link for Sumba Sunset Cliff and Makan Dulu
    if (location.name === "Sumba Sunset Cliff" || location.name === "Makan Dulu") {
        console.log('Adding website link for:', location.name);
        const websiteLink = document.createElement('a');
        websiteLink.href = location.name === "Sumba Sunset Cliff" 
            ? "https://sumbasunsetcliff.com" 
            : "https://www.sumbahospitalityfoundation.org/makandulu/";
        websiteLink.target = "_blank";
        websiteLink.className = "website-link";
        websiteLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit website';
        content.appendChild(websiteLink);
        console.log('Website link added:', websiteLink);
    }

    const button = document.createElement('button');
    button.className = 'travel-time-btn';
    button.innerHTML = '<i class="fas fa-route"></i> Get Directions From Here';
    button.onclick = () => {
        // Set the start location
        startLocation = location;
        
        // Create the travel window content
        const from = {
            name: location.name,
            position: location.position,
            description: location.description
        };
        
        // Create a temporary "To" location for the initial display
        const to = {
            name: "Select Destination",
            position: null,
            description: "Choose a destination or use your current location"
        };
        
        // Create initial content HTML
        let contentHTML = `
            <button class="distance-overlay-close" onclick="closeDistanceOverlay()">
                <i class="fas fa-times"></i>
            </button>
            <div class="location-details">
                <h4>From</h4>
                <p>${from.name}</p>
                <h4>To</h4>
                <p>${to.name}</p>
            </div>
            <div class="travel-details">
                <p>Choose how to get directions:</p>
                <div class="direction-options">
                    <button class="use-location-button" onclick="startLocationTracking()">
                        <i class="fas fa-location-arrow"></i>
                        Use My Current Location
                    </button>
                    <p class="or-text">or</p>
                    <p class="select-destination-text">Select a destination on the map</p>
                </div>
            </div>
        `;
        
        // Create or update the overlay
        let overlay = document.getElementById('distance-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'distance-overlay';
            overlay.className = 'distance-overlay';
            document.body.appendChild(overlay);
        }
        
        const content = document.createElement('div');
        content.className = 'distance-overlay-content';
        content.innerHTML = contentHTML;
        overlay.innerHTML = '';
        overlay.appendChild(content);
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        
        // Add mobile class for responsive styling
        if (window.innerWidth <= 768) {
            content.classList.add('mobile');
        }

        // Close the popup
        map.closePopup();
    };

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(button);
    container.appendChild(content);

    return container;
}

// Add click handler for markers
function addLocationMarkers() {
    Object.values(locations).flat().forEach(location => {
        // Add default icon library if not specified
        location.iconLibrary = location.iconLibrary || 'material';
        
        const marker = L.marker(location.position, { 
            icon: createMarkerIcon(location),
            riseOnHover: true,
            riseOffset: 2000,
            zIndexOffset: 1000,
            draggable: false,
            bubblingMouseEvents: false
        })
        .addTo(map);

        // Create label but don't add to map yet
        const label = L.marker(location.position, {
            icon: L.divIcon({
                className: 'location-label hidden',
                html: location.name,
                iconSize: [0, 0],
                iconAnchor: [0, -12]
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
                marker.setZIndexOffset(2000);
                label.getElement()?.classList.remove('hidden');
                label.addTo(map);
            }
        });

        marker.on('mouseout', () => {
            if (!calculatingTravelTime && !isMobile && map.getZoom() < 11) {
                marker.setZIndexOffset(1000);
                label.getElement()?.classList.add('hidden');
                map.removeLayer(label);
            }
        });

        // Add click handler
        function handleClick(e) {
            // Prevent event propagation
            L.DomEvent.stopPropagation(e);
            
            // Close any existing popups and clean up
            map.eachLayer((layer) => {
                if (layer instanceof L.Popup) {
                    map.removeLayer(layer);
                }
                if (layer instanceof L.Marker) {
                    layer.closePopup();
                    layer.unbindPopup();  // Unbind existing popup
                }
            });

            // Remove any existing route line if we're not calculating travel time
            if (!calculatingTravelTime && routeLine) {
                map.removeLayer(routeLine);
                routeLine = null;
            }

            // Bring clicked marker to front
            marker.setZIndexOffset(3000);

            if (calculatingTravelTime) {
                handleMarkerClick(location, marker);
            } else {
                const popupContent = createPopupContent(location);
                
                // Create and bind a new popup
                const popup = L.popup({
                    closeButton: true,
                    autoClose: true,
                    closeOnEscapeKey: true,
                    closeOnClick: true,
                    maxWidth: 320,
                    className: 'custom-popup'
                })
                .setContent(popupContent);

                // Add cleanup on popup close
                popup.on('remove', () => {
                    marker.setZIndexOffset(1000);
                    if (popup._content) {
                        const images = popup._content.getElementsByTagName('img');
                        for (let img of images) {
                            img.src = '';
                            img.remove();
                        }
                    }
                });

                marker.bindPopup(popup).openPopup();
            }
        }

        marker.on('click', handleClick);
    });
}

// Create mobile-optimized popup
function createMobilePopup(content, marker) {
    // Remove any existing overlays first
    removePopupOverlay();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'leaflet-popup-overlay';
    document.body.appendChild(overlay);

    // Create popup
    const popup = L.popup({
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
        className: 'custom-popup',
        maxWidth: window.innerWidth <= 768 ? (window.innerHeight > window.innerWidth ? 320 : 400) : 320
    })
    .setLatLng(marker.getLatLng())
    .setContent(content);

    // Add close handler to both overlay and popup
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            removePopupOverlay();
            map.closePopup();
        }
    });

    popup.on('remove', () => {
        removePopupOverlay();
    });

    // Bind and open popup
    marker.bindPopup(popup).openPopup();

    // Center map on marker
    map.setView(marker.getLatLng(), map.getZoom(), {
        animate: true,
        duration: 0.3
    });
}

// Remove popup overlay
function removePopupOverlay() {
    const overlay = document.querySelector('.leaflet-popup-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Also remove any stuck popups
    const popups = document.querySelectorAll('.leaflet-popup');
    popups.forEach(popup => {
        if (!popup.parentElement?.classList.contains('leaflet-popup-pane')) {
            popup.remove();
        }
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

// Handle marker click during travel time calculation
function handleMarkerClick(to, marker) {
    if (isTrackingLocation && userLocation) {
        // Scenario 2: User has enabled location tracking
        const from = {
            name: "Your Current Location",
            position: userLocation,
            description: "Your current position"
        };
        
        // Create Google Maps URL for directions
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${to.position[0]},${to.position[1]}&travelmode=driving`;

        // Show distance overlay with current location
        showDistanceOverlay(from, to, directionsUrl);

        // Reset state
        calculatingTravelTime = false;
        startLocation = null;

        // Hide UI elements
        const selectionPrompt = document.querySelector('.selection-prompt');
        if (selectionPrompt) {
            selectionPrompt.classList.remove('active');
        }
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.classList.remove('active');
        }

        // Close the popup
        map.closePopup();
    } else if (!startLocation) {
        // Scenario 1: User is starting a new route
        startLocation = to;
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
    } else {
        // Scenario 3: User is selecting second point
        const from = startLocation;
        
        // Create Google Maps URL for directions
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${from.position[0]},${from.position[1]}&destination=${to.position[0]},${to.position[1]}&travelmode=driving`;

        // Show distance overlay
        showDistanceOverlay(from, to, directionsUrl);

        // Reset state
        calculatingTravelTime = false;
        startLocation = null;

        // Hide UI elements
        const selectionPrompt = document.querySelector('.selection-prompt');
        if (selectionPrompt) {
            selectionPrompt.classList.remove('active');
        }
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.classList.remove('active');
        }

        // Close the popup
        map.closePopup();
    }
}

// Show distance overlay
function showDistanceOverlay(from, to, directionsUrl) {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('distance-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'distance-overlay';
        overlay.className = 'distance-overlay';
        document.body.appendChild(overlay);
    }

    // Create content
    const content = document.createElement('div');
    content.className = 'distance-overlay-content';
    
    // Create content HTML
    let contentHTML = `
        <button class="distance-overlay-close" onclick="closeDistanceOverlay()">
            <i class="fas fa-times"></i>
        </button>
        <div class="location-details">
            <h4>From</h4>
            <p>${from.name}</p>
            <h4>To</h4>
            <p>${to.name}</p>
        </div>
        <div class="travel-details">
            <p>Get directions to ${to.name}</p>
            <a href="${directionsUrl}" target="_blank" class="directions-link">
                <i class="fas fa-directions"></i>
                Open in Google Maps
            </a>
        </div>
    `;
    
    content.innerHTML = contentHTML;
    overlay.innerHTML = '';
    overlay.appendChild(content);
    overlay.style.display = 'flex';
    overlay.classList.add('active');
    
    // Add mobile class for responsive styling
    if (window.innerWidth <= 768) {
        content.classList.add('mobile');
    }
}

// Close distance overlay
function closeDistanceOverlay() {
    const overlay = document.getElementById('distance-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
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
        iconClass: "icon-cliff",
        photo: "./images/Sumba Sunset Cliff.png"
    };

    const marker = L.marker(centerPoint, { 
        icon: createMarkerIcon(cliffLocation),
        riseOnHover: true,
        riseOffset: 2000,
        zIndexOffset: 1000,
        draggable: false,
        bubblingMouseEvents: false
    })
    .addTo(map);

    // Create label but don't add to map yet
    const label = L.marker(centerPoint, {
        icon: L.divIcon({
            className: 'location-label hidden',
            html: cliffLocation.name,
            iconSize: [0, 0],
            iconAnchor: [0, -12]
        }),
        interactive: false,
        zIndexOffset: 999,
        draggable: false
    });

    // Store markers and labels
    markers.set(cliffLocation.name, marker);
    labels.set(cliffLocation.name, label);

    // Add hover handlers
    marker.on('mouseover', () => {
        if (!calculatingTravelTime) {
            marker.setZIndexOffset(2000);
            label.getElement()?.classList.remove('hidden');
            label.addTo(map);
        }
    });

    marker.on('mouseout', () => {
        if (!calculatingTravelTime && !isMobile && map.getZoom() < 11) {
            marker.setZIndexOffset(1000);
            label.getElement()?.classList.add('hidden');
            map.removeLayer(label);
        }
    });

    // Add click handler using the same function as other markers
    function handleClick(e) {
        // Prevent event propagation
        L.DomEvent.stopPropagation(e);
        
        // Close any existing popups and clean up
        map.eachLayer((layer) => {
            if (layer instanceof L.Popup) {
                map.removeLayer(layer);
            }
            if (layer instanceof L.Marker) {
                layer.closePopup();
                layer.unbindPopup();  // Unbind existing popup
            }
        });

        // Remove any existing route line if we're not calculating travel time
        if (!calculatingTravelTime && routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }

        // Bring clicked marker to front
        marker.setZIndexOffset(3000);

        if (calculatingTravelTime) {
            handleMarkerClick(cliffLocation, marker);
        } else {
            const popupContent = createPopupContent(cliffLocation);
            
            // Create and bind a new popup
            const popup = L.popup({
                closeButton: true,
                autoClose: true,
                closeOnEscapeKey: true,
                closeOnClick: true,
                maxWidth: 320,
                className: 'custom-popup'
            })
            .setContent(popupContent);

            // Add cleanup on popup close
            popup.on('remove', () => {
                marker.setZIndexOffset(1000);
                if (popup._content) {
                    const images = popup._content.getElementsByTagName('img');
                    for (let img of images) {
                        img.src = '';
                        img.remove();
                    }
                }
            });

            marker.bindPopup(popup).openPopup();
        }
    }

    marker.on('click', handleClick);
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

    // Remove route line and routing control
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
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    // Reset calculation state but keep the route line visible
    calculatingTravelTime = false;
    startLocation = null;

    // Hide UI elements
    const selectionPrompt = document.querySelector('.selection-prompt');
    if (selectionPrompt) {
        selectionPrompt.classList.remove('active');
    }
    document.getElementById('reset-button').classList.remove('active');

    // Close any open popups and clean up properly
    map.eachLayer((layer) => {
        if (layer instanceof L.Popup) {
            map.removeLayer(layer);
        }
        if (layer instanceof L.Marker) {
            layer.closePopup();
            layer.unbindPopup();
        }
    });

    // Reset marker z-indices
    markers.forEach((marker) => {
        marker.setZIndexOffset(1000);
    });
}

function handleTravelTimeClick(destination) {
    if (window.innerWidth <= 768) {
        // On mobile, directly open Google Maps
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
        window.open(googleMapsUrl, '_blank');
    } else {
        // On desktop, show the distance overlay
        showDistanceOverlay(destination);
    }
}

function toggleLocation() {
    if (!isTrackingLocation) {
        startLocationTracking();
    } else {
        stopLocationTracking();
    }
}

// Start location tracking
function startLocationTracking() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    isTrackingLocation = true;
    useLocationButton.classList.add('active');
    useLocationButton.innerHTML = '<i class="fas fa-location-crosshairs"></i> Stop Tracking';

    navigator.geolocation.watchPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            userLocation = [lat, lng];

            if (!userMarker) {
                // Create user marker
                userMarker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<i class="fas fa-location-crosshairs"></i>',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    })
                }).addTo(map);

                // Create accuracy circle
                userCircle = L.circle([lat, lng], {
                    radius: accuracy,
                    color: '#FF385C',
                    fillColor: '#FF385C',
                    fillOpacity: 0.15,
                    weight: 2
                }).addTo(map);
            } else {
                // Update user marker and circle
                userMarker.setLatLng([lat, lng]);
                userCircle.setLatLng([lat, lng]);
                userCircle.setRadius(accuracy);
            }

            // Center map on user location
            map.setView([lat, lng], map.getZoom());
        },
        (error) => {
            console.error('Error getting location:', error);
            alert('Unable to get your location. Please check your location settings.');
            stopLocationTracking();
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// Stop location tracking
function stopLocationTracking() {
    isTrackingLocation = false;
    useLocationButton.classList.remove('active');
    useLocationButton.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Current Location';

    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
    if (userCircle) {
        map.removeLayer(userCircle);
        userCircle = null;
    }
    userLocation = null;
}

// Update showDistanceOverlay function
function showDistanceOverlay() {
    const overlay = document.getElementById('distance-overlay');
    overlay.style.display = 'flex';
    
    // Update button text based on whether we have user location
    const useCurrentLocationButton = document.getElementById('use-current-location');
    if (userLocation) {
        useCurrentLocationButton.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Current Location';
    } else {
        useCurrentLocationButton.innerHTML = '<i class="fas fa-location-crosshairs"></i> Enable Location Tracking';
    }
}

// Add styles for the user location marker and button
const style = document.createElement('style');
style.textContent = `
    .user-location-marker {
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        border: 3px solid var(--primary-color);
        box-shadow: 0 0 0 2px white;
    }

    .use-location-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px 0;
        padding: 8px 16px;
        background: white;
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        color: var(--primary-color);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .use-location-btn:hover {
        background: var(--primary-color);
        color: white;
    }

    .or-text {
        margin: 12px 0;
        color: #666;
        font-size: 14px;
    }
`;
document.head.appendChild(style);

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    showTipBox(); // Make sure to call showTipBox after initMap
}); 