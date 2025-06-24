import React from 'react'

export const Button: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={onClick}>
    {label}
  </button>
)
