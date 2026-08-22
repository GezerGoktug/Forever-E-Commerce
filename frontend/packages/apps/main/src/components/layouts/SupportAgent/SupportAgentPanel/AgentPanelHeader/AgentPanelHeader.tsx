import styles from "./AgentPanelHeader.module.scss"
import { BaseImage } from "@forever/ui-kit"
import type { Dispatch, SetStateAction } from "react"
import { FaXmark } from "react-icons/fa6"
import { RiGeminiFill } from "react-icons/ri"

const AgentPanelHeader = ({ setShow }: { setShow: Dispatch<SetStateAction<boolean>> }) => {
    return (
        <div className={styles.agent_panel_header}>
            <div className={styles.agent_panel_header_left}>
                <div className={styles.agent_panel_header_left_avatar}>
                    <RiGeminiFill className={styles.agent_icon} />
                    <BaseImage src="/agent.avif" alt="agent" />
                </div>
                <div className={styles.agent_panel_agent_infos}>
                    <h6>Sora</h6>
                    <span>AI Helpful E-commerce Assistant</span>
                </div>

            </div>
            <div className={styles.agent_panel_header_right}>
                <div onClick={() => setShow(false)} className={styles.agent_panel_header_close_btn}>
                    <FaXmark size={20} />
                </div>
            </div>
        </div>
    )
}

export default AgentPanelHeader