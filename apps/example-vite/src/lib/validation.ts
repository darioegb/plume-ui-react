import type { NewProjectInput } from "../lib/data";

export type NewProjectErrors = Partial<
  Record<"due" | "name" | "owner" | "team", string>
>;

// The demo runs entirely in the browser; a real API must validate inputs too.
export function validateNewProject(
  input: NewProjectInput,
  takenNames: readonly string[],
  earliestDue?: string,
): NewProjectErrors {
  const errors: NewProjectErrors = {};
  const name = input.name.trim();
  if (name.length < 3) errors.name = "Use at least 3 characters.";
  else if (
    takenNames.some((taken) => taken.toLowerCase() === name.toLowerCase())
  ) {
    errors.name = "A project with this name already exists.";
  }
  if (!input.owner) errors.owner = "Pick the person in charge.";
  if (input.team.length === 0) errors.team = "Add at least one member.";
  if (!input.due) errors.due = "Pick a due date.";
  else if (earliestDue && input.due < earliestDue)
    errors.due = "The due date cannot be in the past.";
  return errors;
}
