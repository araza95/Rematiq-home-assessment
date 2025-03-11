import { useEffect, useState, useCallback } from "react";

/**
 * @description A custom React hook that provides real-time window dimensions.
 * This hook tracks and updates the width and height of the browser window as it resizes.
 *
 * @returns {Object} An object containing:
 *   - width: {number} The current width of the window in pixels.
 *   - height: {number} The current height of the window in pixels.
 *
 * Key Features:
 * - Initializes with the current window dimensions.
 * - Updates dimensions in real-time as the window is resized.
 * - Uses a memoized resize handler to optimize performance.
 * - Automatically removes the event listener on component unmount to prevent memory leaks.
 *
 * @example
 * const { width, height } = useDimension();
 * console.log(`Window size: ${width}x${height}`);
 */
export const useDimension = (): {
  width: number;
  height: number;
} => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove width dependency

  return dimensions;
};
