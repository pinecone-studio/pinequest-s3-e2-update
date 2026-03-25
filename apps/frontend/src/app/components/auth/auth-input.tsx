import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  id: string;
  label: string;
  error?: string;
};

export function AuthInput({ id, label, error, ...input }: Props) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={
          "h-12 w-full rounded-xl border border-gray-300 bg-white px-3.5 text-gray-900 shadow-sm " +
          "placeholder:text-gray-400 " +
          "focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black " +
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
        }
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
