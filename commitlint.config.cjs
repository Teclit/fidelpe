module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      // Allow optional "<branch> - " prefix before conventional header
      // Captures: branch?, type, scope?, subject
      headerPattern: /^(?:([^\r\n]+?)\s-\s)?(\w+)(?:\(([^)]+)\))?!?:\s(.+)$/,
      headerCorrespondence: ["branch", "type", "scope", "subject"],
    },
  },
  rules: {
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 200],
    "subject-case": [2, "never", ["pascal-case", "upper-case"]],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "wip",
        "config",
        "i18n",
        "deps",
        "security",
        "infra",
        "docs",
        "ux",
        "ui",
        "api",
        "data",
        "auth",
        "release",
        "hotfix",
      ],
    ],
  },
};
