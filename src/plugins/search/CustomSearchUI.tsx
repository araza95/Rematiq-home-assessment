// React Imports
import React, { useState } from "react";

// React PDF Viewer Core Imports
import { Icon, MinimalButton, Position, Tooltip } from "@react-pdf-viewer/core";

// React PDF Viewer Search Plugin Imports
import {
  NextIcon,
  PreviousIcon,
  RenderSearchProps,
  searchPlugin,
} from "@react-pdf-viewer/search";

// Style Imports
import "@react-pdf-viewer/search/lib/styles/index.css";

// Component Imports
import CustomInput from "../../components/UI/Inputs";

// Utility Imports
import { cn } from "../../utils/tailwind-cn";

// Icon Imports
import { MdClear } from "react-icons/md";

export const SearchPlugin: React.FC<{
  instance: ReturnType<typeof searchPlugin>;
}> = ({ instance }) => {
  const { Search, clearHighlights } = instance;

  const [inputValue, setInputValue] = useState<string>("");

  const [readyToSearch, setReadyToSearch] = useState<boolean>(false);

  return (
    <Search>
      {(renderSearchProps: RenderSearchProps) => (
        <div
          className={cn(
            "w-full flex items-center justify-center p-4 sm:px-6 sm:py-10 lg:px-8 lg:py-5"
          )}
        >
          <CustomInput
            type="text"
            placeholder="Search in document..."
            value={inputValue}
            onChange={(e) => {
              setReadyToSearch(false);
              setInputValue(e.target.value);
              renderSearchProps.setKeyword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue) {
                if (!readyToSearch) {
                  setReadyToSearch(true);
                  renderSearchProps.search();
                } else {
                  renderSearchProps.jumpToNextMatch();
                }
              }
            }}
            Icon={
              <MdClear
                className="text-gray-400 cursor-pointer"
                onClick={() => {
                  setInputValue("");
                  clearHighlights();
                  renderSearchProps.setKeyword("");
                }}
              />
            }
          />

          <Tooltip
            position={Position.BottomCenter}
            target={
              <button
                style={{
                  background: "#fff",
                  border: "none",
                  borderBottom: `2px solid ${
                    renderSearchProps.matchCase ? "blue" : "transparent"
                  }`,
                  height: "100%",
                  padding: "0 2px",
                }}
                onClick={() =>
                  renderSearchProps.changeMatchCase(
                    !renderSearchProps.matchCase
                  )
                }
              >
                <Icon>
                  <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                  <path d="M4.383 14.725L13.59 14.725" />
                  <path d="M0.5 21.725L3.52 21.725" />
                  <path d="M14.479 21.725L17.5 21.725" />
                  <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                  <path d="M16.92 16.725L20.794 16.725" />
                  <path d="M21.516 21.725L23.5 21.725" />
                </Icon>
              </button>
            }
            content={() => "Match case"}
            offset={{ left: 0, top: 8 }}
          />
          {/* Optionally display match info */}
          {readyToSearch && (
            <div>
              {renderSearchProps.numberOfMatches > 0
                ? `${renderSearchProps.currentMatch} of ${renderSearchProps.numberOfMatches}`
                : "Not found"}
            </div>
          )}
          {readyToSearch &&
            renderSearchProps.keyword &&
            renderSearchProps.numberOfMatches === 0 && (
              <div style={{ padding: "0 8px" }}>Not found</div>
            )}
          <div style={{ padding: "0 2px" }}>
            <Tooltip
              position={Position.BottomCenter}
              target={
                <MinimalButton onClick={renderSearchProps.jumpToPreviousMatch}>
                  <PreviousIcon />
                </MinimalButton>
              }
              content={() => "Previous match"}
              offset={{ left: 0, top: 8 }}
            />
          </div>
          <div style={{ padding: "0 2px" }}>
            <Tooltip
              position={Position.BottomCenter}
              target={
                <MinimalButton onClick={renderSearchProps.jumpToNextMatch}>
                  <NextIcon />
                </MinimalButton>
              }
              content={() => "Next match"}
              offset={{ left: 0, top: 8 }}
            />
          </div>
        </div>
      )}
    </Search>
  );
};
