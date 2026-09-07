import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, Compass, Lightbulb, ChevronDown, Copy, Check } from "lucide-react";

/* ── Safe text extractor — handles string OR {key: string} ── */
const getText = (item, key) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item[key] ?? item.text ?? item.content ?? JSON.stringify(item);
};

/* ── Numbered item with copy support ──────────────────────── */
const NumberedItem = ({ index, text, color, badgeText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
      className="group relative flex items-start gap-3.5 rounded-xl p-3.5 transition-all duration-200 hover:bg-slate-800/50"
      style={{
        background: "rgba(15,23,42,0.45)",
        borderLeft: `3px solid ${color}`,
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <span
        className="mt-0.5 flex-shrink-0 min-w-[28px] text-xs font-bold tabular-nums"
        style={{ color }}
      >
        {String(index + 1).padStart(2, "0")}.
      </span>

      <div className="flex-1 min-w-0 pr-8">
        <p className="text-sm text-slate-200 leading-relaxed font-normal">{text}</p>
        {badgeText && (
          <div className="mt-2">
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
              style={{
                background: `${color}15`,
                color: color,
                border: `1px solid ${color}30`,
              }}
            >
              {badgeText}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={handleCopy}
        title="Copy text"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-white transition-opacity bg-slate-800/80 border border-slate-700"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      </button>
    </motion.div>
  );
};

/* ── Accordion (novel ideas) ──────────────────────────────── */
const AccordionItem = ({ item, color, index }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const title = getText(item, "idea");
  const desc  = getText(item, "description");

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${title}\n\n${desc}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(15,23,42,0.45)",
        border: `1px solid ${open ? color + "44" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-3.5 text-left cursor-pointer hover:bg-slate-800/40 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}30`,
              color,
            }}
          >
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-white leading-snug truncate">{title}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-1 rounded-md text-slate-400 hover:text-white transition hover:bg-slate-800"
            title="Copy project idea"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={15} className="text-slate-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            {desc && (
              <div
                className="px-4 py-3.5 text-sm text-slate-300 leading-relaxed bg-slate-900/40"
                style={{ borderTop: `1px solid ${color}20` }}
              >
                <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-400/90 mb-1.5">
                  Implementation & Scope
                </div>
                {desc}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Section wrapper ──────────────────────────────────────── */
const Section = ({ icon: Icon, color, title, count, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl overflow-hidden shadow-lg transition-all"
    style={{
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(99,102,241,0.12)",
    }}
  >
    {/* Header */}
    <div
      className="flex items-center justify-between px-5 py-3.5"
      style={{ borderBottom: `1px solid ${color}22`, background: `${color}0a` }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: `${color}20`, border: `1px solid ${color}35` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {count != null && (
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
        >
          {count} findings
        </span>
      )}
    </div>

    {/* Body */}
    <div className="p-4">{children}</div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   GapCard — used in Dashboard's Analysis tab
   ═══════════════════════════════════════════════════════════ */
export default function GapCard({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4">

      {/* Research Gaps */}
      {data.research_gaps?.length > 0 && (
        <Section
          icon={AlertTriangle}
          color="#f87171"
          title="Identified Research Gaps"
          subtitle="Limitations, unexplored constraints, and unanswered questions"
          count={data.research_gaps.length}
        >
          <motion.div
            className="space-y-2.5"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.055 } } }}
          >
            {data.research_gaps.map((item, i) => (
              <NumberedItem
                key={i}
                index={i}
                text={getText(item, "gap")}
                color="#f87171"
                badgeText={i === 0 ? "Critical Gap" : "Unresolved Bottleneck"}
              />
            ))}
          </motion.div>
        </Section>
      )}

      {/* Possible Improvements */}
      {data.possible_improvements?.length > 0 && (
        <Section
          icon={TrendingUp}
          color="#34d399"
          title="Actionable Methodological Improvements"
          subtitle="Opportunities to improve accuracy, speed, or generalization"
          count={data.possible_improvements.length}
        >
          <motion.div
            className="space-y-2.5"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.055 } } }}
          >
            {data.possible_improvements.map((item, i) => (
              <NumberedItem
                key={i}
                index={i}
                text={getText(item, "improvement")}
                color="#34d399"
                badgeText="Optimization Opportunity"
              />
            ))}
          </motion.div>
        </Section>
      )}

      {/* Future Research Directions */}
      {data.future_research_directions?.length > 0 && (
        <Section
          icon={Compass}
          color="#a78bfa"
          title="High-Impact Future Research Directions"
          subtitle="Promising paths for extended study and follow-up publications"
          count={data.future_research_directions.length}
        >
          <motion.div
            className="space-y-2.5"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.055 } } }}
          >
            {data.future_research_directions.map((item, i) => (
              <NumberedItem
                key={i}
                index={i}
                text={getText(item, "direction")}
                color="#a78bfa"
                badgeText="Extended Roadmap"
              />
            ))}
          </motion.div>
        </Section>
      )}

      {/* Novel Project Ideas */}
      {data.novel_project_ideas?.length > 0 && (
        <Section
          icon={Lightbulb}
          color="#fbbf24"
          title="Novel Project & Thesis Ideas"
          subtitle="Ready-to-execute projects formulated from the paper's blindspots"
          count={data.novel_project_ideas.length}
        >
          <div className="space-y-2.5">
            {data.novel_project_ideas.map((item, i) => (
              <AccordionItem key={i} index={i} item={item} color="#fbbf24" />
            ))}
          </div>
        </Section>
      )}

    </div>
  );
}