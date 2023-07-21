import React from 'react'

function Input({ name, state, setState, label = false }) {
  return (
    <div className="flex gap-1 flex-col">
      {label && (
        <label htmlFor={name} className="text-teal-light text-lg px-1">
          {name}
        </label>
      )}
      <div>
        <input
          type="text"
          name={name}
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="text-white h-10 text-start focus:outline-none rounded-lg px-5 py-4 bg-input-background"
        />
      </div>
    </div>
  )
}

export default Input
