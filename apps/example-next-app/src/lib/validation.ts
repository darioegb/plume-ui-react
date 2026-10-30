import type { NewProjectInput } from '@/lib/data'

export type ValidationKey =
  | 'duePast'
  | 'dueRequired'
  | 'emailInvalid'
  | 'memberExists'
  | 'nameShort'
  | 'nameTaken'
  | 'ownerRequired'
  | 'passwordShort'
  | 'teamRequired'

export type NewProjectErrors = Partial<Record<'due' | 'name' | 'owner' | 'team', ValidationKey>>

// The errors are keys of the `validation` messages, so the server stays free of any language and the client translates them.
// It runs in the browser to guide the user and again on the server, which is the one that decides.
export function validateNewProject(
  input: NewProjectInput,
  takenNames: readonly string[],
  earliestDue?: string,
): NewProjectErrors {
  const errors: NewProjectErrors = {}
  const name = input.name.trim()
  if (name.length < 3) errors.name = 'nameShort'
  else if (takenNames.some((taken) => taken.toLowerCase() === name.toLowerCase())) {
    errors.name = 'nameTaken'
  }
  if (!input.owner) errors.owner = 'ownerRequired'
  if (input.team.length === 0) errors.team = 'teamRequired'
  if (!input.due) errors.due = 'dueRequired'
  else if (earliestDue && input.due < earliestDue) errors.due = 'duePast'
  return errors
}
