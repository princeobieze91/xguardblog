"use client";

import { Share2, Mail, Copy, ExternalLink } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, "_blank", "width=500,height=300");
  };

  const handleLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedinUrl, "_blank", "width=500,height=300");
  };

  const handleFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank", "width=500,height=300");
  };

  const handleEmail = () => {
    const emailBody = `Check out this article: ${title}\n\n${url}`;
    const emailSubject = `Interesting article: ${title}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <button
        onClick={handleTwitter}
        className="p-2 rounded hover:bg-primary-500/10 dark:hover:bg-primary-900/20 transition-colors"
        title="Share on Twitter"
      >
        <Share2 className="w-4 h-4 text-primary-500 hover:text-primary-600" />
      </button>
      <button
        onClick={handleLinkedIn}
        className="p-2 rounded hover:bg-primary-500/10 dark:hover:bg-primary-900/20 transition-colors"
        title="Share on LinkedIn"
      >
        <ExternalLink className="w-4 h-4 text-primary-500 hover:text-primary-600" />
      </button>
      <button
        onClick={handleFacebook}
        className="p-2 rounded hover:bg-primary-500/10 dark:hover:bg-primary-900/20 transition-colors"
        title="Share on Facebook"
      >
        <Share2 className="w-4 h-4 text-primary-500 hover:text-primary-600 rotate-180" />
      </button>
      <button
        onClick={handleCopy}
        className="p-2 rounded hover:bg-primary-500/10 dark:hover:bg-primary-900/20 transition-colors"
        title="Copy link"
      >
        <Copy className="w-4 h-4 text-primary-500 hover:text-primary-600" />
      </button>
      <button
        onClick={handleEmail}
        className="p-2 rounded hover:bg-primary-500/10 dark:hover:bg-primary-900/20 transition-colors"
        title="Share via email"
      >
        <Mail className="w-4 h-4 text-primary-500 hover:text-primary-600" />
      </button>
    </div>
  );
}