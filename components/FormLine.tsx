import {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  KeyboardEvent,
} from "react";

import classNames from "classnames";

interface IFormLine extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type?: string;
  isRowDirection?: boolean;
  title?: string;
  placeholder?: string;
  secondary?: boolean;
  value?: string;
  error?: string | boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const FormLine: ForwardRefRenderFunction<HTMLInputElement, IFormLine> = (
  {
    id,
    type,
    isRowDirection,
    title,
    placeholder,
    secondary,
    value,
    error,
    required,
    disabled,
    className,
    onChange,
    onKeyDown,
    ...restProps
  },
  ref
) => {
  return (
    <div
      className={classNames("relative mt-6 flex w-full", {
        "flex-col md:flex-row": isRowDirection,
        "flex-col": !isRowDirection,
      })}
    >
      <label
        title={title}
        htmlFor={id}
        className={classNames("block text-secondary font-semibold mb-2", {
          "!text-gray-100 !font-normal": secondary,
          "md:w-96": isRowDirection,
        })}
      >
        {title}
        {required && "*"}
      </label>
      <input
        {...restProps}
        id={id}
        className={classNames("w-full px-3 py-2", className, {
          "rounded-xl border border-gray-300 bg-slate-500 bg-opacity-30 text-white":
            secondary,
          "border-2 rounded-full border-gray-blue border-opacity-50":
            !secondary,
        })}
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-label={title}
      />
      <span className="text-sm relative left-4 top-1 font-semibold leading-4 text-red-400">
        {error}
      </span>
    </div>
  );
};

export default forwardRef(FormLine);
