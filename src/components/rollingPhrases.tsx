"use client";

import React, { useState, useEffect } from "react";
import "./rolling.css";

const allPhrases = [
  "Issue Tracker",
  "Task Manager",
  "Issue Navigator",
  "Task Monitor",
  "Bug Logger",
  "Problems Tracker",
];

const RollingPhrases: React.FC = () => {
  const [currentPhrases, setCurrentPhrases] = useState<string[]>([]);

  useEffect(() => {
    setCurrentPhrases(allPhrases.slice(0, 3));

    const interval = setInterval(() => {
      setCurrentPhrases((prevPhrases) => {
        if (prevPhrases[0] === allPhrases[0]) {
          return allPhrases.slice(3, 6);
        } else {
          return allPhrases.slice(0, 3);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scene">
      <div className="cube">
        <div className="face phrase1">Issue Organizer</div>
        <div className="face phrase2">{currentPhrases[0]}</div>
        <div className="face phrase3">{currentPhrases[1]}</div>
        <div className="face phrase4">{currentPhrases[2]}</div>
      </div>
    </div>
  );
};

export default RollingPhrases;
