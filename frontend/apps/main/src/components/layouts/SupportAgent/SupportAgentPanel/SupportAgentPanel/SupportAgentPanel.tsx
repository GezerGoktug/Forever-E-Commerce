import { BiSolidDownArrow } from 'react-icons/bi'
import { PiArrowCounterClockwiseBold, PiChatTeardropDotsFill, PiXCircleFill } from 'react-icons/pi'
import { Button } from '@forever/ui-kit'
import styles from './SupportAgentPanel.module.scss'
import { motion, type Variants } from 'framer-motion'
import { useMediaQuery } from '@forever/hook-kit'
import { OutsideClickHandler } from '@forever/common-utils'
import { Fragment, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useAskQuestionToAiAgentWithStreamMutation } from '@/services/hooks/mutations/ai.mutations'
import { AxiosError } from 'axios'
import { type AgentMessage, type AgentStreamMessage } from '@/types/ai.type'
import { useGetAiConversationByThreadIdQuery } from '@/services/hooks/queries/ai.query'
import { initStreamReader } from '@forever/stream-reader'
import AiAdviseProductsBlock from '../AgentPanelChatBlocks/AiAdviseProductsBlock/AiAdviseProductsBlock'
import FaqQuestionsBlock from '../AgentPanelChatBlocks/FaqQuestionsBlock/FaqQuestionsBlock'
import MessageBlock from '../AgentPanelChatBlocks/MessageBlock/MessageBlock'
import ChatInput from '../AgentPanelChatInput/AgentPanelChatInput'
import AgentPanelHeader from '../AgentPanelHeader/AgentPanelHeader'
import { focusAgentChatInput, scrollToEndOfChatHistory, triggerAutoSizeAgentChatInput } from '../utils'
import { handleShowApiErrorWithToastMessages } from '@/utils/common.utils'
import ErrorBlock from '../AgentPanelChatBlocks/ErrorBlock/ErrorBlock'

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
    const [messages, setMessages] = useState<AgentMessage[]>([{
        type: "system",
        message: "Hello 👋, I'm Sora, your e-commerce store assistant 😊. How can I help you? Here are some sample questions you can ask me:",
        products: []
    }]);
    const isSmallWidthDevices = useMediaQuery({ maxWidth: 640 });
    const isSmallHeightDevices = useMediaQuery({ maxHeight: 550 });
    const { data, isLoading, isError, refetch } = useGetAiConversationByThreadIdQuery(threadId as string, {
        enabled: !!threadId,
        refetchOnWindowFocus: false,
    });

    const mutation = useAskQuestionToAiAgentWithStreamMutation()

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
            toast.error("Please enter at least 2 characters")
            return;
        }

        try {
            setMessages(prev => [...prev, {
                type: "human",
                createdAt: new Date().toISOString(),
                message: question || text
            }])
            setTimeout(() => {
                scrollToEndOfChatHistory();
            }, 300);

            const streamer = await mutation.mutateAsync({ question: question || text, ...(threadId && { threadId }) });

            await initStreamReader<AgentStreamMessage>({
                streamer,
                onStreamStart() {
                    setIsStreaming(true);
                    setText("");
                    triggerAutoSizeAgentChatInput();
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
                onStreamError() {
                    toast.error("Something went wrong while streaming the response")
                },
            });
        } catch (error) {
            setIsStreaming(false);
            if (error instanceof AxiosError) {
                handleShowApiErrorWithToastMessages(error)
            }
        }
    }

    const handleClickRandomQuestionBtn = (question: string) => {
        setText(question);
        triggerAutoSizeAgentChatInput();
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
                    {
                        isError && (
                            <div className={styles.agent_panel_error}>
                                <div className={styles.agent_panel_error_icon}>
                                    <PiChatTeardropDotsFill size={45} />
                                    <PiXCircleFill size={25} className={styles.agent_panel_error_icon_cross} />
                                </div>
                                <h6>Error</h6>
                                <p>
                                    An error occurred while retrieving the message history.
                                </p>
                                <Button onClick={() => refetch()} variant="danger" size='sm'>
                                    <PiArrowCounterClockwiseBold />
                                    REFRESH
                                </Button>
                            </div>
                        )
                    }
                    {!isError && <motion.div
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
                                <Fragment key={`agent-message-${msg.type}-${msg.stream_id ?? ""}-${i}`}>
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

                        {
                            isLoading && <>
                                <MessageBlock isLoading={isLoading} loadingMsgType="human" />
                                <MessageBlock isLoading={isLoading} loadingMsgType="ai" />
                                <MessageBlock isLoading={isLoading} loadingMsgType="human" />
                                <MessageBlock isLoading={isLoading} loadingMsgType="ai" />
                            </>
                        }
                        {mutation.isError &&
                            typeof mutation.error?.response?.data.error.errorMessage === "string" &&
                            <ErrorBlock
                                error={mutation.error?.response?.data.error.errorMessage as string}
                                refetch={() => askQuestionToAgent()}
                            />
                        }
                        <MessageBlock isLoading={mutation.isPending} loadingMsgType="ai" />
                        <div id='agentChatMessageHistoryEnd' />
                    </motion.div>}
                    <ChatInput
                        text={text}
                        setText={setText}
                        isPending={mutation.isPending || isStreaming}
                        askQuestionToAgent={askQuestionToAgent}
                    />
                </div>
                <BiSolidDownArrow size={40} className={styles.agent_panel_arrow} />
            </motion.div >

        </OutsideClickHandler >
    )

}

export default SupportAgentPanel