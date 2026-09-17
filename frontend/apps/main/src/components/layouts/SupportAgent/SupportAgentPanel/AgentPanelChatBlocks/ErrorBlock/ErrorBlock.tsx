import { memo } from "react"
import styles from "./ErrorBlock.module.scss"
import { Button } from "@forever/ui-kit"
import { PiArrowCounterClockwiseBold, PiChatTeardropDotsFill, PiXCircleFill } from "react-icons/pi"

const ErrorBlock = memo(({ error, refetch }: { error?: string, refetch: () => void }) => {
    return (
        <div className={styles.agent_panel_chat_block_error}>
            <div className={styles.agent_panel_chat_block_error_icon}>
                <PiChatTeardropDotsFill size={35} />
                <PiXCircleFill size={20} className={styles.agent_panel_chat_block_error_icon_cross} />
            </div>
            <div className={styles.agent_panel_chat_block_error_content}>
                <h6>Error</h6>
                <p>
                    {error || "An error occurred while send message to agent."}
                </p>

            </div>
            <Button onClick={() => refetch()} variant="danger" size="icon">
                <PiArrowCounterClockwiseBold />
            </Button>
        </div>
    )
})

export default ErrorBlock
