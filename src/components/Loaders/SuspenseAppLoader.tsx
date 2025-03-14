import { FunctionComponent } from "react";

const SuspenseAppLoader: FunctionComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          {/* Outer pulse animation */}
          <div className="absolute inset-0 rounded-full bg-slate-600 opacity-30 animate-ping"></div>

          {/* Inner spinning circle */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700 animate-spin">
            <div className="w-8 h-8 rounded-full bg-slate-700"></div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-semibold tracking-wide">Loading</h2>
          <div className="flex space-x-1">
            <span
              className="w-2 h-2 rounded-full bg-slate-100 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></span>
            <span
              className="w-2 h-2 rounded-full bg-slate-100 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-2 h-2 rounded-full bg-slate-100 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspenseAppLoader;
