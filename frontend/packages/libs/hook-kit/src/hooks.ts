import { type DependencyList, type Dispatch, type ReactNode, type RefObject, type SetStateAction, useEffect, useRef, useState } from "react";

const useMultipleStepForm = (comps: ReactNode[]) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = () => {
        if (currentStep < comps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return {
        next,
        prev,
        step: comps[currentStep],
    };
};


const useDebounce = <T>(value: T, delay: number = 500): [T, Dispatch<SetStateAction<T>>, T] => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [text, setText] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(text);
        }, delay);

        return () => clearTimeout(timer);
    }, [text, delay]);

    return [debouncedValue, setText, text];
};

const useClickOutside = (
    el: RefObject<HTMLElement>,
    onOutsideClick: () => void = () => { },
    disable: boolean = false
) => {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!disable && !el.current?.contains(e.target as Node)) {
                onOutsideClick();
            }
        }
        if (!disable) {
            document.addEventListener("click", handleClickOutside, { capture: true });
        }
        else {
            document.removeEventListener("click", handleClickOutside, { capture: true });
        }
        return () => {
            document.removeEventListener("click", handleClickOutside, { capture: true });
        }
    }, [disable, el, onOutsideClick])
}


const useEffectIgnoreFirst = (effect: () => void, dependencyList: DependencyList, unmount: () => void = () => { }) => {
    const firstRenderRef = useRef(false);

    useEffect(() => {
        if (firstRenderRef.current) {
            effect();
        }
        firstRenderRef.current = true
        return () => unmount();
    }, [...dependencyList, firstRenderRef])
}

const useMediaQuery = ({
    maxWidth = null,
    minWidth = 0,
    minHeight = 0,
    maxHeight = null
}: {
    maxWidth?: number | null,
    minWidth?: number,
    maxHeight?: number | null,
    minHeight?: number
}) => {
    const [isCorrectScreenSize, setIsCorrectScreenSize] = useState(false);

    useEffect(() => {
        const handleResizeScreen = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            if (
                ((maxWidth === null || width < maxWidth) && width > minWidth) &&
                ((maxHeight === null || height < maxHeight) && height > minHeight)
            ) {
                setIsCorrectScreenSize(true);
            }
            else {
                setIsCorrectScreenSize(false);
            }
        }
        handleResizeScreen();
        window.addEventListener("resize", handleResizeScreen);
        return () => {
            document.removeEventListener("resize", handleResizeScreen);
        }
    }, [])
    return isCorrectScreenSize;
}

export { useEffectIgnoreFirst, useClickOutside, useDebounce, useMultipleStepForm, useMediaQuery }