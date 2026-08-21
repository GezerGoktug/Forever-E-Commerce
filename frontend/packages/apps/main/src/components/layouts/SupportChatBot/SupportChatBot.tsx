import styles from './SupportChatBot.module.scss';
import { AnimatePresence, motion } from "framer-motion"
import SupportChatBotPanel from './SupportChatBotPanel/SupportChatBotPanel';
import { useEffect, useState } from 'react';
import SupportChatBotSpeechBubble from './SupportChatBotSpeechBubble/SupportChatBotSpeechBubble';
import { BaseImage } from '@forever/ui-kit';

const SupportChatBot = () => {

    const [show, setShow] = useState(false)
    const [isShowHelpText, setIsShowHelpText] = useState(true)

    useEffect(() => {
        const handleBeforeUnload = () => {
            const threadId = sessionStorage.getItem("aiChatBotThreadId");
            if (!threadId) return;

            const url = import.meta.env.VITE_REACT_API_URL + "/ai/chatbot/thread/" + threadId;
            const data = JSON.stringify({});
            navigator.sendBeacon(url, data);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return (
        <div className={styles.support_chatbot_wrapper}>
            <AnimatePresence>
                {
                    show ? (
                        <SupportChatBotPanel setShow={setShow} />
                    ) : isShowHelpText ? (
                        <SupportChatBotSpeechBubble setIsShowHelpText={setIsShowHelpText} />
                    ) : null
                }

            </AnimatePresence>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={styles.support_chatbot_btn}
                onClick={() => {
                    if (isShowHelpText) setIsShowHelpText(false)
                    setShow(!show)
                }}
            >
                {!show && <div className={styles.glare_effect} />}
                <BaseImage   src="/agent.avif" fetchPriority='high' alt="sora_agent" />
            </motion.div>
        </div>
    )
}

export default SupportChatBot