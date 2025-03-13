import { RenderCurrentPageLabelProps } from "@react-pdf-viewer/page-navigation";
import { Fragment, memo } from "react";

const PDFHeader: React.FC<{
  CurrentPageLabel: React.ComponentType<{
    children: (props: RenderCurrentPageLabelProps) => React.ReactElement;
  }>;
}> = memo(({ CurrentPageLabel }) => {
  return (
    <div className="w-[85%] m-auto flex items-center justify-center py-3 px-2 bg-gradient-to-b from-slate-900 to-slate-950">
      <CurrentPageLabel>
        {(props: RenderCurrentPageLabelProps) => (
          <Fragment>
            {`${props.currentPage + 1} ${
              props.pageLabel === `${props.currentPage + 1}`
                ? ""
                : props.pageLabel
            } of ${props.numberOfPages}`}
          </Fragment>
        )}
      </CurrentPageLabel>
    </div>
  );
});

export default PDFHeader;
