"use client";

export default function ScrollingNoticeBand() {
  return (
    <div className="w-full overflow-hidden bg-[var(--card)] border-b border-[var(--border)] mt-2">
      <div className="scroll-track py-2 text-sm font-medium whitespace-nowrap text-[var(--foreground)]">
        <span className="mx-8">
          Welcome to <b className="text-[var(--accent)]">BlueBuff Store</b>
        </span>
        <span className="mx-8">
          <b className="text-[var(--accent)]">Instant</b> & Safe Top-Ups
        </span>
        <span className="mx-8">
          <b className="text-[var(--accent)]">24×7</b> Automated Delivery
        </span>
        <span className="mx-8">
          <b className="text-[var(--accent)]">Reseller</b> Friendly Platform
        </span>

        {/* duplicate for seamless loop */}
        <span className="mx-8">
          Welcome to <b className="text-[var(--accent)]">BlueBuff Store</b>
        </span>
        <span className="mx-8">
          <b className="text-[var(--accent)]">Instant</b> & Safe Top-Ups
        </span>
        <span className="mx-8">
          <b className="text-[var(--accent)]">24×7</b> Automated Delivery
        </span>
        <span className="mx-8">
          <b className="text-[var(--accent)]">Reseller</b> Friendly Platform
        </span>
      </div>

<style jsx>{`
  .scroll-track {
    display: inline-block;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    animation: scroll-left 28s linear infinite; /* ⬅️ slower */
  }

  @keyframes scroll-left {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }
`}</style>

    </div>
  );
}
