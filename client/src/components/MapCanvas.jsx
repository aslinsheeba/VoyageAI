import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// --- ICONS ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- COMPONENT: HANDLE USER LOCATION ---
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    // Creating a custom control button for "Locate Me"
    const locateControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: function () {
        const btn = L.DomUtil.create("button", "leaflet-bar leaflet-control leaflet-control-custom");
        btn.style.backgroundColor = "white";
        btn.style.width = "35px";
        btn.style.height = "35px";
        btn.style.border = "2px solid rgba(0,0,0,0.2)";
        btn.style.cursor = "pointer";
        btn.style.borderRadius = "4px";
        btn.innerHTML = "🎯"; // Target icon
        btn.title = "Show my location";
        
        btn.onclick = () => {
          map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 14); // Zoom in to user
          });
        };
        return btn;
      },
    });

    const controlInstance = new locateControl();
    map.addControl(controlInstance);

    return () => {
      map.removeControl(controlInstance);
    };
  }, [map]);

  // If location found, show a Blue Dot (Circle)
  return position === null ? null : (
    <Circle 
      center={position} 
      pathOptions={{ fillColor: 'blue', fillOpacity: 0.5, color: 'white' }} 
      radius={200} // 200 meters accuracy circle
    >
      <Popup>You are here</Popup>
    </Circle>
  );
}

// --- COMPONENT: AUTO-CENTER ON TRIP ---
function MapUpdater({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (locations && locations.length > 0) {
      const firstLoc = locations.find(l => l.lat && l.lng);
      if (firstLoc) {
        map.flyTo([firstLoc.lat, firstLoc.lng], 12);
      }
    }
  }, [locations, map]);
  return null;
}

// --- MAIN MAP COMPONENT ---
export default function MapCanvas({ locations = [] }) {
  const defaultCenter = [20.5937, 78.9629]; 

  return (
    <MapContainer center={defaultCenter} zoom={5} className="w-full h-full z-0">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; CARTO'
      />
      
      {/* 1. Updates map when you select a trip */}
      <MapUpdater locations={locations} />
      
      {/* 2. Adds the "Locate Me" button & Blue Dot */}
      <LocationMarker />

      {/* 3. Render Trip Pins */}
      {locations.map((loc, index) => (
        loc.lat && loc.lng ? (
          <Marker key={index} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="text-gray-900 font-bold">{loc.name}</div>
              <div className="text-gray-600 text-xs capitalize">{loc.type}</div>
              <div className="text-green-600 text-xs font-bold">₹{loc.cost}</div>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  );
}