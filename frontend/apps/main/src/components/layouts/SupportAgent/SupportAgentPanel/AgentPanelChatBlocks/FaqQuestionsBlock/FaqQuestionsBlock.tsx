import { memo, useState } from "react";
import styles from "./FaqQuestionsBlock.module.scss";
import { motion } from "framer-motion"
import { MdInput } from "react-icons/md";

const FAQ_QUESTIONS = [
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

const FaqQuestionsBlock = memo(({ onSelectQuestion }: { onSelectQuestion: (question: string) => void }) => {
    const [ramdomNumber] = useState(() => Math.floor(Math.random() * 10));

    return (
        <div className={styles.agent_panel_chat_block_faq_questions}>
            {
                FAQ_QUESTIONS[ramdomNumber].map((question, i) => (
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1 + ((i + 1) * 0.2) }}
                        className={styles.agent_panel_chat_block_faq_question}
                        onClick={() => onSelectQuestion(question)}
                    >
                        <span>{question}</span>
                        <MdInput size={20} />
                    </motion.div>
                ))
            }
        </div>
    )
})

export default FaqQuestionsBlock