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
        // Force a reflow to ensure the transition works
        tipBox.offsetHeight;
        
        // Update the tip box content with new design
        tipBox.innerHTML = `
            <div class="tip-content" style="
                padding: 32px;
                background: linear-gradient(to bottom, #ffffff, #f8f8f8);
                border-radius: 16px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
                position: relative;
                animation: slideUp 0.5s ease-out;
            ">
                <button class="tip-close-button" onclick="closeTipBox()" style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 16px;
                    height: 16px;
                    border: none;
                    background: none;
                    color: #666;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                ">
                    <i class="fas fa-times"></i>
                </button>

                <h2>WEST SUMBA TRAVEL MAP</h2>

                <div class="tip-container" style="
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: #FFD1D1;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                ">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <i class="fas fa-map-marker-alt" style="
                            color: var(--primary-color);
                            font-size: 19px;
                            margin-top: 2px;
                        "></i>
                        <p style="
                            color: var(--text-color);
                            font-size: 16px;
                            margin: 0;
                            line-height: 1.5;
                            text-align: center;
                            flex: 1;
                        ">
                            Tap the map markers to explore Sumba's stunning spots
                        </p>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <i class="fas fa-route" style="
                            color: var(--primary-color);
                            font-size: 19px;
                            margin-top: 2px;
                        "></i>
                        <p style="
                            color: var(--text-color);
                            font-size: 16px;
                            margin: 0;
                            line-height: 1.5;
                            text-align: center;
                            flex: 1;
                        ">
                            Pick any two points for easy directions
                        </p>
                    </div>
                </div>

                <button class="tip-ok-button" style="
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(255, 56, 92, 0.2);
                    transition: all 0.2s ease;
                    animation: pulse 2s infinite;
                ">
                    Go to Map
                    <i class="fas fa-map"></i>
                </button>
            </div>
        `;
        
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

// Add close tip box function
function closeTipBox() {
    const tipBox = document.querySelector('.tip-box');
    if (tipBox) {
        tipBox.classList.remove('active');
        setTimeout(() => {
            tipBox.style.display = 'none';
        }, 300);
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
        websiteLink.innerHTML = '<i class="fas fa-globe"></i> Visit Website';
        websiteLink.style.cssText = `
            display: inline-block;
            margin: 16px 0;
            padding: 8px 16px;
            background: rgba(255, 56, 92, 0.1);
            color: var(--primary-color);
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
        `;
        content.appendChild(websiteLink);
        console.log('Website link added:', websiteLink);
    }

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
    if (!startLocation) {
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

        // Close any existing popup
        map.closePopup();
    } else {
        const from = startLocation;
        const isMobile = window.innerWidth <= 768;
        
        // Create Google Maps URL for directions
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${from.position[0]},${from.position[1]}&destination=${to.position[0]},${to.position[1]}&travelmode=driving`;

        // Remove any existing route line
        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }

        // Show distance overlay immediately for better responsiveness
        showDistanceOverlay(from, to, directionsUrl);

        const points = [
            L.latLng(from.position[0], from.position[1]),
            L.latLng(to.position[0], to.position[1])
        ];

        // Create a temporary loading line on desktop
        if (!isMobile) {
            routeLine = L.polyline(points, {
                color: '#FF385C',
                weight: 3,
                opacity: 0.4,
                dashArray: '10, 10',
                lineJoin: 'round'
            }).addTo(map);

            // Fit bounds immediately
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, {
                padding: [50, 50],
                duration: 0.3
            });
        }

        // Fetch the actual route using OSRM with a timeout
        const osmrmUrl = `https://router.project-osrm.org/route/v1/driving/${from.position[1]},${from.position[0]};${to.position[1]},${to.position[0]}?overview=full&geometries=geojson`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        fetch(osmrmUrl, { signal: controller.signal })
            .then(response => response.json())
            .then(data => {
                clearTimeout(timeoutId);
                if (data.routes && data.routes[0]) {
                    const actualRoute = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    
                    if (routeLine) {
                        // Smoothly update the route line
                        routeLine.setLatLngs(actualRoute);
                        routeLine.setStyle({
                            opacity: 0.8
                        });
                    } else {
                        // Create new route line if it doesn't exist
                        routeLine = L.polyline(actualRoute, {
                            color: '#FF385C',
                            weight: 3,
                            opacity: 0.8,
                            dashArray: '10, 10',
                            lineJoin: 'round'
                        }).addTo(map);
                    }
                    
                    // Smoothly adjust bounds if needed
                    const newBounds = L.latLngBounds(actualRoute);
                    map.flyToBounds(newBounds, {
                        padding: [50, 50],
                        duration: 0.3
                    });
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error('Error fetching route:', error);
                
                // If no route line exists yet, create one with the straight line
                if (!routeLine) {
                    routeLine = L.polyline(points, {
                        color: '#FF385C',
                        weight: 3,
                        opacity: 0.8,
                        dashArray: '10, 10',
                        lineJoin: 'round'
                    }).addTo(map);
                    
                    // Fit bounds
                    const bounds = L.latLngBounds(points);
                    map.fitBounds(bounds, {
                        padding: [50, 50],
                        duration: 0.3
                    });
                }
            });

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
    }
}

// Show distance overlay for desktop and mobile
function showDistanceOverlay(from, to, directionsUrl) {
    let overlay = document.getElementById('distance-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'distance-overlay';
        overlay.className = 'distance-overlay';
        document.body.appendChild(overlay);
    }

    const isMobile = window.innerWidth <= 768;
    const mobileClass = isMobile ? 'mobile' : '';
    
    // Add website link for Sumba Sunset Cliff and Makan Dulu
    const websiteLinkHtml = to.name === "Sumba Sunset Cliff" || to.name === "Makan Dulu"
        ? `<div class="website-link-container">
            <a href="${to.name === "Sumba Sunset Cliff" ? "https://sumbasunsetcliff.com" : "https://www.sumbahospitalityfoundation.org/makandulu/"}" 
               target="_blank" 
               class="website-link">
                <i class="fas fa-globe"></i> Visit Website
            </a>
           </div>`
        : '';

    overlay.innerHTML = `
        <button class="distance-overlay-close" onclick="closeTravelTime()">
            <i class="fas fa-times"></i>
        </button>
        <div class="distance-overlay-content ${mobileClass}">
            <h3>Travel Information</h3>
            <div class="location-details">
                <h4>From: ${from.name}</h4>
                <p>${from.description}</p>
                
                <h4>To: ${to.name}</h4>
                ${websiteLinkHtml}
                <p>${to.description}</p>
            </div>
            <div class="travel-details" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.1);">
                <div class="tip-container" style="display: flex; align-items: center; margin-bottom: 16px; background: rgba(255, 56, 92, 0.05); padding: 12px; border-radius: 8px;">
                    <i class="fas fa-lightbulb" style="color: var(--primary-color); margin-right: 12px; font-size: 16px;"></i>
                    <p style="color: var(--text-color); font-size: 14px; margin: 0; line-height: 1.4;">
                        Get your directions and travel time with Google Maps
                    </p>
                </div>
                <a href="${directionsUrl}" target="_blank" class="directions-link">
                    <i class="fas fa-directions"></i> Get Directions on Google Maps
                </a>
            </div>
        </div>
    `;
    overlay.classList.add('active');

    // Reset calculation state
    calculatingTravelTime = false;
    startLocation = null;
    
    // Hide UI elements
    const selectionPrompt = document.querySelector('.selection-prompt');
    if (selectionPrompt) {
        selectionPrompt.classList.remove('active');
    }
    document.getElementById('reset-button').classList.remove('active');
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

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initMap); 