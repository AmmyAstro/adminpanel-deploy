"use client";

export default function CustomToggle({ id, label, checked, onChange }) {
  return (
    <div className="grid grid-cols-2 ">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative place-self-end inline-flex h-5 w-11 items-center rounded-full transition cursor-pointer ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
