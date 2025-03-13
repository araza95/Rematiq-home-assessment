import { RenderCurrentPageLabelProps } from "@react-pdf-viewer/page-navigation";
import { Fragment, memo } from "react";

const PDFHeader: React.FC<{
  CurrentPageLabel: React.ComponentType<{
    children: (props: RenderCurrentPageLabelProps) => React.ReactElement;
  }>;
}> = memo(({ CurrentPageLabel }) => {
  return (
    <div className="flex items-center justify-center p-2 bg-gray-200 border-b border-gray-300">
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
