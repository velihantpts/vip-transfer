"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Location } from "./MapSection";

const airportIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:40px;height:40px;background:#0071E3;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,113,227,0.35);border:2.5px solid white">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function makeDestIcon(isSelected: boolean, price: number) {
  const bg = isSelected ? "#0071E3" : "#1D1D1F";
  const shadow = isSelected ? "0 4px 16px rgba(0,113,227,0.4)" : "0 2px 8px rgba(0,0,0,0.15)";
  const size = isSelected ? 48 : 36;
  const priceText = `₺${price.toLocaleString()}`;
  return new L.DivIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="width:${size * 0.7}px;height:${size * 0.7}px;background:${bg};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:${shadow};border:2.5px solid white;transition:all 0.2s">
        <svg width="${size * 0.3}" height="${size * 0.3}" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="4"/></svg>
      </div>
      <div style="background:${bg};color:white;font-size:10px;font-weight:600;padding:2px 6px;border-radius:6px;white-space:nowrap;box-shadow:${shadow}">${priceText}</div>
    </div>`,
    iconSize: [size, size + 20],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyTo({ airport, dest }: { airport: Location; dest: Location | null }) {
  const map = useMap();
  useEffect(() => {
    if (dest) {
      const bounds = L.latLngBounds([airport.lat, airport.lng], [dest.lat, dest.lng]);
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 11, duration: 0.8 });
    } else {
      map.flyTo([36.75, 30.6], 8, { duration: 0.8 });
    }
  }, [map, airport, dest]);
  return null;
}

export default function MapView({
  airport,
  destinations,
  selected,
  onSelect,
}: {
  airport: Location;
  destinations: Location[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const selectedDest = destinations.find((d) => d.id === selected) || null;

  // Midpoint for distance label
  const midLat = selectedDest ? (airport.lat + selectedDest.lat) / 2 : 0;
  const midLng = selectedDest ? (airport.lng + selectedDest.lng) / 2 : 0;

  return (
    <MapContainer center={[36.75, 30.6]} zoom={8} style={{ width: "100%", height: "100%" }} zoomControl={false} attributionControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" className="leaflet-tile-layer" />
      <style>{`.dark .leaflet-tile-layer { filter: invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9); }`}</style>
      <FlyTo airport={airport} dest={selectedDest} />

      {/* Airport pulse ring */}
      <CircleMarker center={[airport.lat, airport.lng]} radius={20} pathOptions={{ color: "#0071E3", fillColor: "#0071E3", fillOpacity: 0.06, weight: 1, opacity: 0.2 }} />

      {/* Airport marker */}
      <Marker position={[airport.lat, airport.lng]} icon={airportIcon}>
        <Tooltip direction="top" offset={[0, -24]} permanent className="!bg-text !text-white !text-[10px] !font-semibold !rounded-lg !px-2.5 !py-1 !shadow-lg !border-0">
          📍 {airport.name}
        </Tooltip>
      </Marker>

      {/* All destinations */}
      {destinations.map((dest) => (
        <Marker
          key={dest.id}
          position={[dest.lat, dest.lng]}
          icon={makeDestIcon(selected === dest.id, dest.price!)}
          eventHandlers={{ click: () => onSelect(dest.id) }}
        >
          <Tooltip direction="top" offset={[0, -30]} className="!bg-white !text-text !text-[11px] !font-medium !rounded-lg !px-3 !py-1.5 !shadow-lg !border !border-border-light">
            <strong>{dest.name}</strong><br />
            <span style={{ color: "#86868B", fontSize: "10px" }}>{dest.km} km · {dest.min} dk</span>
          </Tooltip>
        </Marker>
      ))}

      {/* Route line — dashed */}
      {selectedDest && (
        <>
          <Polyline
            positions={[[airport.lat, airport.lng], [selectedDest.lat, selectedDest.lng]]}
            pathOptions={{ color: "#0071E3", weight: 2.5, dashArray: "8, 6", opacity: 0.5 }}
          />
          {/* Distance label at midpoint */}
          <CircleMarker center={[midLat, midLng]} radius={0} pathOptions={{ opacity: 0 }}>
            <Tooltip direction="top" offset={[0, 0]} permanent className="!bg-text !text-white !text-[10px] !font-semibold !rounded-lg !px-2.5 !py-1 !shadow-lg !border-0">
              {selectedDest.km} km · ~{selectedDest.min} dk
            </Tooltip>
          </CircleMarker>
        </>
      )}

      {/* Guide overlay when nothing selected */}
      {!selected && (
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "rgba(29,29,31,0.85)", backdropFilter: "blur(8px)", color: "white", fontSize: 12, fontWeight: 500, padding: "8px 16px", borderRadius: 12, pointerEvents: "none", whiteSpace: "nowrap" }}>
          Haritadan veya listeden bir destinasyon seçin
        </div>
      )}
    </MapContainer>
  );
}
