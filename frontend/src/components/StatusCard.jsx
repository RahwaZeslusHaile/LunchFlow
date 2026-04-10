import { useState, useEffect } from "react";

function StatusCard({ eventId, date }) {
  const steps = ["Start", "1", "2", "3", "Complete"];
  const [stepsData, setStepsData] = useState([]);

  useEffect(() => {
    if (!eventId) return;

    const fetchSteps = async () => {
      try {
        const res = await fetch(`/api/eventStep/${eventId}`);
        if (!res.ok) return;

        const data = await res.json();
        setStepsData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSteps();
  }, [eventId]);

  const allDone =
    stepsData.length > 0 &&
    stepsData.every((s) => s.step_status === "done");

  const labelMap = {
    pending: "Pending",
    in_progress: "In progress",
    done: "Done",
  };

  return (
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        {date || "No Event"} Status
      </h3>

      <div className="flex items-center justify-between gap-3">
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          const stepData = stepsData[index - 1];
          
          const status = stepData?.step_status;

          let color = "bg-slate-200 text-black";

          if (!isFirst && !isLast) {
            if (status === "pending") {
              color = "bg-yellow-300 text-black";
            } else if (status === "in_progress") {
              color = "bg-sky-400 text-black";
            } else if (status === "done") {
              color = "bg-green-400 text-black";
            }
          }

          if (isLast && allDone) {
            color = "bg-green-500 text-black";
          }

          if (isFirst) {
            color = "bg-slate-300 text-black";
          }

          return (
            <div key={index} className="flex items-center w-full">
              
              {/* Step */}
              <div
                className={`flex items-center justify-center text-center
                w-16 h-16 px-1 text-[11px] leading-tight font-medium
                ${
                  isFirst || isLast
                    ? "rounded-2xl shadow-md border border-slate-300"
                    : "rounded-full shadow-md border border-slate-300"
                }
                ${color} transition-all duration-300`}
              >
                {isFirst
                  ? "Start"
                  : isLast
                  ? "Done"
                  : labelMap[status] ||"⏳"}
              </div>

              {/* Line */}
              {index !== steps.length - 1 && (
                <div className="flex-1 h-2 mx-3 rounded bg-slate-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusCard;