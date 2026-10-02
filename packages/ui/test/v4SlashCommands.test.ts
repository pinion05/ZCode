import assert from "node:assert/strict";
import test from "node:test";
import { parseV4VisibleSlashCommand } from "../src/v4/slashCommands.js";

test("bare /model parses as a local config-picker command for the model menu", () => {
  assert.deepEqual(parseV4VisibleSlashCommand("/model"), {
    kind: "openConfigPicker",
    command: "model",
    picker: "model",
    displayText: "/model",
  });
});

test("bare /reasoning parses as a local config-picker command for the thought menu", () => {
  assert.deepEqual(parseV4VisibleSlashCommand("/reasoning"), {
    kind: "openConfigPicker",
    command: "reasoning",
    picker: "thought",
    displayText: "/reasoning",
  });
});

test("/model and /reasoning are case-insensitive and ignore trailing arguments", () => {
  assert.deepEqual(parseV4VisibleSlashCommand("/MODEL glm-4.7"), {
    kind: "openConfigPicker",
    command: "model",
    picker: "model",
    displayText: "/MODEL glm-4.7",
  });
  const reasoning = parseV4VisibleSlashCommand("/Reasoning high");
  assert.equal(reasoning?.kind, "openConfigPicker");
  if (reasoning?.kind === "openConfigPicker") {
    assert.equal(reasoning.picker, "thought");
  }
});

test("/model and /reasoning with attachments stay plain prompts instead of opening menus", () => {
  assert.equal(parseV4VisibleSlashCommand("/model", [{}]), null);
  assert.equal(parseV4VisibleSlashCommand("/reasoning", [], { contextAttachmentCount: 1 }), null);
});

test("non-command text and existing commands keep their previous parsing", () => {
  assert.equal(parseV4VisibleSlashCommand("model"), null);
  assert.equal(parseV4VisibleSlashCommand("/modelfoo"), null);
  assert.deepEqual(parseV4VisibleSlashCommand("/compact"), {
    kind: "compact",
    displayText: "/compact",
  });
  const goal = parseV4VisibleSlashCommand("/goal ship it");
  assert.equal(goal?.kind, "sendGoalCommand");
});
