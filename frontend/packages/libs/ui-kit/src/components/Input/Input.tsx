import clsx from "clsx";
import styles from "./Input.module.scss";
import { useRef, type InputHTMLAttributes, type ElementType, forwardRef, type ChangeEvent, type TextareaHTMLAttributes } from "react";
import { type IconType } from "react-icons";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { triggerInputChange } from "@forever/common-utils";
import { IMaskInput } from "react-imask";

type CommonInputProps = {
  size?: "sm" | "md" | "lg";
  rightIcon?: IconType;
  rightIconSize?: number;
  rightIconOnClick?: () => void;
  inputClassName?: string;
  spinButtonClassname?: string;
  disableSpin?: boolean;
  stepIncrement?: number;
  mask?: string;
};

type InputPropsWithInputElementAttrs = CommonInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { isAutoSize?: false };
type InputPropsWithTextareaElementAttrs = CommonInputProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & { isAutoSize: true };

type InputProps = InputPropsWithInputElementAttrs | InputPropsWithTextareaElementAttrs;

type DefaultInputProps = CommonInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { isAutoSize?: boolean };

const checkClampLogic = (min: number | null, max: number | null, value: number) => {
  return !((min !== null && value < min) || (max !== null && value > max));
}

const Input = forwardRef((inputProps: InputProps, ref) => {
  const {
    isAutoSize = false,
    size = "md",
    rightIcon: Icon,
    rightIconOnClick,
    rightIconSize = 20,
    className,
    inputClassName,
    spinButtonClassname,
    disableSpin = false,
    stepIncrement = 1,
    ...props
  } = inputProps as DefaultInputProps;
  const Component: ElementType = props.mask ? IMaskInput : (isAutoSize ? "textarea" : "input");
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);

  const resize = (el: HTMLInputElement | HTMLTextAreaElement) => {
    if (!el.value) {
      el.style.height = "16px";
      return;
    }
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  const handleOnInput = (e: ChangeEvent<HTMLInputElement>) => {
    if(isAutoSize){
      const el = e.target;
      if (el) resize(el);
    }
  }

  const handleNumberInputSpinClick = (isIncrease: boolean) => {
    const input = inputWrapperRef.current?.getElementsByTagName("input")[0];
    if (input) {
      const newValue = isIncrease ? +input.value + stepIncrement : +input.value - stepIncrement;
      if (
        checkClampLogic(
          props.min ? +props?.min : null,
          props.max ? +props?.max : null,
          newValue
        )) {
        triggerInputChange(input, newValue.toString());
      }
    }
  }

  return (
    <div
      className={clsx(
        styles.input_wrapper,
        styles[size],
        { [styles.isRightIcon]: Icon },
        className
      )}
      ref={inputWrapperRef}
    >
      <Component
        type="text"
        onInput={handleOnInput}
        className={clsx(inputClassName)}
        {...(isAutoSize ? { rows: 1 } : null)}
        {...props}
        ref={ref}
      />
      {(Icon && props.type !== "number") && (
        <Icon
          onClick={rightIconOnClick}
          className={styles.input_right_icon}
          size={rightIconSize}
        />
      )}
      {(props.type === "number" && !disableSpin) && (
        <div className={clsx(styles.input_number_spin, spinButtonClassname)}>
          <div
            className={styles.input_number_spin_button}
            onClick={() => handleNumberInputSpinClick(true)}
          >
            <BiSolidUpArrow />
          </div>
          <div
            className={styles.input_number_spin_button}
            onClick={() => handleNumberInputSpinClick(false)}
          >
            <BiSolidDownArrow />
          </div>
        </div>
      )}
    </div>
  );
});

export default Input;
