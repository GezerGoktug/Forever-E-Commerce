import styles from './AgentPanelChatInput.module.scss'
import { FaSquare, FaXmark } from 'react-icons/fa6'
import { BiSolidSend } from 'react-icons/bi'
import { MdKeyboardVoice } from 'react-icons/md'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import clsx from 'clsx'
import { memo, useEffect, type Dispatch, type KeyboardEvent, type SetStateAction } from 'react'
import { useSpeechRecognition } from '@forever/speech'
import toast from 'react-hot-toast'
import { Input } from '@forever/ui-kit'

export const triggerAutoSizeTextArea = () => {
    const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>("#agentChatInput");

    if (el) {
        setTimeout(() => {
            const event = new Event("input", { bubbles: true });
            el.dispatchEvent(event);
        }, 10)
    }
}

export const focusAgentChatInput = () => document.getElementById("agentChatInput")?.focus();

type AgentPanelChatInputProps = {
    text: string;
    setText: Dispatch<SetStateAction<string>>;
    isPending: boolean;
    askQuestionToAgent: (question?: string) => Promise<void>;
}

const AgentPanelChatInput = memo(({ text, setText, isPending, askQuestionToAgent }: AgentPanelChatInputProps) => {
    const { isListening, startListening, stopListening, error, speechData } = useSpeechRecognition(text);

    useEffect(() => {
        if (speechData && isListening) {
            setText(speechData)
        }
    }, [speechData, isListening])

    useEffect(() => {
        if (error)
            toast.error(error)

    }, [error])

    useEffect(() => {
        if (speechData !== undefined && isListening) {
            triggerAutoSizeTextArea()
        }
    }, [speechData, isListening]);

    const handleClickEnterKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askQuestionToAgent();
        }
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();

            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const value = e.currentTarget.value;

            e.currentTarget.value = value.substring(0, start) + "\n" + value.substring(end);
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;

            setTimeout(() => {
                triggerAutoSizeTextArea();

            }, 30);
        }
    }

    return (
        <div className={styles.agent_panel_chat_input}>
            <Input
                disabled={isPending}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleClickEnterKey}
                value={text}
                className={styles.agent_panel_chat_input_field}
                inputClassName={styles.agent_panel_chat_input_field_item}
                isAutoSize
                placeholder='Enter a word'
                {...(((text.trim().length > 1) && !isPending) && { rightIcon: FaXmark })}
                rightIconOnClick={() => {
                    setText("")
                    triggerAutoSizeTextArea()
                }}
                id='agentChatInput'
            />
            <div
                onClick={() => isListening ? stopListening() : startListening()}
                className={clsx(styles.agent_panel_chat_input_voice_btn, { [styles.is_listening]: isListening })}>
                {
                    isListening ? <FaSquare size={20} /> : <MdKeyboardVoice size={20} />
                }
            </div>
            <div onClick={() => askQuestionToAgent()} className={styles.agent_panel_chat_input_action_btn}>
                {isPending ? <AiOutlineLoading3Quarters className={styles.loading_icon} size={20} /> : <BiSolidSend size={20} />}
            </div>
        </div>
    )
})

export default AgentPanelChatInput
