// src/components/EmptyState.jsx
import React from "react";
import { AlertCircle } from "lucide-react"; // icon

export default function EmptyState({ message, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">
        Nothing to show here
      </h2>
      <p className="text-gray-400 mb-6">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 text-white font-medium shadow-lg hover:opacity-90 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
