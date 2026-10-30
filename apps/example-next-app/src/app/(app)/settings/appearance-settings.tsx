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

const brandIds = Object.keys(brands) as BrandId[]

export function AppearanceSettings(): ReactNode {
  const t = useTranslations('settings.appearance')
  const { setColorMode } = useTheme()
  const { brand, colorModeSetting, setBrand, setColorModeSetting } = usePreferences()
  const [, startTransition] = useTransition()

  return (
    <div className="flex max-w-xl flex-col gap-5 py-2">
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
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block size-3.5 rounded-full"
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

      <div
        aria-label={t('preview')}
        className="flex flex-wrap items-center gap-3 rounded-2 border border-border p-4"
        role="group"
      >
        <Button colorScheme="primary">{t('primaryAction')}</Button>
        <Button colorScheme="primary" variant="outline">
          {t('outline')}
        </Button>
        <Badge colorScheme="primary">{t('badge')}</Badge>
        <ProgressBar
          aria-label={t('previewProgress')}
          className="flex-[1_1_10rem]"
          colorScheme="primary"
          value={64}
        />
      </div>
    </div>
  )
}
