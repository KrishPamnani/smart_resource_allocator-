import "maplibre-gl/dist/maplibre-gl.css";

import * as React from "react";
import MapGL, { type MapRef, type MapProps } from "react-map-gl/maplibre";

import { cn } from "@/lib/utils";

const DEFAULT_STYLE = "https://tiles.openfreemap.org/styles/bright";

const Map = React.forwardRef<MapRef, MapProps>(({ className, mapStyle, ...props }, ref) => {
  return (
    <MapGL
      ref={ref}
      mapStyle={mapStyle ?? DEFAULT_STYLE}
      className={cn("h-full w-full", className)}
      attributionControl={false}
      {...props}
    />
  );
});

Map.displayName = "Map";

export { Map, type MapRef };