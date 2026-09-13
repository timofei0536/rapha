"use client";

import { useCallback, useEffect, useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebookF,
    faXTwitter,
    faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

config.autoAddCss = false;

export default function NewShare({ shareUrl = "", title = "" }) {
    const [url, setUrl] = useState(shareUrl);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setUrl(shareUrl || window.location.href);
    }, [shareUrl]);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent([title, url].filter(Boolean).join(" "));

    const copyUrl = useCallback(async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            /* ignore */
        }
    }, [url]);

    return (
        <div className="new__share">
            <span className="new__share-label">Share</span>
            <div className="new__share-icons">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new__share-link"
                    aria-label="Share on Facebook"
                >
                    <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new__share-link"
                    aria-label="Share on X"
                >
                    <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <a
                    href={`https://wa.me/?text=${encodedText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new__share-link"
                    aria-label="Share on WhatsApp"
                >
                    <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <button
                    type="button"
                    className="new__share-link new__share-copy"
                    onClick={copyUrl}
                    aria-label={copied ? "Link copied" : "Copy link"}
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
        </div>
    );
}
