'use client'

import type { ReactNode } from 'react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  AvatarGroup,
  Avatar,
  Button,
  Card,
  CardBody,
  DatePicker,
  Field,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  Step,
  StepDescription,
  StepIndicator,
  StepSeparator,
  StepTitle,
  Stepper,
  Textarea,
  Toggle,
  useToast,
  type DateRange,
} from 'plume-ui-react'
import { createProject } from '@/app/actions'
import type { NewProjectInput, Visibility } from '@/lib/data'
import { formatDue, toIsoDate } from '@/lib/format'
import { validateNewProject, type NewProjectErrors } from '@/lib/validation'
import styles from './new-project.module.css'

const steps = [
  { description: 'Name and owner', fields: ['name', 'owner'], title: 'Details' },
  { description: 'Team and date', fields: ['team', 'due'], title: 'Plan' },
  { description: 'Check and create', fields: [], title: 'Review' },
] as const

const initial: NewProjectInput = {
  description: '',
  due: '',
  name: '',
  notify: true,
  owner: '',
  team: [],
  visibility: 'Workspace',
}

export function NewProjectWizard({
  members,
  takenNames,
}: Readonly<{ members: string[]; takenNames: string[] }>): ReactNode {
  const router = useRouter()
  const toast = useToast()
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<NewProjectErrors>({})

  const set = <Key extends keyof NewProjectInput>(key: Key, value: NewProjectInput[Key]): void => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const today = toIsoDate(new Date())
  const current = steps[step]
  const isLast = step === steps.length - 1

  const next = (): void => {
    const all = validateNewProject(values, takenNames, today)
    const own = Object.fromEntries(
      Object.entries(all).filter(([field]) => (current.fields as readonly string[]).includes(field)),
    )
    setErrors(own)
    if (Object.keys(own).length === 0) setStep(step + 1)
  }

  const create = (): void => {
    startTransition(async () => {
      const result = await createProject(values)
      if (result.errors) {
        setErrors(result.errors)
        setStep(0)
        return
      }
      toast.success({
        description: values.notify
          ? `${values.team.length} ${values.team.length === 1 ? 'member was' : 'members were'} notified by email.`
          : undefined,
        title: `${result.name} was created`,
      })
      router.push('/projects')
    })
  }

  return (
    <div className={styles.wizard}>
      <Stepper activeStep={step} aria-label="New project progress">
        {steps.map(({ description, title }) => (
          <Step key={title}>
            <StepIndicator />
            <StepTitle>{title}</StepTitle>
            <StepDescription>{description}</StepDescription>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Card variant="outline">
        <CardBody>
          <form
            className={styles.form}
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              if (isLast) create()
              else next()
            }}
          >
            {step === 0 ? (
              <>
                <Field errorText={errors.name} label="Name" required>
                  <Input
                    onChange={(event) => set('name', event.target.value)}
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
                    onChange={(event) => set('description', event.target.value)}
                    rows={3}
                    value={values.description}
                  />
                </Field>
                <Field errorText={errors.owner} label="Owner" required>
                  <Select onValueChange={(value) => set('owner', String(value))} value={values.owner}>
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
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Field errorText={errors.team} label="Team" required>
                  <Select
                    multiple
                    onValueChange={(value) => set('team', Array.isArray(value) ? value : [value])}
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
                    onValueChange={(range: DateRange) => set('due', range.startDate ? toIsoDate(range.startDate) : '')}
                    placeholder="Pick a date"
                    value={{ endDate: null, startDate: values.due ? new Date(`${values.due}T00:00:00`) : null }}
                  />
                </Field>
                <Field label="Who can see it">
                  <RadioGroup
                    onValueChange={(value) => set('visibility', value as Visibility)}
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
                <Field label="Notify the team by email" orientation="inline">
                  <Toggle checked={values.notify} onChange={(event) => set('notify', event.target.checked)} />
                </Field>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <dl className={styles.summary}>
                  <dt>Name</dt>
                  <dd>{values.name.trim()}</dd>
                  <dt>Description</dt>
                  <dd>{values.description || 'No description'}</dd>
                  <dt>Owner</dt>
                  <dd>{values.owner}</dd>
                  <dt>Team</dt>
                  <dd>
                    <AvatarGroup max={5} size="sm">
                      {values.team.map((member) => (
                        <Avatar key={member} name={member} />
                      ))}
                    </AvatarGroup>
                  </dd>
                  <dt>Due</dt>
                  <dd>{formatDue(values.due)}</dd>
                  <dt>Visibility</dt>
                  <dd>{values.visibility}</dd>
                </dl>
                <Alert status="info">
                  The project starts on track with no progress. You can change that from the list.
                </Alert>
              </>
            ) : null}

            <div className={styles.actions}>
              <Button
                disabled={step === 0 || pending}
                onClick={() => setStep(step - 1)}
                variant="ghost"
              >
                Back
              </Button>
              <Button busy={pending} busyText="Creating…" type="submit">
                {isLast ? 'Create project' : 'Continue'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
