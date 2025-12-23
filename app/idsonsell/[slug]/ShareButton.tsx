"use client";

export default function ShareButton({
  text,
  url,
}: {
  text: string;
  url: string;
}) {
  const handleShare = () => {
    const fullText = `${text}\n\n${url}`;
    const encodedText = encodeURIComponent(fullText);

    // WhatsApp universal share URL
    const waUrl = `https://wa.me/?text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      title="Share on WhatsApp"
      aria-label="Share on WhatsApp"
      className="absolute top-4 right-4 z-20 p-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow"
    >
      {/* WhatsApp Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-5 h-5 fill-current"
      >
        <path d="M16.003 3.2c-7.05 0-12.8 5.75-12.8 12.8 0 2.256.587 4.453 1.707 6.395L3.2 28.8l6.57-1.723A12.71 12.71 0 0 0 16.003 28.8c7.05 0 12.8-5.75 12.8-12.8 0-7.05-5.75-12.8-12.8-12.8z" />
      </svg>
    </button>
  );
}
