'use client'

import type { ReactNode } from 'react'
import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import {
  Badge,
  Button,
  Field,
  ProgressBar,
  Radio,
  RadioGroup,
  useTheme,
  type ColorModeSetting,
} from 'plume-ui-react'
import { saveBrand, saveColorMode } from '@/app/actions'
import { usePreferences } from '@/app/providers'
import { brands, type BrandId } from '@/theme'
import styles from './settings.module.css'

const brandIds = Object.keys(brands) as BrandId[]

export function AppearanceSettings(): ReactNode {
  const t = useTranslations('settings.appearance')
  const { setColorMode } = useTheme()
  const { brand, colorModeSetting, setBrand, setColorModeSetting } = usePreferences()
  const [, startTransition] = useTransition()

  return (
    <div className={styles.section}>
      <Field helperText={t('colorModeHelper')} label={t('colorMode')}>
        <RadioGroup
          onValueChange={(value) => {
            setColorMode(value as ColorModeSetting)
            setColorModeSetting(value as ColorModeSetting)
            startTransition(() => saveColorMode(value))
          }}
          orientation="horizontal"
          value={colorModeSetting}
        >
          <Field label={t('system')} orientation="inline">
            <Radio value="system" />
          </Field>
          <Field label={t('light')} orientation="inline">
            <Radio value="light" />
          </Field>
          <Field label={t('dark')} orientation="inline">
            <Radio value="dark" />
          </Field>
        </RadioGroup>
      </Field>

      <Field helperText={t('brandHelper')} label={t('brand')}>
        <RadioGroup
          onValueChange={(value) => {
            setBrand(value as BrandId)
            startTransition(() => saveBrand(value))
          }}
          orientation="horizontal"
          value={brand}
        >
          {brandIds.map((id) => (
            <Field
              key={id}
              label={
                <span className={styles.brand}>
                  <span
                    aria-hidden="true"
                    className={styles.swatch}
                    style={{ background: brands[id].palette['500'] }}
                  />
                  {t(`brands.${id}`)}
                </span>
              }
              orientation="inline"
            >
              <Radio value={id} />
            </Field>
          ))}
        </RadioGroup>
      </Field>

      <div aria-label={t('preview')} className={styles.preview} role="group">
        <Button colorScheme="primary">{t('primaryAction')}</Button>
        <Button colorScheme="primary" variant="outline">
          {t('outline')}
        </Button>
        <Badge colorScheme="primary">{t('badge')}</Badge>
        <ProgressBar aria-label={t('previewProgress')} colorScheme="primary" value={64} />
      </div>
    </div>
  )
}
