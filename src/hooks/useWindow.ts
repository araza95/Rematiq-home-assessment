import { useEffect, useState, useCallback } from "react";

/**
 * @description Hook that returns the window dimensions
 *
 * @returns {width: number, height: number} dimensions - The window dimensions
 *
 * @example
 * const { width, height } = useDimension();
 *
 */
export const useDimension = (): { width: number; height: number } => {
  // Get the window dimensions from the window object
  const { innerWidth: width, innerHeight: height } = window;

  const [dimensions, setDimensions] = useState({
    width,
    height,
  });

  const handleResize = useCallback(() => {
    setDimensions({
      width,
      height,
    });
  }, [width, height]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return dimensions;
};
