import { useState, useEffect } from "react";
import getApiUrl from "../api";

function StatusCard({ eventId, date }) {
  const steps = ["Start", "1", "2", "3", "Complete"];
  const stepTitles = ["", "Attendance", "Leftover", "Place Order", ""];
  const [stepsData, setStepsData] = useState([]);

  useEffect(() => {
    if (!eventId) return;

    const fetchSteps = async () => {
      try {
        const res = await fetch(getApiUrl(`/eventStep/${eventId}`));
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

  const formattedDate = date
    ? (() => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      })()
    : null;

  return (
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        {formattedDate || "No Event"} Status
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
              if (index === 3) {
                color = "bg-green-500 text-black";
              } else {
                color = "bg-green-400 text-black";
              }
            }
          }

          if (isLast && allDone) {
            color = "bg-green-500 text-black";
          }

          if (isFirst) {
            if (eventId) {
              color = "bg-green-400 text-black";
            } else {
              color = "bg-slate-300 text-black";
            }
          }

          return (
            <div key={index} className="flex items-center w-full">
  
  <div className="flex flex-col items-center">
    
    {}
    <span className="text-xs mb-1">
      {stepTitles[index]}
    </span>

    {}
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
        ? "Completed"
        : labelMap[status] || (
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
              <circle cx="12" cy="12" r="10" strokeWidth="2" className="text-slate-300" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2" className="text-indigo-400" />
            </svg>
          )}
    </div>
  </div>

  {}
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