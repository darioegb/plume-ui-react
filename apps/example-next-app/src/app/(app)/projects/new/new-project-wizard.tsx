'use client'

import type { ReactNode } from 'react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
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
  { fields: ['name', 'owner'], id: 'details' },
  { fields: ['team', 'due'], id: 'plan' },
  { fields: [], id: 'review' },
] as const

const initial: NewProjectInput = {
  description: '',
  due: '',
  name: '',
  notify: true,
  owner: '',
  team: [],
  visibility: 'workspace',
}

export function NewProjectWizard({
  members,
  takenNames,
}: Readonly<{ members: string[]; takenNames: string[] }>): ReactNode {
  const t = useTranslations('newProject')
  const tValidation = useTranslations('validation')
  const tVisibility = useTranslations('visibility')
  const locale = useLocale()
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
        description: values.notify ? t('notified', { count: values.team.length }) : undefined,
        title: t('created', { name: result.name ?? values.name.trim() }),
      })
      router.push('/projects')
    })
  }

  const error = (field: keyof NewProjectErrors): string | undefined => {
    const key = errors[field]
    return key ? tValidation(key) : undefined
  }

  return (
    <div className={styles.wizard}>
      <Stepper activeStep={step} aria-label={t('progress')}>
        {steps.map(({ id }) => (
          <Step key={id}>
            <StepIndicator />
            <StepTitle>{t(`steps.${id}.title`)}</StepTitle>
            <StepDescription>{t(`steps.${id}.description`)}</StepDescription>
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
                <Field errorText={error('name')} label={t('name')} required>
                  <Input
                    onChange={(event) => set('name', event.target.value)}
                    placeholder={t('namePlaceholder')}
                    value={values.name}
                  />
                </Field>
                <Field
                  helperText={t('projectDescriptionHelper')}
                  label={t('projectDescription')}
                  optionalText={t('optional')}
                >
                  <Textarea
                    maxLength={160}
                    onChange={(event) => set('description', event.target.value)}
                    rows={3}
                    value={values.description}
                  />
                </Field>
                <Field errorText={error('owner')} label={t('owner')} required>
                  <Select onValueChange={(value) => set('owner', String(value))} value={values.owner}>
                    <SelectTrigger placeholder={t('ownerPlaceholder')} />
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
                <Field errorText={error('team')} label={t('team')} required>
                  <Select
                    multiple
                    onValueChange={(value) => set('team', Array.isArray(value) ? value : [value])}
                    value={values.team}
                  >
                    <SelectTrigger placeholder={t('teamPlaceholder')} />
                    <SelectContent>
                      {members.map((member) => (
                        <SelectOption key={member} value={member}>
                          {member}
                        </SelectOption>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field errorText={error('due')} label={t('due')} required>
                  <DatePicker
                    minDate={new Date()}
                    onValueChange={(range: DateRange) => set('due', range.startDate ? toIsoDate(range.startDate) : '')}
                    placeholder={t('duePlaceholder')}
                    value={{ endDate: null, startDate: values.due ? new Date(`${values.due}T00:00:00`) : null }}
                  />
                </Field>
                <Field label={t('visibility')}>
                  <RadioGroup
                    onValueChange={(value) => set('visibility', value as Visibility)}
                    value={values.visibility}
                  >
                    <Field label={tVisibility('workspace')} orientation="inline">
                      <Radio value="workspace" />
                    </Field>
                    <Field label={tVisibility('private')} orientation="inline">
                      <Radio value="private" />
                    </Field>
                  </RadioGroup>
                </Field>
                <Field label={t('notify')} orientation="inline">
                  <Toggle checked={values.notify} onChange={(event) => set('notify', event.target.checked)} />
                </Field>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <dl className={styles.summary}>
                  <dt>{t('name')}</dt>
                  <dd>{values.name.trim()}</dd>
                  <dt>{t('projectDescription')}</dt>
                  <dd>{values.description || t('noDescription')}</dd>
                  <dt>{t('owner')}</dt>
                  <dd>{values.owner}</dd>
                  <dt>{t('team')}</dt>
                  <dd>
                    <AvatarGroup max={5} size="sm">
                      {values.team.map((member) => (
                        <Avatar key={member} name={member} />
                      ))}
                    </AvatarGroup>
                  </dd>
                  <dt>{t('due')}</dt>
                  <dd>{formatDue(values.due, locale)}</dd>
                  <dt>{t('visibility')}</dt>
                  <dd>{tVisibility(values.visibility)}</dd>
                </dl>
                <Alert status="info">{t('startsOnTrack')}</Alert>
              </>
            ) : null}

            <div className={styles.actions}>
              <Button
                disabled={step === 0 || pending}
                onClick={() => setStep(step - 1)}
                variant="ghost"
              >
                {t('back')}
              </Button>
              <Button busy={pending} busyText="…" type="submit">
                {isLast ? t('create') : t('continue')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
