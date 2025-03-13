import { FunctionComponent, JSX } from "react";

import tubeSpinner from "../../../assets/svg-icons/tube-spinner.svg";

type PdfLoadProgressProps = {
  progress: number;
};

export const PdfLoadProgress: FunctionComponent<
  PdfLoadProgressProps
> = (): JSX.Element => {
  return (
    <div className="box-wrapper">
      <div className="w-full h-full flex justify-center items-center gap-4">
        <div className="max-w-[400px] w-full h-full flex flex-col items-center justify-center gap-[16px]">
          <div className="w-[160px] h-[160px] flex items-center justify-center flex-shrink-0">
            <img
              src={tubeSpinner}
              alt="Loader..."
              className="w-[160px] h-[160px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
