import React, {useState} from 'react';
import clsx from 'clsx';
import {TREES, type Answer, type Outcome, type Tree, type TreeNode, type Bi} from './trees';
import styles from './styles.module.css';

type Lang = 'he' | 'en';

const UI: Record<string, Bi> = {
  restart: {he: 'התחל מחדש', en: 'Start over'},
  back: {he: 'חזרה', en: 'Back'},
  retry: {he: 'נסה שוב', en: 'Retry'},
  path: {he: 'המסלול שלך', en: 'Your path'},
  step: {he: 'צעד', en: 'Step'},
  question: {he: 'שאלה', en: 'Question'},
  unknownTree: {he: 'עץ ההחלטות לא נמצא', en: 'Decision tree not found'},
};

const OUTCOME_META: Record<
  Outcome['type'],
  {icon: string; label: Bi; className: string}
> = {
  resolved: {icon: '✅', label: {he: 'נפתר', en: 'Resolved'}, className: styles.resolved},
  escalate: {icon: '🔴', label: {he: 'הסלמה', en: 'Escalate'}, className: styles.escalate},
  warning: {icon: '⚠️', label: {he: 'פעולה נדרשת', en: 'Action required'}, className: styles.warning},
  info: {icon: 'ℹ️', label: {he: 'לתשומת ליבך', en: 'Note'}, className: styles.info},
};

interface HistoryEntry {
  nodeId: string;
  answerLabel: Bi;
}

interface DecisionTreeProps {
  /** Id of a tree defined in trees.ts */
  id: string;
  /** Initial language; defaults to Hebrew. */
  defaultLang?: Lang;
}

export default function DecisionTree({id, defaultLang = 'en'}: DecisionTreeProps): JSX.Element {
  const tree: Tree | undefined = TREES[id];
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [nodeId, setNodeId] = useState<string>(tree ? tree.start : '');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const t = (b: Bi) => b[lang];
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  if (!tree) {
    return <div className={styles.card}>{t(UI.unknownTree)}: <code>{id}</code></div>;
  }

  const node: TreeNode = tree.nodes[nodeId];

  const reset = () => {
    setNodeId(tree.start);
    setOutcome(null);
    setHistory([]);
  };

  const goBack = () => {
    if (outcome) {
      // Undo the answer that produced the outcome — return to the last node.
      setOutcome(null);
      return;
    }
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setNodeId(prev.nodeId);
  };

  const choose = (answer: Answer) => {
    setHistory([...history, {nodeId, answerLabel: answer.label}]);
    if (answer.goto) {
      setNodeId(answer.goto);
      setOutcome(null);
    } else if (answer.outcome) {
      setOutcome(answer.outcome);
    }
  };

  const retry = (targetId: string) => {
    setOutcome(null);
    setNodeId(targetId);
  };

  return (
    <div className={styles.card} dir={dir} lang={lang}>
      <div className={styles.header}>
        <div className={styles.treeTitle}>{t(tree.title)}</div>
        <div className={styles.langToggle} role="group" aria-label="language">
          <button
            type="button"
            className={clsx(styles.langButton, lang === 'he' && styles.langActive)}
            onClick={() => setLang('he')}>
            עברית
          </button>
          <button
            type="button"
            className={clsx(styles.langButton, lang === 'en' && styles.langActive)}
            onClick={() => setLang('en')}>
            English
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <ol className={styles.breadcrumb} aria-label={t(UI.path)}>
          {history.map((h, i) => (
            <li key={i} className={styles.crumb}>
              <span className={styles.crumbQ}>{t(tree.nodes[h.nodeId].title)}</span>
              <span className={styles.crumbA}>{t(h.answerLabel)}</span>
            </li>
          ))}
        </ol>
      )}

      {outcome ? (
        <OutcomeCard outcome={outcome} lang={lang} onRetry={retry} />
      ) : (
        <div className={styles.node}>
          <div className={styles.kind}>
            {node.kind === 'step' ? t(UI.step) : t(UI.question)}
          </div>
          <div className={styles.title}>{t(node.title)}</div>
          {node.note && <div className={styles.note}>{t(node.note)}</div>}
          {node.steps && (
            <ol className={styles.steps}>
              {node.steps.map((s, i) => (
                <li key={i}>{t(s)}</li>
              ))}
            </ol>
          )}
          <div className={styles.answers}>
            {node.answers.map((a, i) => (
              <button
                key={i}
                type="button"
                className={clsx(
                  styles.answer,
                  a.tone === 'yes' && styles.answerYes,
                  a.tone === 'no' && styles.answerNo,
                )}
                onClick={() => choose(a)}>
                {t(a.label)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.ctrl}
          onClick={goBack}
          disabled={history.length === 0 && !outcome}>
          ← {t(UI.back)}
        </button>
        <button type="button" className={styles.ctrl} onClick={reset}>
          ↻ {t(UI.restart)}
        </button>
      </div>
    </div>
  );
}

function OutcomeCard({
  outcome,
  lang,
  onRetry,
}: {
  outcome: Outcome;
  lang: Lang;
  onRetry: (id: string) => void;
}): JSX.Element {
  const meta = OUTCOME_META[outcome.type];
  const t = (b: Bi) => b[lang];
  return (
    <div className={clsx(styles.outcome, meta.className)}>
      <div className={styles.outcomeLabel}>
        <span className={styles.outcomeIcon} aria-hidden>
          {meta.icon}
        </span>
        {t(meta.label)}
      </div>
      <div className={styles.outcomeText}>{t(outcome.text)}</div>
      {outcome.retryTo && (
        <button
          type="button"
          className={styles.retry}
          onClick={() => onRetry(outcome.retryTo!)}>
          ↻ {t(UI.retry)}
        </button>
      )}
    </div>
  );
}
