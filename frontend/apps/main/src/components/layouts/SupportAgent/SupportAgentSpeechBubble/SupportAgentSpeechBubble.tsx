import { FaXmark } from 'react-icons/fa6'
import styles from './SupportAgentSpeechBubble.module.scss'
import { motion } from 'framer-motion'
import { BiSolidDownArrow } from 'react-icons/bi'
import type { Dispatch, SetStateAction } from 'react'

const SupportAgentSpeechBubble = ({ setIsShowHelpText }: { setIsShowHelpText: Dispatch<SetStateAction<boolean>> }) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0, transition: { delay: 0 } }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className={styles.support_agent_speech_bubble_content}>
            <div className={styles.support_agent_speech_bubble_text}>
                <p>
                    Hi, can I help you?
                </p>
                <FaXmark cursor="pointer" onClick={() => setIsShowHelpText(false)} />
            </div>
            <BiSolidDownArrow size={20} className={styles.support_agent_speech_bubble_arrow} />

        </motion.div>
    )
}

export default SupportAgentSpeechBubble