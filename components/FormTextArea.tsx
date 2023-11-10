import {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import classNames from "classnames";

interface IFormTextArea extends InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  title?: string;
  placeholder?: string;
  secondary?: boolean;
  value?: string;
  defaultValue?: string;
  error?: string | boolean;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const FormTextArea: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  IFormTextArea
> = (
  {
    id,
    title,
    placeholder,
    secondary,
    value,
    defaultValue,
    error,
    required,
    disabled,
    maxLength,
    rows,
    onChange,
    onKeyDown,
    ...restProps
  },
  ref
) => {
  const [charCount, setCharCount] = useState<number>(0);

  // Update charCount when value changes internally
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    if (onChange) {
      onChange(e);
    }
  };

  // Update charCount when value changes externally
  useEffect(() => {
    setCharCount(defaultValue ? defaultValue.length : 0);
  }, [defaultValue]);

  const isFullFilled = useMemo(
    () => charCount === maxLength,
    [maxLength, charCount]
  );

  return (
    <div className="relative mt-6 flex flex-col">
      <label
        title={title}
        htmlFor={id}
        className={classNames("block text-secondary font-semibold mb-2", {
          "!text-gray-100 !font-normal": secondary,
        })}
      >
        {title}
        {required && <span className="text-red-500 pl-1">*</span>}
      </label>
      <textarea
        {...restProps}
        id={id}
        className={classNames("w-full px-3 py-2 rounded-3xl", {
          "border border-gray-300 bg-slate-500 bg-opacity-30 text-white":
            secondary,
          "border-2 border-gray-blue border-opacity-50": !secondary,
        })}
        ref={ref}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        aria-label={title}
        maxLength={maxLength}
        rows={rows}
      />
      <span className="text-sm relative left-4 top-1 font-semibold leading-4 text-red-400">
        {error}
      </span>
      <div
        className={classNames("text-right", {
          "text-red-600": isFullFilled,
        })}
      >
        {" "}
        {charCount}/{maxLength}
      </div>
    </div>
  );
};

export default forwardRef(FormTextArea);
