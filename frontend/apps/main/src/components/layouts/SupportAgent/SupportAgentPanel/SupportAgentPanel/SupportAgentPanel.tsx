import { BiSolidDownArrow } from 'react-icons/bi'
import styles from './SupportAgentPanel.module.scss'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@forever/hook-kit'
import { OutsideClickHandler } from '@forever/common-utils'
import { Fragment, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useAskQuestionToAiAgentStreamMutation } from '@/services/hooks/mutations/ai.mutations'
import { AxiosError } from 'axios'
import { type AgentMessageType, type IAgentMessage } from '@/types/ai.type'
import { useGetAiConversationByThreadIdQuery } from '@/services/hooks/queries/ai.query'
import { getDataWithStreamReader } from '@/utils/stream-utils'
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
    const [isStreaming, setIsStreaming] = useState(false);
    const [activeStream, setActiveStream] = useState<string | null>(null);
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

    const { mutateAsync, isPending } = useAskQuestionToAiAgentStreamMutation({
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
        if (!question && text.trim().length < 2) {
            toast.error("Text field must be least 2 character length.")
            return;
        }

        const notUpdatedMessages = [...messages];

        try {
            setMessages((prv) => [...prv, {
                type: "human",
                isNewMessageAtRecent: true,
                createdAt: new Date().toISOString(),
                message: question || text
            }])
            setTimeout(() => {
                scrollToEndOfChatHistory();
            }, 400);

            const stream = await mutateAsync({ question: question || text, ...(threadId && { threadId }) })

            await getDataWithStreamReader<IAgentMessage>({
                stream,
                onStreamStart() {
                    setIsStreaming(true);
                    setText("");
                    triggerAutoSizeTextArea();
                },
                onChunkToParsedData(parsedData) {

                    if (!threadId) {
                        sessionStorage.setItem("aiSupportAgentThreadId", parsedData.threadId)
                        setThreadId(parsedData.threadId)
                    }

                    if (parsedData.stream_id !== activeStream) {
                        setActiveStream(parsedData.stream_id);
                    }

                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastMessageIndex = newMessages.length - 1;
                        const currentLastMessage = newMessages[lastMessageIndex];

                        if (currentLastMessage?.stream_id === parsedData.stream_id && currentLastMessage.type === "ai") {
                            newMessages[lastMessageIndex] = parsedData;
                        }
                        else if (!currentLastMessage?.stream_id) {
                            newMessages.push(parsedData);
                        }

                        return newMessages;
                    });
                },
                onFinishedStream() {
                    setIsStreaming(false);
                    setTimeout(() => {
                        focusAgentChatInput();
                    }, 300);
                },
            });
        } catch (error) {
            setMessages(notUpdatedMessages)
            setIsStreaming(false);
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
                                    <Fragment key={`agent-message-` + msg.stream_id + "-" + i} >
                                        <MessageBlock message={{
                                            message: msg.message,
                                            type: msg.type,
                                            createdAt: msg.createdAt,
                                            isNewMessageAtRecent: activeStream === msg.stream_id
                                        }}
                                        />
                                        {
                                            msg.type === "system" &&
                                            <FaqQuestionsBlock
                                                onSelectQuestion={(question) => handleClickRandomQuestionBtn(question)}
                                            />
                                        }
                                        {
                                            msg.type === "ai" &&
                                            (msg.products && msg.products.length > 0) &&
                                            <AiAdviseProductsBlock
                                                products={msg.products}
                                                isLoading={isStreaming && activeStream === msg.stream_id}
                                            />
                                        }
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
                        isPending={isPending || isStreaming}
                        askQuestionToAgent={askQuestionToAgent}
                    />
                </div>
                <BiSolidDownArrow size={40} className={styles.agent_panel_arrow} />
            </motion.div >

        </OutsideClickHandler >
    )

}

export default SupportAgentPanel