"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebookF,
    faXTwitter,
    faInstagram,
    faGoogle,
} from "@fortawesome/free-brands-svg-icons";

export default function NewShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const encoded = encodeURIComponent(url);

    return (
        <div className="new__share">
            <span className="new__share-label">Share</span>
            <div className="new__share-icons">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new__share-link"
                    aria-label="Share on Facebook"
                >
                    <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new__share-link"
                    aria-label="Share on X"
                >
                    <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <a
                    href={`https://www.instagram.com/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new__share-link"
                    aria-label="Instagram"
                >
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                    href={`https://www.google.com/bookmarks/mark?op=add&bkmk=${encoded}&title=`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new__share-link"
                    aria-label="Share with Google"
                >
                    <FontAwesomeIcon icon={faGoogle} />
                </a>
            </div>
        </div>
    );
}
