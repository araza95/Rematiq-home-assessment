import { FunctionComponent, JSX } from "react";

import tubeSpinner from "../../../assets/svg-icons/tube-spinner.svg";
import { cn } from "../../lib/utils";

type PdfLoadProgressProps = {
  progress: number;
};

export const PdfLoadProgress: FunctionComponent<PdfLoadProgressProps> = ({
  progress,
}): JSX.Element => {
  return (
    <div className="box-wrapper">
      <div className="w-full h-full flex justify-center items-center gap-4">
        <div className="max-w-[400px] w-full h-full flex flex-col items-center justify-center gap-[16px]">
          <div className="w-[60px] h-[60px] flex items-center justify-center flex-shrink-0">
            <img
              src={tubeSpinner}
              alt="Loader..."
              className="w-[60px] h-[60px]"
            />
            <div
              style={{ width: `${progress}%` }}
              className={cn(
                "pdf-reading-indicator",
                "w-[100%] h-[31px] bg-[#ffffff] dark:bg-button-bg-dark rounded-[8px] px-[16px] py-[12px] mb-[10px]"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
