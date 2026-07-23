/**
 * Data for the interactive troubleshooting decision trees.
 *
 * Every string is bilingual (Hebrew + English) so the same tree can be
 * rendered in either language via the toggle in <DecisionTree />.
 *
 * A tree is a map of nodes. Each node is either a `question` or a `step`
 * (instructions the agent performs before answering). Every answer either
 * jumps to another node (`goto`) or ends the branch with an `outcome`.
 */

export type Bi = { he: string; en: string };

const bi = (he: string, en: string): Bi => ({ he, en });

export type OutcomeType = 'resolved' | 'escalate' | 'warning' | 'info';

export interface Outcome {
  type: OutcomeType;
  text: Bi;
  /** When set, the outcome renders a "retry" button jumping back to this node. */
  retryTo?: string;
}

export interface Answer {
  label: Bi;
  tone?: 'yes' | 'no' | 'neutral';
  goto?: string;
  outcome?: Outcome;
}

export interface TreeNode {
  id: string;
  kind?: 'question' | 'step';
  title: Bi;
  /** Optional helper line shown under the title. */
  note?: Bi;
  /** Ordered instructions shown as a numbered list (mostly for `step` nodes). */
  steps?: Bi[];
  answers: Answer[];
}

export interface Tree {
  id: string;
  title: Bi;
  start: string;
  nodes: Record<string, TreeNode>;
}

// Reusable answer shorthands ------------------------------------------------

const YES = (goto: string): Answer => ({
  label: bi('כן', 'Yes'),
  tone: 'yes',
  goto,
});
const NO = (goto: string): Answer => ({ label: bi('לא', 'No'), tone: 'no', goto });

const resolved: Outcome = {
  type: 'resolved',
  text: bi('הבעיה נפתרה. עדכן את הסוכן.', 'Resolved. Update the agent.'),
};

// ---------------------------------------------------------------------------
// TIER 1
// ---------------------------------------------------------------------------

const t1RemovableVisibility: Tree = {
  id: 't1-removable-visibility',
  title: bi('מדיה נתיקה – לא רואה ריליס', 'Removable Media – Cannot See Release'),
  start: 'q1',
  nodes: {
    q1: {
      id: 'q1',
      title: bi('יש חיבור רשת?', 'Is there a network connection?'),
      answers: [
        YES('q2'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'נתק וחבר שוב את המדיה הנתיקה, ואז נסה שוב.',
              'Disconnect and reconnect the removable media, then retry.',
            ),
            retryTo: 'q1',
          },
        },
      ],
    },
    q2: {
      id: 'q2',
      title: bi('אתה בחנות הנכונה?', 'Are you in the correct store?'),
      note: bi(
        'ודא שהסוכן בחנות המתאימה למערכת ההפעלה (Windows / Linux).',
        'Confirm the agent is in the store matching their OS (Windows / Linux).',
      ),
      answers: [
        YES('q3'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'עבור לחנות הנכונה לפי מערכת ההפעלה, ואז נסה שוב.',
              'Switch to the correct store for the OS, then retry.',
            ),
            retryTo: 'q2',
          },
        },
      ],
    },
    q3: {
      id: 'q3',
      title: bi('רענן את החנות — הריליס מופיע?', 'Refresh the store — does the release appear?'),
      answers: [
        { label: bi('מופיע', 'Appears'), tone: 'yes', outcome: resolved },
        { label: bi('לא מופיע', 'Does not appear'), tone: 'no', goto: 'q4' },
      ],
    },
    q4: {
      id: 'q4',
      title: bi('ב-localhost:2233 הריליס קיים?', 'Does the release exist at localhost:2233?'),
      answers: [
        { label: bi('קיים', 'Exists'), tone: 'yes', goto: 'q5' },
        {
          label: bi('לא קיים', 'Does not exist'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'תעין (flash) את המדיה עם הריליס הנכון, ואז נסה שוב.',
              'Flash the media with the correct release, then retry.',
            ),
            retryTo: 'q1',
          },
        },
      ],
    },
    q5: {
      id: 'q5',
      title: bi('נתק/חבר מחדש — הריליס מופיע?', 'Disconnect/reconnect — does the release appear?'),
      answers: [
        { label: bi('מופיע', 'Appears'), tone: 'yes', outcome: resolved },
        { label: bi('לא מופיע', 'Does not appear'), tone: 'no', goto: 'q6' },
      ],
    },
    q6: {
      id: 'q6',
      title: bi('מחק Cache — הריליס מופיע?', 'Clear cache — does the release appear?'),
      answers: [
        { label: bi('מופיע', 'Appears'), tone: 'yes', outcome: resolved },
        {
          label: bi('לא מופיע', 'Does not appear'),
          tone: 'no',
          outcome: {
            type: 'escalate',
            text: bi(
              'הסלם לטיר 2 עם פירוט כל הצעדים שבוצעו.',
              'Escalate to Tier 2 with a full summary of the steps taken.',
            ),
          },
        },
      ],
    },
  },
};

const t1CellularVisibility: Tree = {
  id: 't1-cellular-visibility',
  title: bi('סלולר – לא רואה ריליס', 'Cellular – Cannot See Release'),
  start: 'q1',
  nodes: {
    q1: {
      id: 'q1',
      title: bi('יש חיבור רשת?', 'Is there a network connection?'),
      answers: [
        YES('q2'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'סלולר בשטח – אין רשת. נסה לחבר לנקודה חמה / Wi-Fi. אם לא נפתר — הסלם לטיר 2.',
              'Field cellular – no network. Try a hotspot / Wi-Fi. If unresolved, escalate to Tier 2.',
            ),
            retryTo: 'q1',
          },
        },
      ],
    },
    q2: {
      id: 'q2',
      title: bi('אתה בחנות הנכונה?', 'Are you in the correct store?'),
      note: bi(
        'ודא שהסוכן בחנות המתאימה למערכת ההפעלה (Windows / Linux).',
        'Confirm the agent is in the store matching their OS (Windows / Linux).',
      ),
      answers: [
        YES('q3'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'עבור לחנות הנכונה לפי מערכת ההפעלה, ואז נסה שוב.',
              'Switch to the correct store for the OS, then retry.',
            ),
            retryTo: 'q2',
          },
        },
      ],
    },
    q3: {
      id: 'q3',
      title: bi('רענן את החנות — הריליס מופיע?', 'Refresh the store — does the release appear?'),
      answers: [
        { label: bi('מופיע', 'Appears'), tone: 'yes', outcome: resolved },
        { label: bi('לא מופיע', 'Does not appear'), tone: 'no', goto: 'q4' },
      ],
    },
    q4: {
      id: 'q4',
      title: bi('ה-DeviceType נכון?', 'Is the DeviceType correct?'),
      answers: [
        YES('q5'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'עבור ל-DeviceType הנכון, ואז נסה שוב.',
              'Switch to the correct DeviceType, then retry.',
            ),
            retryTo: 'q4',
          },
        },
      ],
    },
    q5: {
      id: 'q5',
      title: bi('מחק Cache — הריליס מופיע?', 'Clear cache — does the release appear?'),
      answers: [
        { label: bi('מופיע', 'Appears'), tone: 'yes', outcome: resolved },
        { label: bi('לא מופיע', 'Does not appear'), tone: 'no', goto: 'q6' },
      ],
    },
    q6: {
      id: 'q6',
      title: bi('חכה 15 דקות, רענן — הריליס מופיע?', 'Wait 15 minutes, refresh — does the release appear?'),
      answers: [
        { label: bi('מופיע', 'Appears'), tone: 'yes', outcome: resolved },
        {
          label: bi('לא מופיע', 'Does not appear'),
          tone: 'no',
          outcome: {
            type: 'escalate',
            text: bi(
              'הסלם לטיר 2 עם פירוט כל הצעדים שבוצעו.',
              'Escalate to Tier 2 with a full summary of the steps taken.',
            ),
          },
        },
      ],
    },
  },
};

const t1RemovableDownload: Tree = {
  id: 't1-removable-download',
  title: bi('מדיה נתיקה – הורדה נכשלה', 'Removable Media – Download Failed'),
  start: 's1',
  nodes: {
    s1: {
      id: 's1',
      kind: 'step',
      title: bi('נתק וחבר מחדש', 'Disconnect and reconnect'),
      steps: [
        bi('נתק את המכשיר מהמדיה הנתיקה.', 'Disconnect the device from the removable media.'),
        bi('המתן דקה אחת.', 'Wait one minute.'),
        bi('חבר מחדש את המדיה.', 'Reconnect the media.'),
        bi('נסה שוב להוריד.', 'Retry the download.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q1' }],
    },
    q1: {
      id: 'q1',
      title: bi('ההורדה הצליחה?', 'Did the download succeed?'),
      answers: [
        { label: bi('כן', 'Yes'), tone: 'yes', outcome: resolved },
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'escalate',
            text: bi(
              'הסלם לטיר 2 עם הפרטים: מערכת הפעלה, שם הריליס, הודעת שגיאה.',
              'Escalate to Tier 2 with details: OS, release name, error message.',
            ),
          },
        },
      ],
    },
  },
};

const t1CellularDownload: Tree = {
  id: 't1-cellular-download',
  title: bi('סלולר – הורדה נכשלה', 'Cellular – Download Failed'),
  start: 'q1',
  nodes: {
    q1: {
      id: 'q1',
      title: bi('יש חיבור רשת?', 'Is there a network connection?'),
      answers: [
        YES('s1'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'אין רשת – סלולר בשטח. נסה Wi-Fi / נקודה חמה. אם לא נפתר — הסלם לטיר 2.',
              'No network – field cellular. Try Wi-Fi / hotspot. If unresolved, escalate to Tier 2.',
            ),
            retryTo: 'q1',
          },
        },
      ],
    },
    s1: {
      id: 's1',
      kind: 'step',
      title: bi('נסה שוב להוריד', 'Retry the download'),
      steps: [
        bi('לחץ על כפתור הרענון / ניסיון חוזר (↺) ליד הריליס הכושל.', 'Click the retry / refresh button (↺) next to the failing release.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q2' }],
    },
    q2: {
      id: 'q2',
      title: bi('ההורדה הצליחה?', 'Did the download succeed?'),
      answers: [
        { label: bi('כן', 'Yes'), tone: 'yes', outcome: resolved },
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'escalate',
            text: bi(
              'הסלם לטיר 2 / דסק. אסוף את פרטי ההסלמה (ראה למטה).',
              'Escalate to Tier 2 / Desk. Collect the escalation details (see below).',
            ),
          },
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// TIER 2 — APPSTORE AGENT
// ---------------------------------------------------------------------------

const escalateDev: Outcome = {
  type: 'escalate',
  text: bi('פנה לתמיכת מפתחים.', 'Escalate to developer support.'),
};

const notOffered: Outcome = {
  type: 'info',
  text: bi(
    'המכשיר לא אמור לקבל גרסה זו — הסבר זאת לסוכן.',
    'The device is not supposed to receive this version — inform the agent.',
  ),
};

const t2CellularVisibility: Tree = {
  id: 't2-cellular-visibility',
  title: bi('טיר 2 — סלולר: לא רואה ריליס', 'Tier 2 — Cellular: Cannot See Release'),
  start: 's1',
  nodes: {
    s1: {
      id: 's1',
      kind: 'step',
      title: bi('איסוף מידע וכניסה ל-Edge Devices', 'Gather info and open Edge Devices'),
      steps: [
        bi('קבל מהסוכן: שם החנות ומערכת ההפעלה (Windows / Linux).', 'Get from the agent: store name and OS (Windows / Linux).'),
        bi('כנס ל-Edge Devices בממשק GetApp.', 'Open Edge Devices in the GetApp interface.'),
        bi('חפש את המכשיר לפי שם והרחב את רשימת הגרסאות לפי OS.', 'Search the device by name and expand the Versions-by-OS list.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q1' }],
    },
    q1: {
      id: 'q1',
      title: bi('הגרסה החסרה מופיעה במכשיר?', 'Does the missing version appear on the device?'),
      answers: [
        YES('q2'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'כנס לפרויקט ובדוק את סטטוס הגרסה. אם הסטטוס אינו Release — שנה ל-Release ושייך ל-DeviceType המתאים.',
              'Open the Project and check the version status. If it is not Release — change it to Release and assign it to the correct DeviceType.',
            ),
          },
        },
      ],
    },
    q2: {
      id: 'q2',
      title: bi('הגרסה מקושרת לחוק (Rule)?', 'Is the version linked to a rule?'),
      answers: [
        YES('s3'),
        { label: bi('לא', 'No'), tone: 'no', outcome: escalateDev },
      ],
    },
    s3: {
      id: 's3',
      kind: 'step',
      title: bi('הרץ את החוק', 'Run the rule'),
      steps: [
        bi('כנס ל-Rules ומצא את החוק הרלוונטי.', 'Open Rules and find the relevant rule.'),
        bi('לחץ Play ▶.', 'Click Play ▶.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q3' }],
    },
    q3: {
      id: 'q3',
      title: bi('המכשיר מופיע בחוק?', 'Does the device appear in the rule?'),
      answers: [
        { label: bi('כן', 'Yes'), tone: 'yes', outcome: escalateDev },
        { label: bi('לא', 'No'), tone: 'no', goto: 's4' },
      ],
    },
    s4: {
      id: 's4',
      kind: 'step',
      title: bi('בדוק DeviceType', 'Check DeviceType'),
      steps: [
        bi('כנס ל-Catalog → DeviceTypes.', 'Open Catalog → DeviceTypes.'),
        bi('הרחב את ה-DeviceType של המכשיר.', 'Expand the DeviceType for the device.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q4' }],
    },
    q4: {
      id: 'q4',
      title: bi('הרכיב (הפרויקט) נמצא ב-DeviceType?', 'Is the component (project) in the DeviceType?'),
      answers: [
        YES('q5'),
        { label: bi('לא', 'No'), tone: 'no', outcome: notOffered },
      ],
    },
    q5: {
      id: 'q5',
      title: bi('הגרסה משויכת ל-DeviceType?', 'Is the version assigned to the DeviceType?'),
      answers: [
        { label: bi('כן', 'Yes'), tone: 'yes', outcome: escalateDev },
        { label: bi('לא', 'No'), tone: 'no', outcome: notOffered },
      ],
    },
  },
};

const t2CellularDownload: Tree = {
  id: 't2-cellular-download',
  title: bi('טיר 2 — סלולר: הורדה נכשלה', 'Tier 2 — Cellular: Download Failed'),
  start: 's1',
  nodes: {
    s1: {
      id: 's1',
      kind: 'step',
      title: bi('בדיקת הורדה מהדשבורד', 'Test the download from the Dashboard'),
      steps: [
        bi('כנס לדשבורד → עמוד הגרסה → ארטיפקטים.', 'Open Dashboard → Version page → Artifacts.'),
        bi('לחץ על אייקון ההורדה (↓) ישירות מהדשבורד.', 'Click the download icon (↓) directly from the dashboard.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q1' }],
    },
    q1: {
      id: 'q1',
      title: bi('ההורדה מהדשבורד הצליחה?', 'Did the download from the dashboard succeed?'),
      answers: [
        YES('s2'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'עלה שוב את הגרסה (re-upload artifact) ואז פנה לתמיכת מפתחים.',
              'Re-upload the artifact, then escalate to developer support.',
            ),
          },
        },
      ],
    },
    s2: {
      id: 's2',
      kind: 'step',
      title: bi('בדיקת פרוקסי', 'Check the proxy'),
      note: bi(
        'ודא שאתה בודק את שתי הכתובות — שתיהן נדרשות.',
        'Make sure you check both proxy addresses — both are required.',
      ),
      steps: [
        bi('כנס לפרוקסי דרך שתי הכתובות (XXXXXXXX:PORT).', 'Connect to the proxy via both addresses (XXXXXXXX:PORT).'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q2' }],
    },
    q2: {
      id: 'q2',
      title: bi('שני הדוקרים (Docker containers) פעילים?', 'Are both Docker containers active?'),
      answers: [
        YES('s3'),
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'הפעל את הדוקרים הכבויים, ודא שהם עולים תקין, ואז בדוק שוב.',
              'Start the stopped containers, verify they come up correctly, then re-check.',
            ),
            retryTo: 'q2',
          },
        },
      ],
    },
    s3: {
      id: 's3',
      kind: 'step',
      title: bi('בדיקת מקום בדיסק', 'Check available disk space'),
      steps: [bi('הרץ בשרת: df -h', 'Run on the server: df -h')],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q3' }],
    },
    q3: {
      id: 'q3',
      title: bi('יש מקום פנוי בדיסק?', 'Is there free disk space?'),
      answers: [
        {
          label: bi('כן', 'Yes'),
          tone: 'yes',
          outcome: {
            type: 'escalate',
            text: bi(
              'קרא למפתח — חריגה מהרגיל, צפה בלוגים.',
              'Call a developer — abnormal situation, check the logs.',
            ),
          },
        },
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'warning',
            text: bi(
              'אין מקום בדיסק — בצע את "פעולת הגמר" למטה (פעולה הרסנית, דורשת גיבוי).',
              'No disk space — perform the "Final Action" below (destructive, requires a backup).',
            ),
          },
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// TIER 2 — SERVER
// ---------------------------------------------------------------------------

const t2Server: Tree = {
  id: 't2-server',
  title: bi(
    'טיר 2 שרת — לא מצליח לבנות / לעלות / ליצור / להיכנס',
    'Tier 2 Server — Cannot Build / Upload / Create / Connect',
  ),
  start: 's1',
  nodes: {
    s1: {
      id: 's1',
      kind: 'step',
      title: bi('בדיקת OpenShift', 'Check OpenShift'),
      steps: [
        bi('כנס ל-OpenShift.', 'Open OpenShift.'),
        bi('בדוק שכל ה-Deployments וה-Pods פעילים במצב Running.', 'Verify all Deployments and Pods are active and Running.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q1' }],
    },
    q1: {
      id: 'q1',
      title: bi('כל הדפלוימנטים פעילים?', 'Are all deployments active?'),
      answers: [
        {
          label: bi('כן — הכל למעלה', 'Yes — everything is up'),
          tone: 'yes',
          outcome: {
            type: 'escalate',
            text: bi(
              'פנה לתמיכת מפתחים — הבעיה אינה קשורה לדפלוימנטים.',
              'Escalate to developer support — the issue is not related to deployments.',
            ),
          },
        },
        { label: bi('לא', 'No'), tone: 'no', goto: 's2' },
      ],
    },
    s2: {
      id: 's2',
      kind: 'step',
      title: bi('ריסט לדפלוימנטים', 'Reset the deployments'),
      steps: [
        bi('זהה את הדפלוימנטים הכבויים.', 'Identify the stopped deployments.'),
        bi('הרץ rollout restart (ראה פקודה למטה).', 'Run a rollout restart (see the command below).'),
        bi('המתן שכל הפודים יעלו למצב Running.', 'Wait for all pods to reach Running.'),
        bi('נסה שוב לבצע את הפעולה שנכשלה.', 'Retry the operation that was failing.'),
      ],
      answers: [{ label: bi('בוצע — מה עכשיו?', 'Done — what now?'), tone: 'neutral', goto: 'q2' }],
    },
    q2: {
      id: 'q2',
      title: bi('הבעיה נפתרה?', 'Is the problem resolved?'),
      answers: [
        { label: bi('כן', 'Yes'), tone: 'yes', outcome: resolved },
        {
          label: bi('לא', 'No'),
          tone: 'no',
          outcome: {
            type: 'escalate',
            text: bi(
              'פנה לתמיכת מפתחים — הבעיה לא נפתרה לאחר ריסט.',
              'Escalate to developer support — the problem persists after the reset.',
            ),
          },
        },
      ],
    },
  },
};

export const TREES: Record<string, Tree> = {
  [t1RemovableVisibility.id]: t1RemovableVisibility,
  [t1CellularVisibility.id]: t1CellularVisibility,
  [t1RemovableDownload.id]: t1RemovableDownload,
  [t1CellularDownload.id]: t1CellularDownload,
  [t2CellularVisibility.id]: t2CellularVisibility,
  [t2CellularDownload.id]: t2CellularDownload,
  [t2Server.id]: t2Server,
};
