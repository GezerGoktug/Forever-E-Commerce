import { BiSolidDownArrow } from 'react-icons/bi'
import styles from './SupportAgentPanel.module.scss'
import { motion, type Variants } from 'framer-motion'
import { useMediaQuery } from '@forever/hook-kit'
import { OutsideClickHandler } from '@forever/common-utils'
import { Fragment, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useAskQuestionToAiAgentWithStreamMutation } from '@/services/hooks/mutations/ai.mutations'
import { AxiosError } from 'axios'
import { type AgentMessageType, type IAgentMessage } from '@/types/ai.type'
import { useGetAiConversationByThreadIdQuery } from '@/services/hooks/queries/ai.query'
import { initStreamReader } from '@forever/stream-reader'
import AiAdviseProductsBlock from '../AgentPanelChatBlocks/AiAdviseProductsBlock/AiAdviseProductsBlock'
import FaqQuestionsBlock from '../AgentPanelChatBlocks/FaqQuestionsBlock/FaqQuestionsBlock'
import MessageBlock from '../AgentPanelChatBlocks/MessageBlock/MessageBlock'
import ChatInput, { focusAgentChatInput, triggerAutoSizeTextArea } from '../AgentPanelChatInput/AgentPanelChatInput'
import AgentPanelHeader from '../AgentPanelHeader/AgentPanelHeader'

export const scrollToEndOfChatHistory = () => document.getElementById("agentChatMessageHistoryEnd")?.scrollIntoView({ behavior: "smooth" });

const panelAnimationVariant: Variants = {
    initial: (isSmallWidthDevices) => ({
        width: 0,
        opacity: 0,
        ...(isSmallWidthDevices && { top: "60vh" })
    }),
    animate: (isSmallWidthDevices) => ({
        width: isSmallWidthDevices ? "100vw" : "400px",
        opacity: 1,
        ...(isSmallWidthDevices && { top: 0 })
    }),
    exit: (isSmallWidthDevices) => ({
        width: 0,
        opacity: 0,
        ...(isSmallWidthDevices && { top: "60vh" }),
        transition: {
            width: { delay: 0.4 },
            opacity: { delay: 0.3 },
            ...(isSmallWidthDevices && { top: { delay: 0 } })
        }
    })
};

const getHistoryHeightSize = ({
    isSmallWidthDevices,
    isSmallHeightDevices
}: {
    isSmallWidthDevices: boolean,
    isSmallHeightDevices: boolean
}) => {
    if (isSmallHeightDevices && !isSmallWidthDevices) {
        return "55vh";
    }
    else if (!isSmallHeightDevices && isSmallWidthDevices) {
        return "60vh";
    }
    else {
        return "48vh";
    }
}

const messageHistoryVariant: Variants = {
    initial: () => ({
        maxHeight: "2vh",
        minHeight: "2vh",
        marginBottom: "45px"
    }),
    animate: ({ isSmallWidthDevices, isSmallHeightDevices }) => ({
        maxHeight: getHistoryHeightSize({ isSmallWidthDevices, isSmallHeightDevices }),
        minHeight: getHistoryHeightSize({ isSmallWidthDevices, isSmallHeightDevices }),
        marginBottom: "65px"
    }),
    exit: ({ isSmallWidthDevices }) => ({
        maxHeight: isSmallWidthDevices ? 0 : "2vh",
        minHeight: isSmallWidthDevices ? 0 : "2vh",
        marginBottom: "45px",
        transition: { delay: 0 }
    })
};

const SupportAgentPanel = ({ setShow }: { setShow: Dispatch<SetStateAction<boolean>> }) => {
    const [threadId, setThreadId] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [activeStream, setActiveStream] = useState<string | null>(null);
    const [messages, setMessages] = useState<AgentMessageType[]>([{
        type: "system",
        message: "Hello 👋, I'm Sora, your e-commerce store assistant 😊. How can I help you? Here are some sample questions you can ask me:",
        products: []
    }]);
    const isSmallWidthDevices = useMediaQuery({ maxWidth: 640 });
    const isSmallHeightDevices = useMediaQuery({ maxHeight: 550 });
    const { data, isLoading } = useGetAiConversationByThreadIdQuery(threadId as string, {
        enabled: !!threadId,
        refetchOnWindowFocus: false,
    });

    const { mutateAsync, isPending } = useAskQuestionToAiAgentWithStreamMutation({
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

    useEffect(() => {
        if (sessionStorage.getItem("aiSupportAgentThreadId")) {
            setThreadId(sessionStorage.getItem("aiSupportAgentThreadId") as string);
        }

        setTimeout(() => {
            scrollToEndOfChatHistory();
        }, 1000);
    }, []);


    useEffect(() => {
        if (data?.data && data?.data.length > 0) {
            setMessages(data.data);
        }
    }, [data])

    const askQuestionToAgent = async (question?: string) => {
        if (!question && text.trim().length < 2) {
            toast.error("Text field must be least 2 character length.")
            return;
        }

        const notUpdatedMessages = [...messages];

        try {
            setMessages(prv => [...prv, {
                type: "human",
                isNewMessageAtRecent: true,
                createdAt: new Date().toISOString(),
                message: question || text
            }])
            setTimeout(() => {
                scrollToEndOfChatHistory();
            }, 300);

            const streamer = await mutateAsync({ question: question || text, ...(threadId && { threadId }) })

            await initStreamReader<IAgentMessage>({
                stream: streamer,
                onStreamStart() {
                    setIsStreaming(true);
                    setText("");
                    triggerAutoSizeTextArea();
                },
                onChunkParseToData(parsedData) {

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
                onStreamFinish() {
                    setIsStreaming(false);
                    setTimeout(() => {
                        focusAgentChatInput();
                    }, 300);
                },
            });
        } catch (error) {
            setMessages(notUpdatedMessages);
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
        <OutsideClickHandler disable={isSmallWidthDevices} onOutsideClick={() => setShow(false)}>
            <motion.div
                variants={panelAnimationVariant}
                custom={isSmallWidthDevices}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                    width: { duration: 0.4 },
                    opacity: { duration: 0.5 },
                    ...(isSmallWidthDevices && { top: { duration: 0.4, delay: 0.5 } })
                }}
                className={styles.agent_panel}
            >

                <div className={styles.agent_panel_content}>
                    <AgentPanelHeader setShow={setShow} />
                    <motion.div
                        variants={messageHistoryVariant}
                        custom={{ isSmallWidthDevices, isSmallHeightDevices }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className={styles.agent_panel_message_history}
                        id='messageHistory'
                    >
                        {
                            !isLoading && messages.map((msg, i) => (
                                <Fragment key={`agent-message-` + msg.type + "-" + (msg.stream_id || "") + "-" + i}>
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