import type { ReactNode } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  DatePicker,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Field,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectChevron,
  SelectChips,
  SelectCombobox,
  SelectContent,
  SelectField,
  SelectHidden,
  SelectOption,
  SelectTrigger,
  Textarea,
  useToast,
  type DateRange,
} from "plume-ui-react";
import {
  createProject,
  members,
  type NewProjectInput,
  type Project,
  type Visibility,
} from "../lib/data";
import { toIsoDate } from "../lib/format";
import {
  dueRules,
  nameRules,
  ownerRules,
  teamRules,
  useErrorText,
} from "../lib/validation";
import styles from "./projects.module.css";

const empty: NewProjectInput = {
  description: "",
  due: "",
  name: "",
  notify: false,
  owner: "",
  team: [],
  visibility: "Workspace",
};

export function NewProjectDrawer({
  onCreated,
  onOpenChange,
  open,
  takenNames,
}: Readonly<{
  onCreated: (project: Project) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  takenNames: string[];
}>): ReactNode {
  const { t } = useTranslation();
  const errorText = useErrorText();
  const toast = useToast();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<NewProjectInput>({ defaultValues: empty });

  // Resetting once the drawer is closed, after a submit has finished, keeps the next opening untouched.
  useEffect(() => {
    if (!open) reset(empty);
  }, [open, reset]);

  const changeOpen = (next: boolean): void => {
    if (isSubmitting) return;
    onOpenChange(next);
  };

  const submit = async (values: NewProjectInput): Promise<void> => {
    try {
      const project = await createProject({
        ...values,
        name: values.name.trim(),
      });
      onCreated(project);
      onOpenChange(false);
    } catch (error) {
      console.error("Could not create the project.", error);
      toast.error({ title: t("newProject.createError") });
    }
  };

  return (
    <Drawer onOpenChange={changeOpen} open={open}>
      <DrawerContent>
        <DrawerHeader>{t("newProject.title")}</DrawerHeader>
        <form
          className={styles.drawerForm}
          noValidate
          onSubmit={(event) => {
            void handleSubmit(submit)(event);
          }}
        >
          <DrawerBody>
            <div className="d-flex flex-column gap-3 py-2">
              <Field
                errorText={errorText(errors.name)}
                label={t("newProject.nameLabel")}
                required
              >
                <Input
                  placeholder={t("newProject.namePlaceholder")}
                  {...register("name", nameRules(takenNames))}
                />
              </Field>
              <Field
                helperText={t("newProject.descriptionHelper")}
                label={t("newProject.descriptionLabel")}
                optionalText={t("newProject.descriptionOptional")}
              >
                <Textarea
                  maxLength={160}
                  rows={3}
                  {...register("description")}
                />
              </Field>
              <Controller
                control={control}
                name="owner"
                render={({ field, fieldState }) => (
                  <Field
                    errorText={errorText(fieldState.error)}
                    label={t("newProject.ownerLabel")}
                    required
                  >
                    <Select
                      name={field.name}
                      onValueChange={(value) => field.onChange(String(value))}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectField>
                          <SelectCombobox
                            placeholder={t("newProject.ownerPlaceholder")}
                            ref={field.ref}
                          />
                        </SelectField>
                        <SelectChevron />
                        <SelectHidden />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectOption key={member} value={member}>
                            {member}
                          </SelectOption>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                rules={ownerRules}
              />
              <Controller
                control={control}
                name="team"
                render={({ field, fieldState }) => (
                  <Field
                    errorText={errorText(fieldState.error)}
                    label={t("newProject.teamLabel")}
                    required
                  >
                    <Select
                      multiple
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(Array.isArray(value) ? value : [value])
                      }
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectField>
                          <SelectChips />
                          <SelectCombobox
                            placeholder={t("newProject.teamPlaceholder")}
                            ref={field.ref}
                          />
                        </SelectField>
                        <SelectChevron />
                        <SelectHidden />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectOption key={member} value={member}>
                            {member}
                          </SelectOption>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                rules={teamRules}
              />
              <Controller
                control={control}
                name="due"
                render={({ field, fieldState }) => (
                  <Field
                    errorText={errorText(fieldState.error)}
                    label={t("newProject.dueLabel")}
                    required
                  >
                    <DatePicker
                      minDate={new Date()}
                      name={field.name}
                      onBlur={field.onBlur}
                      onValueChange={(range: DateRange) =>
                        field.onChange(
                          range.startDate ? toIsoDate(range.startDate) : "",
                        )
                      }
                      placeholder={t("newProject.duePlaceholder")}
                      ref={field.ref}
                      value={{
                        endDate: null,
                        startDate: field.value
                          ? new Date(`${field.value}T00:00:00`)
                          : null,
                      }}
                    />
                  </Field>
                )}
                rules={dueRules}
              />
              <Controller
                control={control}
                name="visibility"
                render={({ field }) => (
                  <Field label={t("newProject.visibilityLabel")}>
                    <RadioGroup
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(value as Visibility)
                      }
                      value={field.value}
                    >
                      <Field
                        label={t("visibility.Workspace")}
                        orientation="inline"
                      >
                        <Radio value="Workspace" />
                      </Field>
                      <Field
                        label={t("visibility.Private")}
                        orientation="inline"
                      >
                        <Radio value="Private" />
                      </Field>
                    </RadioGroup>
                  </Field>
                )}
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => changeOpen(false)}
              variant="ghost"
            >
              {t("newProject.cancel")}
            </Button>
            <Button busy={isSubmitting} busyText="…" type="submit">
              {t("newProject.submit")}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
