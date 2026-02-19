import React from "react";

interface BackButtonProps {
  onClick: () => void;
  label?: string; // Optional custom label
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back to Administration",
}) => (
  <button
    onClick={onClick}
    className="flex items-center text-sm text-blue-600 font-medium hover:text-blue-800 transition mb-6"
  >
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    {label}
  </button>
);

export default BackButton;
