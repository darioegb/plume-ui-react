'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'plume-ui-react'
import { AppearanceSettings } from './appearance-settings'
import { NotificationSettings } from './notification-settings'
import { WorkspaceSettings } from './workspace-settings'

export function SettingsForm(): ReactNode {
  const t = useTranslations('settings.sections')
  return (
    <Accordion defaultValue={['appearance']} type="multiple" variant="outline">
      <AccordionItem value="appearance">
        <AccordionTrigger>{t('appearance')}</AccordionTrigger>
        <AccordionContent>
          <AppearanceSettings />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger>{t('notifications')}</AccordionTrigger>
        <AccordionContent>
          <NotificationSettings />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="workspace">
        <AccordionTrigger>{t('workspace')}</AccordionTrigger>
        <AccordionContent>
          <WorkspaceSettings />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
