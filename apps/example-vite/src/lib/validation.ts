import type { FieldError, RegisterOptions } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { Translation } from "../i18n/en";
import type { NewProjectInput } from "./data";
import { toIsoDate } from "./format";

export type ValidationKey = `validation.${keyof Translation["validation"]}`;

const fail = (key: ValidationKey): ValidationKey => key;

// The rules return keys, not texts, so the message follows the language when it is rendered.
// The demo runs entirely in the browser; a real API must validate inputs too.
export const nameRules = (
  takenNames: readonly string[],
): RegisterOptions<NewProjectInput, "name"> => ({
  validate: {
    length: (value) => value.trim().length >= 3 || fail("validation.nameMin"),
    unique: (value) =>
      !takenNames.some(
        (taken) => taken.toLowerCase() === value.trim().toLowerCase(),
      ) || fail("validation.nameTaken"),
  },
});

export const ownerRules: RegisterOptions<NewProjectInput, "owner"> = {
  required: fail("validation.ownerRequired"),
};

export const teamRules: RegisterOptions<NewProjectInput, "team"> = {
  validate: (team) => team.length > 0 || fail("validation.teamRequired"),
};

export const dueRules: RegisterOptions<NewProjectInput, "due"> = {
  validate: {
    required: (due) => due !== "" || fail("validation.dueRequired"),
    past: (due) => due >= toIsoDate(new Date()) || fail("validation.duePast"),
  },
};

export function useErrorText(): (
  error: FieldError | undefined,
) => string | undefined {
  const { t } = useTranslation();
  return (error) =>
    error?.message ? t(error.message as ValidationKey) : undefined;
}
