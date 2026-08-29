import styles from './SupportAgent.module.scss';
import { AnimatePresence, motion } from "framer-motion"
import SupportAgentPanel from '../SupportAgentPanel/SupportAgentPanel/SupportAgentPanel';
import { useEffect, useState } from 'react';
import SupportAgentSpeechBubble from '../SupportAgentSpeechBubble/SupportAgentSpeechBubble';
import { BaseImage } from '@forever/ui-kit';

const SupportAgent = () => {

    const [show, setShow] = useState(false)
    const [isShowHelpText, setIsShowHelpText] = useState(true)

    useEffect(() => {
        const handleBeforeUnload = () => {
            const threadId = sessionStorage.getItem("aiSupportAgentThreadId");
            if (!threadId) return;

            const url = import.meta.env.VITE_REACT_API_URL + "/ai/support-agent/thread/" + threadId;
            const data = JSON.stringify({});
            navigator.sendBeacon(url, data);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return (
        <div className={styles.support_agent_wrapper}>
            <AnimatePresence>
                {
                    show ? (
                        <SupportAgentPanel setShow={setShow} />
                    ) : isShowHelpText ? (
                        <SupportAgentSpeechBubble setIsShowHelpText={setIsShowHelpText} />
                    ) : null
                }

            </AnimatePresence>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={styles.support_agent_btn}
                onClick={() => {
                    if (isShowHelpText) setIsShowHelpText(false)
                    setShow(!show)
                }}
            >
                {!show && <div className={styles.glare_effect} />}
                <BaseImage src="/agent.avif" fetchPriority='high' alt="sora_agent" />
            </motion.div>
        </div>
    )
}

export default SupportAgent