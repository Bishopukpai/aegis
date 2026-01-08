import { Schema, model, models } from "mongoose";

/* =========================================================
   SESSION (Anonymous Identity – No Login)
========================================================= */
const SessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    userAgent: String,
    ipHash: String,

    lastActiveAt: Date,

    expiresAt: {
      type: Date,
      index: { expires: "7d" } // auto-clean after 7 days
    }
  },
  { timestamps: true }
);

/* =========================================================
   PROJECT (Owned by Session)
========================================================= */
const ProjectSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    github: {
      repoUrl: {
        type: String,
        required: true
      },
      defaultBranch: {
        type: String,
        default: "main"
      },
      installationId: String,
      lastSyncedAt: Date
    },

    techStack: {
      language: String,
      framework: String,
      ciProvider: String
    }
  },
  { timestamps: true }
);

/* =========================================================
   ORCHESTRATION (Autonomous Flow)
========================================================= */
const OrchestrationSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true
    },

    trigger: {
      type: {
        type: String,
        enum: ["manual", "schedule", "webhook"]
      },
      source: String
    },

    thinkingLevel: {
      type: Number,
      min: 1,
      max: 4
    },

    status: {
      type: String,
      enum: ["running", "completed", "failed", "recovered"],
      index: true
    },

    startedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

/* =========================================================
   AGENT RUN (DevOps / Code / Compliance)
========================================================= */
const AgentRunSchema = new Schema(
  {
    orchestrationId: {
      type: Schema.Types.ObjectId,
      ref: "Orchestration",
      index: true
    },

    agentType: {
      type: String,
      enum: ["devops", "code", "compliance"],
      index: true
    },

    objective: String,

    status: {
      type: String,
      enum: ["running", "blocked", "failed", "completed"]
    },

    startedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

/* =========================================================
   AGENT MEMORY (Long-Term Memory)
========================================================= */
const AgentMemorySchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true
    },

    agentType: {
      type: String,
      enum: ["shared", "devops", "code", "compliance"],
      index: true
    },

    memoryType: {
      type: String,
      enum: ["fact", "decision", "observation", "lesson"],
      index: true
    },

    content: {
      type: String,
      required: true
    },

    sourceRunId: {
      type: Schema.Types.ObjectId,
      ref: "AgentRun"
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  { timestamps: true }
);

/* =========================================================
   THOUGHT SIGNATURE (Reasoning Continuity)
========================================================= */
const ThoughtSignatureSchema = new Schema(
  {
    orchestrationId: {
      type: Schema.Types.ObjectId,
      ref: "Orchestration",
      index: true
    },

    agentType: String,
    step: Number,

    signatureHash: {
      type: String,
      index: true
    },

    summary: String
  },
  { timestamps: true }
);

/* =========================================================
   PLAN (Explicit Planning Artifacts)
========================================================= */
const PlanSchema = new Schema(
  {
    agentRunId: {
      type: Schema.Types.ObjectId,
      ref: "AgentRun",
      index: true
    },

    planVersion: Number,

    goals: [String],

    steps: [
      {
        order: Number,
        description: String,
        status: {
          type: String,
          enum: ["pending", "done", "skipped"]
        }
      }
    ]
  },
  { timestamps: true }
);

/* =========================================================
   ACTION (Tool / Execution Evidence)
========================================================= */
const ActionSchema = new Schema(
  {
    agentRunId: {
      type: Schema.Types.ObjectId,
      ref: "AgentRun",
      index: true
    },

    actionType: {
      type: String,
      enum: ["command", "api", "git", "ci", "analysis"],
      index: true
    },

    input: Schema.Types.Mixed,
    output: Schema.Types.Mixed,

    success: Boolean,
    durationMs: Number
  },
  { timestamps: true }
);

/* =========================================================
   FAILURE (Root Cause)
========================================================= */
const FailureSchema = new Schema(
  {
    agentRunId: {
      type: Schema.Types.ObjectId,
      ref: "AgentRun",
      index: true
    },

    category: {
      type: String,
      enum: ["test", "build", "deployment", "policy"]
    },

    message: String,
    rootCause: String,
    detectedAt: Date
  },
  { timestamps: true }
);

/* =========================================================
   RECOVERY (Self-Correction)
========================================================= */
const RecoverySchema = new Schema(
  {
    failureId: {
      type: Schema.Types.ObjectId,
      ref: "Failure",
      index: true
    },

    strategy: String,

    actionsTaken: [
      {
        type: Schema.Types.ObjectId,
        ref: "Action"
      }
    ],

    success: Boolean,
    resolvedAt: Date
  },
  { timestamps: true }
);

/* =========================================================
   COMPLIANCE EVENT (Policy Drift Tracking)
========================================================= */
const ComplianceEventSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      index: true
    },

    policy: String,
    description: String,
    detectedInCommit: String,

    status: {
      type: String,
      enum: ["open", "acknowledged", "resolved"]
    },

    detectedAt: Date
  },
  { timestamps: true }
);

/* =========================================================
   ARTIFACT (Observable Proof)
========================================================= */
const ArtifactSchema = new Schema(
  {
    orchestrationId: {
      type: Schema.Types.ObjectId,
      ref: "Orchestration",
      index: true
    },

    type: {
      type: String,
      enum: ["log", "metric", "diff", "report", "screenshot"]
    },

    uri: String,
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

/* =========================================================
   UI EVENT (Dashboard Timeline)
========================================================= */
const UIEventSchema = new Schema(
  {
    orchestrationId: {
      type: Schema.Types.ObjectId,
      ref: "Orchestration",
      index: true
    },

    level: {
      type: String,
      enum: ["info", "warning", "error", "success"]
    },

    message: String,
    relatedAgent: String
  },
  { timestamps: true }
);

/* =========================================================
   MODEL EXPORTS (APP ROUTER SAFE)
========================================================= */
export const Session =
  models.Session || model("Session", SessionSchema);

export const Project =
  models.Project || model("Project", ProjectSchema);

export const Orchestration =
  models.Orchestration ||
  model("Orchestration", OrchestrationSchema);

export const AgentRun =
  models.AgentRun || model("AgentRun", AgentRunSchema);

export const AgentMemory =
  models.AgentMemory ||
  model("AgentMemory", AgentMemorySchema);

export const ThoughtSignature =
  models.ThoughtSignature ||
  model("ThoughtSignature", ThoughtSignatureSchema);

export const Plan =
  models.Plan || model("Plan", PlanSchema);

export const Action =
  models.Action || model("Action", ActionSchema);

export const Failure =
  models.Failure || model("Failure", FailureSchema);

export const Recovery =
  models.Recovery || model("Recovery", RecoverySchema);

export const ComplianceEvent =
  models.ComplianceEvent ||
  model("ComplianceEvent", ComplianceEventSchema);

export const Artifact =
  models.Artifact || model("Artifact", ArtifactSchema);

export const UIEvent =
  models.UIEvent || model("UIEvent", UIEventSchema);
