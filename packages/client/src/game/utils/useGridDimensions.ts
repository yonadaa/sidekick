import { useEffect, useState } from "react";

const TILE_SIZE = 32; // 2rem = 32px
const MIN_TILES = { x: 20, y: 10 }; // Minimum grid size

export function useGridDimensions() {
  const [dimensions, setDimensions] = useState({
    xTiles: MIN_TILES.x,
    yTiles: MIN_TILES.y,
  });

  useEffect(() => {
    function updateDimensions() {
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate maximum number of tiles that can fit, adding one extra tile to ensure full coverage
      const maxXTiles = Math.floor(viewportWidth / TILE_SIZE) + 1;
      const maxYTiles = Math.floor(viewportHeight / TILE_SIZE) + 1;

      // Use the larger of minimum tiles or what fits in the viewport
      setDimensions({
        xTiles: Math.max(MIN_TILES.x, maxXTiles),
        yTiles: Math.max(MIN_TILES.y, maxYTiles),
      });
    }

    // Initial calculation
    updateDimensions();

    // Update on window resize
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return dimensions;
}
