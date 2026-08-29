import { BaseImage } from "@forever/ui-kit"
import styles from "./MessageBlock.module.scss"
import clsx from 'clsx'
import { motion } from "framer-motion"
import type { AgentMessageType } from "@/types/ai.type"
import { memo } from "react"
import { CiClock1 } from "react-icons/ci"
import { formatMessageCreatedDate } from "@/utils/date-utils"

type MessageFieldType = Omit<AgentMessageType, "products">

interface IMessageBlockProps {
    isLoading?: boolean
    message?: MessageFieldType,
    loadingMsgType?: "ai" | "human"
}

const MessageBlock = memo(({ message, isLoading = false, loadingMsgType = "ai" }: IMessageBlockProps) => {

    if (isLoading) {
        return (
            <motion.div
                className={clsx(styles.agent_panel_chat_block_skeleton_message_wrapper, { [styles.is_human_message]: loadingMsgType === "human" })}
            >
                <div className={styles.agent_panel_chat_block_skeleton_message}>
                    {loadingMsgType === "ai" && <BaseImage src="/agent.avif" alt="" />}
                    <div className={clsx(styles.agent_panel_chat_block_skeletons_text, { [styles.is_human_message]: loadingMsgType === "human" })}>
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </motion.div>
        )
    }

    if (!message) {
        return null;
    }
    return (
        <motion.div
            {...(message.type === "system" ? {
                initial: { x: -10, opacity: 0 },
                animate: { x: 0, opacity: 1 },
                transition: { duration: 0.4, delay: 1 }
            } : null)}
            className={clsx(styles.agent_panel_chat_block_message_item, { [styles.is_human_message]: message.type === "human" })}
        >
            <div className={clsx(styles.agent_panel_chat_block_message, { [styles.is_human_message]: message.type === "human" })}>
                {message.type !== "human" && <BaseImage src="/agent.avif" alt="" />}
                <div className={clsx(styles.agent_panel_chat_block_message_content, { [styles.is_human_message]: message.type === "human" })}>
                    <p>{message.message}</p>
                    {message?.createdAt && <div className={clsx(styles.agent_panel_chat_block_message_date, { [styles.is_human_message]: message.type === "human" })}>
                        <CiClock1 size={10} />
                        <span>
                            {formatMessageCreatedDate(message?.createdAt)}
                        </span>
                    </div>}
                </div>
            </div>
        </motion.div>
    )
})

export default MessageBlock