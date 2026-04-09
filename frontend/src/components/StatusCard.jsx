import { useState } from "react";

function StatusCard() {
  const steps = ["Start", "1", "2", "3", "Complete"];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
            1 APRIL 2026 lunch Status / current week
            </h3>
      <div className="flex items-center justify-between">

        {steps.map((step, index) => {
          const isCircle = index === 0 || index === steps.length - 1;
          const isActive = index <= activeStep;

          return (
            <div key={index} className="flex items-center w-full">
              
              {/* Step */}
              <div
                onClick={() => setActiveStep(index)}
                className={`flex items-center justify-center cursor-pointer transition
                ${isCircle ? "w-10 h-10 rounded-full" : "w-10 h-10 rounded-lg"}
                ${isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}
                `}
              >
                {index === 0
                  ? "S"
                  : index === steps.length - 1
                  ? "✔"
                  : step}
              </div>

              {/* Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded 
                  ${index < activeStep ? "bg-indigo-600" : "bg-slate-200"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 text-xs text-slate-500">
        {/* {steps.map((step, i) => (
          <span key={i}>{step}</span>
        ))} */}
      </div>
    </div>
  );
}

export default StatusCard;