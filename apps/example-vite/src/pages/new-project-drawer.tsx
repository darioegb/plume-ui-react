import type { ReactNode } from "react";
import { useState } from "react";
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
  SelectContent,
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
import { validateNewProject, type NewProjectErrors } from "../lib/validation";
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
  const toast = useToast();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<NewProjectErrors>({});
  const [busy, setBusy] = useState(false);

  const set = <Key extends keyof NewProjectInput>(
    key: Key,
    value: NewProjectInput[Key],
  ): void => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const changeOpen = (next: boolean): void => {
    if (busy) return;
    if (!next) {
      setValues(empty);
      setErrors({});
    }
    onOpenChange(next);
  };

  const submit = async (): Promise<void> => {
    const found = validateNewProject(values, takenNames, toIsoDate(new Date()));
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      const project = await createProject({
        ...values,
        name: values.name.trim(),
      });
      onCreated(project);
      setValues(empty);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Could not create the project.", error);
      toast.error({ title: "Could not create the project. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer onOpenChange={changeOpen} open={open}>
      <DrawerContent>
        <DrawerHeader>New project</DrawerHeader>
        <form
          className={styles.drawerForm}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <DrawerBody>
            <div className={styles.form}>
              <Field errorText={errors.name} label="Name" required>
                <Input
                  onChange={(event) => set("name", event.target.value)}
                  placeholder="Website redesign"
                  value={values.name}
                />
              </Field>
              <Field
                helperText="A line or two for the team."
                label="Description"
                optionalText="optional"
              >
                <Textarea
                  maxLength={160}
                  onChange={(event) => set("description", event.target.value)}
                  rows={3}
                  value={values.description}
                />
              </Field>
              <Field errorText={errors.owner} label="Owner" required>
                <Select
                  onValueChange={(value) => set("owner", String(value))}
                  value={values.owner}
                >
                  <SelectTrigger placeholder="Pick the person in charge" />
                  <SelectContent>
                    {members.map((member) => (
                      <SelectOption key={member} value={member}>
                        {member}
                      </SelectOption>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field errorText={errors.team} label="Team" required>
                <Select
                  multiple
                  onValueChange={(value) =>
                    set("team", Array.isArray(value) ? value : [value])
                  }
                  value={values.team}
                >
                  <SelectTrigger placeholder="Add members" />
                  <SelectContent>
                    {members.map((member) => (
                      <SelectOption key={member} value={member}>
                        {member}
                      </SelectOption>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field errorText={errors.due} label="Due date" required>
                <DatePicker
                  minDate={new Date()}
                  onValueChange={(range: DateRange) =>
                    set(
                      "due",
                      range.startDate ? toIsoDate(range.startDate) : "",
                    )
                  }
                  placeholder="Pick a date"
                  value={{
                    endDate: null,
                    startDate: values.due
                      ? new Date(`${values.due}T00:00:00`)
                      : null,
                  }}
                />
              </Field>
              <Field label="Who can see it">
                <RadioGroup
                  onValueChange={(value) =>
                    set("visibility", value as Visibility)
                  }
                  value={values.visibility}
                >
                  <Field label="Workspace" orientation="inline">
                    <Radio value="Workspace" />
                  </Field>
                  <Field label="Private" orientation="inline">
                    <Radio value="Private" />
                  </Field>
                </RadioGroup>
              </Field>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              disabled={busy}
              onClick={() => changeOpen(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button busy={busy} busyText="…" type="submit">
              Create project
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
