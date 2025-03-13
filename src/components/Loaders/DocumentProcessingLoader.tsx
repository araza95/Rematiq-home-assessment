import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePDFStore } from '../../store/pdf-store';

interface DocumentLoaderProps {
  pdfId?: string;
}

/**
 * @description DocumentProcessingLoader Component - A modal loader overlay that appears 
 * when a PDF document is processing/loading
 * 
 * @param pdfId - Optional ID of the specific PDF being processed
 * 
 * @returns DocumentProcessingLoader Component
 */
const DocumentProcessingLoader: React.FC<DocumentLoaderProps> = ({ pdfId }) => {
  const { isDocumentLoaded } = usePDFStore();
  
  // If document is loaded, don't show the loader
  if (isDocumentLoaded) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          Document is processing
        </h3>
        <p className="text-slate-300 text-sm">
          Please wait and try again in a moment
        </p>
        {pdfId && (
          <p className="text-xs text-slate-400 mt-2">
            Processing: {pdfId}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentProcessingLoader;