'use client'

import type { ReactNode } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'plume-ui-react'
import { AppearanceSettings } from './appearance-settings'
import { NotificationSettings } from './notification-settings'
import { WorkspaceSettings } from './workspace-settings'

export function SettingsForm(): ReactNode {
  return (
    <Accordion defaultValue={['appearance']} type="multiple" variant="outline">
      <AccordionItem value="appearance">
        <AccordionTrigger>Appearance</AccordionTrigger>
        <AccordionContent>
          <AppearanceSettings />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          <NotificationSettings />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="workspace">
        <AccordionTrigger>Workspace</AccordionTrigger>
        <AccordionContent>
          <WorkspaceSettings />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
