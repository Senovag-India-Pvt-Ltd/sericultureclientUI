import React, { useState, useEffect } from "react";

export const TimeTicker = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
      // console.log(date.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //     var timer = setInterval(()=>setDate(new Date()), 1000 )
  //     return function cleanup() {
  //         clearInterval(timer)
  //     }

  // });

  return (
    <p className="clock">
      {" "}
      {date.toLocaleDateString([], { weekday: "long" })},{" "}
      {date.toLocaleDateString([], { month: "long" })} {date.getDate()},{" "}
      {date.getFullYear()} {date.toLocaleTimeString()}
    </p>
  );
};

export default TimeTicker;
