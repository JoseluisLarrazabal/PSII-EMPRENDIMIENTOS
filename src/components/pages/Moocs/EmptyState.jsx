import React from 'react';

const EmptyState = ({ message, actionText, onAction, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon || (
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;