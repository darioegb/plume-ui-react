'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { Button, Checkbox, Field, Toggle, useToast } from 'plume-ui-react'
import styles from './settings.module.css'

const channels = [
  { id: 'email', label: 'Email me about activity on my projects' },
  { id: 'push', label: 'Send push notifications' },
  { id: 'digest', label: 'Send me a weekly digest' },
]

export function NotificationSettings(): ReactNode {
  const toast = useToast()
  const [paused, setPaused] = useState(false)
  const [enabled, setEnabled] = useState<string[]>(['email', 'digest'])

  const toggle = (id: string): void =>
    setEnabled((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  return (
    <div className={styles.section}>
      <Field helperText="Mutes every channel until you turn it back on." label="Pause all notifications" orientation="inline">
        <Toggle checked={paused} onChange={(event) => setPaused(event.target.checked)} />
      </Field>
      <div className={styles.group} role="group" aria-label="Channels">
        {channels.map((channel) => (
          <Field key={channel.id} label={channel.label} orientation="inline">
            <Checkbox
              checked={enabled.includes(channel.id)}
              disabled={paused}
              onChange={() => toggle(channel.id)}
            />
          </Field>
        ))}
      </div>
      <div>
        <Button onClick={() => toast.success({ title: 'Preferences saved' })}>Save preferences</Button>
      </div>
    </div>
  )
}
