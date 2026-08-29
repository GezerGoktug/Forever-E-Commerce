import { BiSolidDownArrow } from 'react-icons/bi'
import styles from './SupportAgentPanel.module.scss'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@forever/hook-kit'
import { OutsideClickHandler } from '@forever/common-utils'
import { Fragment, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useAskQuestionToAiAgentMutation } from '@/services/hooks/mutations/ai.mutations'
import { AxiosError } from 'axios'
import { type AgentMessageType } from '@/types/ai.type'
import { useGetAiConversationByThreadIdQuery } from '@/services/hooks/queries/ai.query'
import AiAdviseProductsBlock from '../AgentPanelChatBlocks/AiAdviseProductsBlock/AiAdviseProductsBlock'
import FaqQuestionsBlock from '../AgentPanelChatBlocks/FaqQuestionsBlock/FaqQuestionsBlock'
import MessageBlock from '../AgentPanelChatBlocks/MessageBlock/MessageBlock'
import ChatInput, { focusAgentChatInput, triggerAutoSizeTextArea } from '../AgentPanelChatInput/AgentPanelChatInput'
import AgentPanelHeader from '../AgentPanelHeader/AgentPanelHeader'

export const scrollToEndOfChatHistory = () => document.getElementById("agentChatMessageHistoryEnd")?.scrollIntoView({ behavior: "smooth" });

const SupportAgentPanel = ({ setShow }: { setShow: Dispatch<SetStateAction<boolean>> }) => {
    const [threadId, setThreadId] = useState<string | null>(null);

    useEffect(() => {
        if (sessionStorage.getItem("aiSupportAgentThreadId")) {
            setThreadId(sessionStorage.getItem("aiSupportAgentThreadId") as string);
        }
    }, []);

    const { data, isLoading } = useGetAiConversationByThreadIdQuery(threadId as string, {
        enabled: !!threadId,
        refetchOnWindowFocus: false,
    });


    const [text, setText] = useState("");
    const [messages, setMessages] = useState<AgentMessageType[]>([{
        type: "system",
        message: "Hello 👋, I'm Sora, your e-commerce store assistant 😊. How can I help you? Here are some sample questions you can ask me:",
        products: []
    }])

    useEffect(() => {
        if (data?.data && data?.data.length > 0) {
            setMessages(data.data);
        }
    }, [data])


    const isSmallDevices = useMediaQuery({ maxWidth: 550, minWidth: 400 });
    const isXSmallDevices = useMediaQuery({ maxWidth: 400 });

    const { mutateAsync, isPending } = useAskQuestionToAiAgentMutation({
        onSuccess(data) {
            setMessages(prv => [...prv, { type: "ai", message: data.data.message, createdAt: data.data.createdAt, products: data.data.products }])
            if (!threadId) {
                sessionStorage.setItem("aiSupportAgentThreadId", data.data.threadId)
                setThreadId(data.data.threadId)
            }
            setText("");
            setTimeout(() => {

                focusAgentChatInput();
            }, 300);
            triggerAutoSizeTextArea();
        },
        onError(error) {
            const apiError = error?.response?.data?.error.errorMessage;
            if (typeof apiError === "string") toast.error(apiError);
            if (apiError && typeof apiError === "object") {
                Object.entries(apiError).forEach(([key, value]) => {
                    value.forEach((val) => {
                        toast.error(`${key} : ${val}`);
                    });
                });
            }
        }
    })

    const getPanelWidthSize = () => {
        if (isSmallDevices) {
            return "90vw"
        } else if (isXSmallDevices) {
            return "100vw";
        }
        else {
            return "400px"
        }
    }

    const askQuestionToAgent = async (question?: string) => {

        const notUpdatedMessages = [...messages];

        try {
            setMessages((prv) => [...prv, {
                type: "human",
                isNewMessageAtRecent: true,
                createdAt: new Date().toISOString(),
                message: question || text
            }])
            setTimeout(() => {
                scrollToEndOfChatHistory()
            }, 10);
            await mutateAsync({ question: question || text, ...(threadId && { threadId }) })
        } catch (error) {
            setMessages(notUpdatedMessages)
            if (error instanceof AxiosError) {
                const apiError = error?.response?.data?.error.errorMessage;
                if (typeof apiError === "string") toast.error(apiError);
                if (apiError && typeof apiError === "object") {
                    Object.entries(apiError).forEach(([key, value]) => {
                        (value as string[]).forEach((val) => {
                            toast.error(`${key} : ${val}`);
                        });
                    });
                }
            }
        }
    }

    const handleClickRandomQuestionBtn = (question: string) => {
        setText(question);
        triggerAutoSizeTextArea();
        setTimeout(async () => {
            await askQuestionToAgent(question);
        }, 500);
    }

    return (
        <OutsideClickHandler onOutsideClick={() => isXSmallDevices ? setShow(false) : null}>
            <motion.div
                initial={{ width: 0, opacity: 0, ...(isXSmallDevices && { top: "70vh" }) }}
                animate={{ width: getPanelWidthSize(), opacity: 1, ...(isXSmallDevices && { top: 0 }) }}
                exit={{ width: 0, opacity: 0, ...(isXSmallDevices && { top: "70vh" }), transition: { width: { delay: 0.4 }, opacity: { delay: 0.3 }, ...(isXSmallDevices && { top: { delay: 0 } }) } }}
                transition={{ width: { duration: 0.4 }, opacity: { duration: 0.5 }, ...(isXSmallDevices && { top: { duration: 0.4, delay: 0.5 } }), }}
                className={styles.agent_panel}>

                <div className={styles.agent_panel_content}>
                    <AgentPanelHeader setShow={setShow} />
                    <motion.div
                        initial={{ maxHeight: isXSmallDevices ? 0 : "2vh" }}
                        animate={{ maxHeight: isXSmallDevices ? "70vh" : "45vh" }}
                        exit={{ maxHeight: isXSmallDevices ? 0 : "2vh", transition: { delay: 0 } }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        className={styles.agent_panel_message_history}
                        id='messageHistory'
                    >
                        <motion.div
                            initial={{ display: "none" }}
                            animate={{ display: "block" }}
                            exit={{ display: "none", transition: { display: { delay: 0 } } }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            style={{ height: isXSmallDevices ? "70vh" : "45vh", width: "100%" }}
                        >
                            {
                                !isLoading && messages.map((msg, i) => (
                                    <Fragment key={`agent-message-` + msg.products + "-" + i} >
                                        <MessageBlock message={{
                                            message: msg.message,
                                            type: msg.type,
                                            createdAt: msg.createdAt,
                                            isNewMessageAtRecent: msg.isNewMessageAtRecent
                                        }}
                                        />
                                        {
                                            msg.type === "system" && <FaqQuestionsBlock onSelectQuestion={(question) => handleClickRandomQuestionBtn(question)} />
                                        }
                                        {msg.type === "ai" && msg.products && msg.products.length > 0 && <AiAdviseProductsBlock products={msg.products} />}
                                    </Fragment>
                                ))
                            }

                            {isLoading && <>
                                <MessageBlock isLoading={isLoading} loadingMsgType="human" />
                                <MessageBlock isLoading={isLoading} loadingMsgType="ai" />
                                <MessageBlock isLoading={isLoading} loadingMsgType="human" />
                                <MessageBlock isLoading={isLoading} loadingMsgType="ai" />
                            </>}
                            <MessageBlock isLoading={isPending} loadingMsgType="ai" />
                            <div id='agentChatMessageHistoryEnd' />
                        </motion.div>
                    </motion.div>
                    <ChatInput
                        text={text}
                        setText={setText}
                        isPending={isPending}
                        askQuestionToAgent={askQuestionToAgent}
                    />
                </div>
                <BiSolidDownArrow size={40} className={styles.agent_panel_arrow} />
            </motion.div >

        </OutsideClickHandler >
    )

}

export default SupportAgentPanel