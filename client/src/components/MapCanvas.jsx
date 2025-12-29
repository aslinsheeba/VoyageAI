import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { locations } from "../data/dummyLocations"

export default function MapCanvas() {
  return (
    <MapContainer
      center={[34.9671, 135.7727]}
      zoom={13}
      className="absolute inset-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {locations.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
        >
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
