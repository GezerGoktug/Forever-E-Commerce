/// <reference types="dom-speech-recognition" />
import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = (initialVal?: string) => {

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [speechData, setSpeechData] = useState<string | null>(null);
    const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (initialVal !== undefined) {
            setSpeechData(initialVal);
        }
    }, [initialVal])


    useEffect(() => {

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Browser not supported speech recognition");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[event.resultIndex];

            const transcript = result[0].transcript;



            if (result.isFinal) {
                setSpeechData((prev) => (prev ? prev + " " + transcript : transcript));
            }

            if (silenceTimer.current) clearTimeout(silenceTimer.current);

            silenceTimer.current = setTimeout(() => {
                recognition.stop();
                setIsListening(false);
            }, 3000);
        };

        recognition.onspeechend = () => {
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
            silenceTimer.current = setTimeout(() => {
                recognition.stop();
                setIsListening(false);
            }, 3000);
        };

        recognition.onerror = (e) => {
            setError(e.message)
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
            setSpeechData(null)
        }

    }, [])

    const startListening = () => {
        setError(null)
        recognitionRef.current?.start();
        setIsListening(true);
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };

    return { startListening, isListening, stopListening, speechData, error }

}

export { useSpeechRecognition };