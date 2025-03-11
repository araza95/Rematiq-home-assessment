import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/search/lib/styles/index.css";

export const useCustomSearchPlugin = () => {
  const searchPluginInstance = searchPlugin();
  return searchPluginInstance;
};
