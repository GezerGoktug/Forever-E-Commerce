import { type ChangeEvent, type ClipboardEvent, type FC, type KeyboardEvent, useEffect, useRef, useState } from 'react'
import styles from './PinInput.module.scss'

interface PinInputProps {
    characterLength: number;
    onInputChange?: (val: string) => void;
}

const PinInput: FC<PinInputProps> = ({ characterLength, onInputChange }) => {

    const [characters, setCharacters] = useState(Array.from({ length: characterLength }, () => ''));

    const inputsRef = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        onInputChange?.(characters.join(''))
    }, [characters, onInputChange])


    const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {

        if (!/^\d*$/.test(e.target.value)) return;

        setCharacters(characters.map((val, i) => {
            if (index === i)
                if (e.target.value.length > 1)
                    return e.target.value[1];
                else
                    return e.target.value;
            return val;
        }))

        if (inputsRef.current[index + 1]) {
            const nextInput = inputsRef.current[index + 1];
            nextInput.focus();
            const len = nextInput.value.length;
            nextInput.setSelectionRange(len, len);
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'ArrowRight' && inputsRef.current[index + 1]) {
            const nextInput = inputsRef.current[index + 1];
            nextInput.focus();
            const len = nextInput.value.length;
            nextInput.setSelectionRange(len, len);
        }
        else if (e.key === 'ArrowLeft' && inputsRef.current[index - 1]) {
            const prevInput = inputsRef.current[index - 1];
            prevInput.focus();
            setTimeout(() => {
                const len = prevInput.value.length;
                prevInput.setSelectionRange(len, len);
            }, 0);
        }
    }

    const handlePaste = (e: ClipboardEvent, index: number) => {
        e.preventDefault();

        const copiedText = e.clipboardData.getData('text');

        if (!/^\d*$/.test(copiedText)) return;

        const remainsCharacter = characterLength - index;

        const editedCopiedText = copiedText.substring(0, remainsCharacter).split('');
        setCharacters(characters.map((item, i) => i >= index ? editedCopiedText[i - index] : item))

        const nextInput = inputsRef.current[characterLength - 1];
        nextInput.focus();
        const len = nextInput.value.length;
        nextInput.setSelectionRange(len, len);

    }

    return (
        <div className={styles.pin_input_wrapper}>
            {
                Array.from({ length: characterLength }, (_, i) => i).map((val) => (
                    <span key={`pin_input_characters${characterLength}_pin_${val}`}>
                        <input
                            ref={(el) => {
                                inputsRef.current[val] = el!
                            }}
                            className={styles.pin_input_character}
                            minLength={1}
                            value={characters[val]}
                            type='text'
                            onChange={(e) => handleInput(e, val)}
                            onPaste={(e) => handlePaste(e, val)}
                            placeholder='o'
                            onKeyDown={(e) => handleKeyDown(e, val)}
                        />
                    </span>
                ))
            }
        </div>
    )
}

export default PinInput