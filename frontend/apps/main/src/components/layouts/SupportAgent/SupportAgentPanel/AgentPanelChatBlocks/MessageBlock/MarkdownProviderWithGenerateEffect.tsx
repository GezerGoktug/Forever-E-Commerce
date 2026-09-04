import { scrollToEndOfChatHistory } from "../../SupportAgentPanel/SupportAgentPanel";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const rehypePlugins = [rehypeSanitize];

const revealCostForRemaining = (remaining: number) => {
    if (remaining > 80) return 6;
    if (remaining > 40) return 12;
    if (remaining > 20) return 22;
    return 34;
};

const balancePartialMarkdown = (text: string) => {
    let out = text;

    const lastLinkStart = out.lastIndexOf("[");
    if (lastLinkStart !== -1 && !/\]\([^)]*\)/.test(out.slice(lastLinkStart))) {
        out = out.slice(0, out[lastLinkStart - 1] === "!" ? lastLinkStart - 1 : lastLinkStart);
    }

    const closeIfOdd = (marker: string) => {
        if ((out.split(marker).length - 1) % 2 === 1) out += marker;
    };

    closeIfOdd("**");
    closeIfOdd("`");

    return out;
};


const useWordRevealQueue = (rawContent: string, enabled: boolean) => {

    const content = typeof rawContent === "string" ? rawContent : "";

    const tokens = useMemo(() => content.split(/(\s+)/), [content]);
    const totalWords = useMemo(
        () => tokens.reduce((count, token) => count + (token.trim().length > 0 ? 1 : 0), 0),
        [tokens]
    );

    const [revealedWordCount, setRevealedWordCount] = useState(0);
    const revealedRef = useRef(0);
    const totalWordsRef = useRef(totalWords);
    const previousContentRef = useRef("");

    useEffect(() => {
        if (!content.startsWith(previousContentRef.current)) {
            revealedRef.current = 0;
            setRevealedWordCount(0);
        }
        previousContentRef.current = content;
        totalWordsRef.current = totalWords;
    }, [content, totalWords]);

    useEffect(() => {
        if (!enabled) return;

        let frameId = 0;
        let lastFrameTime = performance.now();
        let budget = 0;

        const step = (now: number) => {
            budget += now - lastFrameTime;
            lastFrameTime = now;

            let next = revealedRef.current;

            while (next < totalWordsRef.current) {
                const cost = revealCostForRemaining(totalWordsRef.current - next);
                if (budget < cost) break;
                budget -= cost;
                next++;
            }

            if (next >= totalWordsRef.current) budget = 0;

            if (next !== revealedRef.current) {
                revealedRef.current = next;
                setRevealedWordCount(next);
            }

            frameId = requestAnimationFrame(step);
        };

        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [enabled]);

    const visibleText = useMemo(() => {
        if (!enabled || revealedWordCount >= totalWords) return content;

        let words = 0;
        let out = "";

        for (const token of tokens) {
            if (token.trim().length > 0) {
                if (words >= revealedWordCount) break;
                words++;
            }
            out += token;
        }

        return balancePartialMarkdown(out);
    }, [tokens, revealedWordCount, totalWords, enabled, content]);

    return visibleText;
};

const animateTextNodes = (children: React.ReactNode, animateText: boolean): React.ReactNode => {
    return React.Children.map(children, (child) => {
        if (typeof child === "string") {
            if (!animateText) return child;

            return child.split(/(\s+)/).map((word, index) => {
                if (word.length === 0) return null;
                if (word.match(/^\s+$/)) return word;

                return (
                    <span key={index} className="word-reveal">
                        {word}
                    </span>
                );
            });
        }

        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                children: animateTextNodes(child.props.children, animateText),
            });
        }

        return child;
    });
};

export const MarkdownProviderWithGenerateEffect = memo(({ content, animateText = true }: { content: string; animateText?: boolean }) => {
    const visibleText = useWordRevealQueue(content, animateText);

    const components = useMemo<Components>(() => {
        const animate = (children: React.ReactNode) => animateTextNodes(children, animateText);

        return {
            p: ({ children }) => (
                <p>{animate(children)}</p>
            ),
            h1: ({ children }) => (
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{animate(children)}</h1>
            ),
            h2: ({ children }) => (
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>{animate(children)}</h2>
            ),
            li: ({ children }) => (
                <li style={{ marginLeft: "1rem", listStyleType: "disc" }}>{animate(children)}</li>
            ),
            strong: ({ children }) => (
                <strong>{animate(children)}</strong>
            ),
            em: ({ children }) => (
                <em>{animate(children)}</em>
            ),
            a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noreferrer">{animate(children)}</a>
            ),
            code: ({ children }) => (
                <code>{animate(children)}</code>
            ),
        };
    }, [animateText]);

    useEffect(() => {
        scrollToEndOfChatHistory();
    }, [visibleText, animateText]);

    return (
        <div>
            <ReactMarkdown rehypePlugins={rehypePlugins} components={components}>
                {visibleText}
            </ReactMarkdown>
        </div>
    );
});
