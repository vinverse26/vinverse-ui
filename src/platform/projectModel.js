export const OPENER =
  "I am the master consultant. Before we go further, tell me the problem you are trying to solve";

export function makeOpenerMessages() {
  return [{ role: "master", text: OPENER }];
}

export function emptyDetails(overrides = {}) {
  return {
    stage: "Discovery",
    completion: 0,
    milestones: [],
    nextTodos: ["Clarify the problem with the master consultant"],
    stakeholders: [],
    sections: [
      { id: "s1", title: "Problem framing", body: "What decision is actually on the table?" },
      { id: "s2", title: "Stakeholders", body: "Who decides, who influences, who is affected?" },
      { id: "s3", title: "Next moves", body: "What should happen this week?" },
    ],
    ...overrides,
  };
}

export const starterProjects = [
  {
    id: "p-restaurant",
    title: "Opening a restaurant",
    objective: "Launch a neighborhood restaurant with a clear concept, budget, and opening plan.",
    status: "Active",
    owner: "You",
    ...emptyDetails({
      stage: "Concept & planning",
      completion: 35,
      milestones: [
        { id: "m1", label: "Define cuisine and positioning", done: true },
        { id: "m2", label: "Draft startup budget", done: true },
        { id: "m3", label: "Shortlist locations", done: false },
        { id: "m4", label: "Secure permits and licensing", done: false },
      ],
      nextTodos: [
        "Visit top 3 locations with a contractor",
        "Model 90-day cash flow",
        "Interview two prospective chefs",
      ],
      stakeholders: ["Founder (you)", "Chef partner", "Landlord", "Investor"],
      sections: [
        { id: "s1", title: "Concept", body: "Casual Mediterranean, 60 seats, dinner-focused." },
        { id: "s2", title: "Budget", body: "Target build-out under $450k; soft opening in Q3." },
        { id: "s3", title: "Risks", body: "Permitting delays and labor availability." },
      ],
    }),
    messages: [
      { role: "master", text: OPENER },
      {
        role: "fellow",
        text: "I want to open a neighborhood restaurant and need help structuring the plan.",
      },
      {
        role: "master",
        text: "Good. Let's lock the concept, budget envelope, and location criteria before we invite Fellows.",
      },
    ],
  },
  {
    id: "p-prep",
    title: "Preparing for a client meeting",
    objective: "Arrive with the right questions and a sharper framing of the client's problem.",
    status: "Active",
    owner: "You",
    ...emptyDetails({
      stage: "Briefing",
      completion: 55,
      milestones: [
        { id: "m1", label: "Gather prior notes", done: true },
        { id: "m2", label: "Draft problem statement", done: true },
        { id: "m3", label: "Prepare question list", done: false },
        { id: "m4", label: "Align on ask / next step", done: false },
      ],
      nextTodos: [
        "Tighten the one-paragraph problem framing",
        "List decisions the client must make",
        "Prep a 10-minute walkthrough",
      ],
      stakeholders: ["You", "Client sponsor", "Client ops lead"],
      sections: [
        {
          id: "s1",
          title: "Problem framing",
          body: "What decision is actually on the table in this meeting?",
        },
        {
          id: "s2",
          title: "Stakeholders",
          body: "Who decides, who influences, who is affected?",
        },
        {
          id: "s3",
          title: "Questions to ask",
          body: "Master will help draft these from prior patterns.",
        },
      ],
    }),
    messages: [
      { role: "master", text: OPENER },
      {
        role: "fellow",
        text: "I have a stakeholder meeting next week and need a sharper problem statement.",
      },
      {
        role: "master",
        text: "Understood. Confirm whether the immediate output is a meeting brief, a project charter, or a decision memo.",
      },
    ],
  },
  {
    id: "p-college",
    title: "Selecting a college for undergrad",
    objective: "Choose an undergrad program that fits academics, cost, and long-term goals.",
    status: "Active",
    owner: "You",
    ...emptyDetails({
      stage: "Research",
      completion: 20,
      milestones: [
        { id: "m1", label: "Clarify priorities (major, cost, location)", done: true },
        { id: "m2", label: "Build a long list of schools", done: false },
        { id: "m3", label: "Compare aid / net cost", done: false },
        { id: "m4", label: "Visit or attend info sessions", done: false },
      ],
      nextTodos: [
        "Rank must-haves vs nice-to-haves",
        "Shortlist 8–12 schools",
        "Note application deadlines",
      ],
      stakeholders: ["Student", "Parents / guardians", "Counselor"],
      sections: [
        {
          id: "s1",
          title: "Priorities",
          body: "Major interest, budget ceiling, preferred region, campus size.",
        },
        {
          id: "s2",
          title: "Long list",
          body: "Mix of reach, match, and safety schools.",
        },
        {
          id: "s3",
          title: "Decision criteria",
          body: "Net cost, academic fit, outcomes, culture.",
        },
      ],
    }),
    messages: [
      { role: "master", text: OPENER },
      {
        role: "fellow",
        text: "I need help choosing the right college for undergrad.",
      },
      {
        role: "master",
        text: "Let's start with constraints: budget, geography, intended field of study, and what 'success' looks like in four years.",
      },
    ],
  },
];

export function titleFromText(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < 8) return null;
  const clipped = cleaned.length > 72 ? `${cleaned.slice(0, 69)}…` : cleaned;
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}

export function extractListItems(text, labelRegex) {
  const match = text.match(labelRegex);
  if (!match) return null;
  const chunk = match[1] || match[0];
  const parts = chunk
    .split(/[\n•;]|,\s+/)
    .map((p) => p.replace(/^[-*\d.)\s]+/, "").trim())
    .filter((p) => p.length > 2 && p.length < 120);
  return parts.length ? parts.slice(0, 6) : null;
}

/** Heuristic live updates from the latest user message (+ optional master reply). */
export function deriveProjectPatch(project, userText, masterText = "") {
  const blob = `${userText}\n${masterText}`;
  const patch = {};

  const looksGeneric =
    !project.title ||
    /^new project$/i.test(project.title) ||
    /^untitled/i.test(project.title);

  if (looksGeneric) {
    const titled = titleFromText(userText);
    if (titled) patch.title = titled;
  }

  if (!project.objective || /define the problem/i.test(project.objective)) {
    patch.objective = userText.trim().slice(0, 280);
  }

  const stageMatch = blob.match(
    /\b(?:stage|phase)\s*(?:is|:)?\s*([A-Za-z][A-Za-z0-9 &\-/]{1,40})/i
  );
  if (stageMatch) patch.stage = stageMatch[1].trim();
  else if (/budget|financ/i.test(blob)) patch.stage = "Planning";
  else if (/implement|build|launch|open/i.test(blob)) patch.stage = "Execution";
  else if (/research|explore|discover|consider/i.test(blob)) patch.stage = "Discovery";
  else if (project.completion === 0) patch.stage = project.stage || "Discovery";

  const pctMatch = blob.match(/(\d{1,3})\s*%\s*(?:complete|done|progress)?/i);
  if (pctMatch) {
    patch.completion = Math.min(100, Math.max(0, Number(pctMatch[1])));
  } else if (project.completion < 15) {
    patch.completion = Math.min(40, (project.completion || 0) + 10);
  }

  const milestones = extractListItems(
    blob,
    /(?:milestones?|phases?)[:\s]+([\s\S]{0,400})/i
  );
  if (milestones) {
    patch.milestones = milestones.map((label, i) => ({
      id: `m-${Date.now()}-${i}`,
      label,
      done: false,
    }));
  }

  const todos = extractListItems(
    blob,
    /(?:next\s+(?:steps?|todos?|actions?)|todos?|action items?)[:\s]+([\s\S]{0,400})/i
  );
  if (todos) patch.nextTodos = todos;

  const stakeholders = extractListItems(
    blob,
    /(?:stakeholders?|who(?:'s| is) involved)[:\s]+([\s\S]{0,300})/i
  );
  if (stakeholders) patch.stakeholders = stakeholders;

  if (userText.trim().length > 20) {
    const sections = (project.sections || []).map((s) => ({ ...s }));
    if (sections[0] && /problem framing/i.test(sections[0].title)) {
      sections[0] = {
        ...sections[0],
        body: userText.trim().slice(0, 400),
      };
    }
    patch.sections = sections;
  }

  if (project.status === "Draft" && (patch.title || userText.length > 40)) {
    patch.status = "Active";
  }

  return patch;
}

