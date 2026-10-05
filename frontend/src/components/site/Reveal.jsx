import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 28, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ children, tone = "amber" }) => (
  <p className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] ${tone === "green" ? "text-zinc-300" : "text-zinc-300"}`}>
    <span className={`h-px w-10 ${tone === "green" ? "bg-white" : "bg-zinc-400"}`} />
    {children}
  </p>
);

export const useSpotlight = () => (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};
