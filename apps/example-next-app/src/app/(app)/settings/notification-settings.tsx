'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Checkbox, Field, Toggle, useToast } from 'plume-ui-react'

const channels = ['email', 'push', 'digest'] as const

export function NotificationSettings(): ReactNode {
  const t = useTranslations('settings.notifications')
  const toast = useToast()
  const [paused, setPaused] = useState(false)
  const [enabled, setEnabled] = useState<string[]>(['email', 'digest'])

  const toggle = (id: string): void =>
    setEnabled((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  return (
    <div className="flex max-w-xl flex-col gap-5 py-2">
      <Field helperText={t('pauseHelper')} label={t('pause')} orientation="inline">
        <Toggle checked={paused} onChange={(event) => setPaused(event.target.checked)} />
      </Field>
      <div className="flex flex-col gap-3" role="group" aria-label={t('channels')}>
        {channels.map((channel) => (
          <Field key={channel} label={t(channel)} orientation="inline">
            <Checkbox
              checked={enabled.includes(channel)}
              disabled={paused}
              onChange={() => toggle(channel)}
            />
          </Field>
        ))}
      </div>
      <div>
        <Button onClick={() => toast.success({ title: t('saved') })}>{t('save')}</Button>
      </div>
    </div>
  )
}
