"use client";
import React from "react";
import Countdown from "react-countdown";

const endingDate = new Date("2023-08-29");

const CountDown = () => {
  return (
    <Countdown
      className="text-yellow-300 text-3xl xl:text-5xl font-bold uppercase"
      date={endingDate}
    />
  );
};

export default CountDown;
