import { BiSolidDownArrow, BiSolidSend } from 'react-icons/bi'
import styles from './SupportChatBotPanel.module.scss'
import { MdInput, MdKeyboardVoice } from 'react-icons/md'
import { FaSquare, FaXmark } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import { RiGeminiFill } from 'react-icons/ri'
import clsx from 'clsx'
import { useMediaQuery } from '@forever/hook-kit'
import { OutsideClickHandler } from '@forever/common-utils'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useSpeechRecognition } from '@forever/speech'
import toast from 'react-hot-toast'
import { useAskQuestionToAiChatbotMutation } from '@/services/hooks/mutations/ai.mutations'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { AxiosError } from 'axios'
import { type MessageType } from '@/types/ai.type'
import { useGetAiConversationThreadByThreadIdQuery } from '@/services/hooks/queries/ai.query'
import { BaseImage, Input } from '@forever/ui-kit'
import AiAdviseProductsBlock from './ChatBotPanelBlocks/AiAdviseProducts/AiAdviseProductsBlock'

const exampleQuestions = [
    // 🔹 Product & Search (productLookupTool)
    [
        "Can you show me affordable winterwear for men under $60?",
        "Find kids' topwear with the highest ratings.",
        "Show me women's dresses sorted by newest arrivals.",
    ],
    [
        "What are the best-rated products in the men's collection?",
        "Find winterwear for women priced between $50 and $120.",
        "Show me kids’ bottomwear available in size SMALL.",
    ],
    [
        "List top 5 products related to 'denim jackets' for men.",
        "Find eco-friendly coats for women under $100.",
        "Show me the latest arrivals in the Kids category.",
    ],

    // 🔹 Brand & Company (PDF: Company Profile)
    [
        "Who is FOREVER as a brand?",
        "What makes FOREVER’s clothing sustainable?",
        "What is FOREVER’s mission and vision?",
    ],
    [
        "Where are FOREVER’s products manufactured?",
        "When was FOREVER established?",
        "What does FOREVER mean by 'timeless fashion'?",
    ],

    // 🔹 Shipping, Returns & Orders (PDF: FAQ)
    [
        "How long does delivery take?",
        "Do you ship internationally?",
        "How can I track my order?",
    ],
    [
        "What is the return policy?",
        "Can I exchange an item for a different size?",
        "How can I report a damaged product?",
    ],
    [
        "What payment methods do you accept?",
        "Can I cancel or modify my order?",
        "Do you offer gift wrapping options?",
    ],

    // 🔹 Promotions & Membership
    [
        "Do you offer discounts or seasonal sales?",
        "Is there a loyalty or membership program?",
        "How can I get notified about upcoming promotions?",
    ],

    // 🔹 Contact & Support
    [
        "How can I contact FOREVER support?",
        "What is the customer service email?",
        "Do you have social media accounts I can follow?",
    ]
];

const triggerAutoSizeTextArea = () => {
    const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>("#chatbotInput");

    if (el) {
        setTimeout(() => {
            const event = new Event("input", { bubbles: true });
            el.dispatchEvent(event);
        }, 10)
    }
}

const SupportChatBotPanel = ({ setShow }: { setShow: Dispatch<SetStateAction<boolean>> }) => {
    const [threadId, setThreadId] = useState<string | null>(null);

    useEffect(() => {
        if (sessionStorage.getItem("aiChatBotThreadId")) {
            setThreadId(sessionStorage.getItem("aiChatBotThreadId") as string);
        }
    }, []);

    const { data } = useGetAiConversationThreadByThreadIdQuery(threadId as string, {
        enabled: !!threadId,
        refetchOnWindowFocus: false,
    });


    const [ramdomNumber] = useState(() => Math.floor(Math.random() * 10));

    const [text, setText] = useState("");
    const [messages, setMessages] = useState<(MessageType & { isFirstMessage?: boolean })[]>([{
        type: "ai",
        isFirstMessage: true,
        message: "Hello 👋, I'm Sora, your e-commerce store assistant 😊. How can I help you? Here are some sample questions you can ask me:",
        products: [],
    }])

    useEffect(() => {
        if (data?.data && data?.data.length > 0) {
            setMessages(data.data);
        }
    }, [data])


    const isSmallDevices = useMediaQuery({ maxWidth: 550, minWidth: 400 });
    const isXSmallDevices = useMediaQuery({ maxWidth: 400 });

    const { isListening, startListening, stopListening, error, speechData } = useSpeechRecognition(text);

    const { mutateAsync, isPending } = useAskQuestionToAiChatbotMutation({
        onSuccess(data) {
            setMessages(prv => [...prv, { type: "ai", message: data.data.message, products: data.data.products }])
            if (!threadId) {
                sessionStorage.setItem("aiChatBotThreadId", data.data.threadId)
                setThreadId(data.data.threadId)
            }
            setText("");
            triggerAutoSizeTextArea()
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

    useEffect(() => {
        if (speechData && isListening) {
            setText(speechData)
        }
    }, [speechData, isListening])

    useEffect(() => {
        if (error)
            toast.error(error)

    }, [error])

    useEffect(() => {
        if (speechData !== undefined && isListening) {
            triggerAutoSizeTextArea()
        }
    }, [speechData, isListening]);



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


    const handleClickRandomQuestionBtn = (question: string) => {
        setText(question);
        setTimeout(async () => {
            await askQuestionToChatbot(question)
        }, 500);
    }

    const askQuestionToChatbot = async (question?: string) => {

        const notUpdatedMessages = [...messages];

        try {
            setMessages((prv) => [...prv, {
                type: "human",
                message: question || text
            }])
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

    return (
        <OutsideClickHandler onOutsideClick={() => isXSmallDevices ? setShow(false) : null}>
            <motion.div
                initial={{ width: 0, opacity: 0, ...(isXSmallDevices && { top: "70vh" }) }}
                animate={{ width: getPanelWidthSize(), opacity: 1, ...(isXSmallDevices && { top: 0 }) }}
                exit={{ width: 0, opacity: 0, ...(isXSmallDevices && { top: "70vh" }), transition: { width: { delay: 0.4 }, opacity: { delay: 0.3 }, ...(isXSmallDevices && { top: { delay: 0 } }) } }}
                transition={{ width: { duration: 0.4 }, opacity: { duration: 0.5 }, ...(isXSmallDevices && { top: { duration: 0.4, delay: 0.5 } }), }}
                className={styles.support_chatbot_panel}>

                <div className={styles.support_chatbot_panel_content}>
                    <div className={styles.support_chatbot_panel_top}>
                        <div className={styles.support_chatbot_panel_top_left}>
                            <div className={styles.support_chatbot_panel_top_left_avatar}>
                                <RiGeminiFill className={styles.agent_icon} />
                                <BaseImage src="/agent.avif" alt="agent" />
                            </div>
                            <div className={styles.support_chatbot_panel_agent_infos}>
                                <h6>Sora</h6>
                                <span>AI Helpful E-commerce Assistant</span>
                            </div>

                        </div>
                        <div className={styles.support_chatbot_panel_top_right}>
                            <div onClick={() => setShow(false)} className={styles.support_chatbot_panel_top_close_btn}>
                                <FaXmark size={20} />
                            </div>
                        </div>
                    </div>
                    <motion.div
                        initial={{ maxHeight: isXSmallDevices ? 0 : "2vh" }}
                        animate={{ maxHeight: isXSmallDevices ? "70vh" : "45vh" }}
                        exit={{ maxHeight: isXSmallDevices ? 0 : "2vh", transition: { delay: 0 } }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        className={styles.support_chatbot_panel_message_history}
                        id='messageHistory'
                    >
                        <motion.div
                            initial={{ display: "none" }}
                            animate={{ display: "block" }}
                            exit={{ display: "none", transition: { display: { delay: 0 } } }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            style={{ height: isXSmallDevices ? "70vh" : "45vh" }}
                        >
                            {
                                messages.map((msg, i) => (
                                    <motion.div
                                        key={`chatbot-message-` + msg.products + "-" + i}
                                        {...(msg.isFirstMessage ? {
                                            initial: { x: -10, opacity: 0 },
                                            animate: { x: 0, opacity: 1 },
                                            transition: { duration: 0.4, delay: 1 }
                                        } : null)}
                                        className={clsx(styles.support_chatbot_panel_message_item, { [styles.is_my_message]: msg.type === "human" })}
                                    >
                                        <div className={clsx(styles.support_chatbot_panel_message, { [styles.is_my_message]: msg.type === "human" })}>
                                            {msg.type === "ai" && <BaseImage src="/agent.avif" alt="" />}
                                            <p>{msg.message}</p>
                                        </div>
                                        {
                                            msg.isFirstMessage &&
                                            <div className={styles.support_chatbot_panel_example_questions}>
                                                {
                                                    exampleQuestions[ramdomNumber].map((question, i) => (
                                                        <motion.div
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ duration: 0.4, delay: 1 + ((i + 1) * 0.2) }}
                                                            className={styles.support_chatbot_panel_example_question}
                                                            onClick={() => handleClickRandomQuestionBtn(question)}
                                                        >
                                                            <span>{question}</span>
                                                            <MdInput size={20} />
                                                        </motion.div>
                                                    ))
                                                }
                                            </div>
                                        }
                                        {msg.products && msg.products.length > 0 && <AiAdviseProductsBlock msg={msg} />}
                                    </motion.div>

                                ))
                            }
                            {
                                isPending && (
                                    <motion.div
                                        className={styles.support_chatbot_panel_skeleton_message_wrapper}
                                    >
                                        <div className={styles.support_chatbot_panel_skeleton_message}>
                                            <BaseImage src="/agent.avif" alt="" />
                                            <div className={styles.support_chatbot_panel_skeletons_text}>
                                                <div />
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }
                        </motion.div>
                    </motion.div>
                    <div className={styles.support_chatbot_panel_bottom}>
                        <Input
                            disabled={isPending}
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                            className={styles.support_chatbot_panel_bottom_input}
                            inputClassName={styles.support_chatbot_panel_bottom_input_item}
                            isAutoSize
                            placeholder='Enter a word'
                            {...(((text.trim().length > 1) && !isPending) && { rightIcon: FaXmark })}
                            rightIconOnClick={() => {
                                setText("")
                                triggerAutoSizeTextArea()
                            }}
                            id='chatbotInput'
                        />
                        <div
                            onClick={() => isListening ? stopListening() : startListening()}
                            className={clsx(styles.support_chatbot_panel_bottom_action_btn, { [styles.is_listening]: isListening })}>
                            {
                                isListening ? <FaSquare size={20} /> : <MdKeyboardVoice size={20} />
                            }
                        </div>
                        <div onClick={() => askQuestionToChatbot()} className={styles.support_chatbot_panel_bottom_action_btn}>
                            {isPending ? <AiOutlineLoading3Quarters className={styles.support_chatbot_panel_bottom_loading} size={20} /> : <BiSolidSend size={20} />}
                        </div>
                    </div>
                </div>
                <BiSolidDownArrow size={40} className={styles.support_chatbot_panel_arrow} />
            </motion.div >

        </OutsideClickHandler >
    )

}

export default SupportChatBotPanel