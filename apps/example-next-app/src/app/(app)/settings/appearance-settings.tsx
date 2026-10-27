'use client'

import type { ReactNode } from 'react'
import { useTransition } from 'react'
import {
  Badge,
  Button,
  Field,
  ProgressBar,
  Radio,
  RadioGroup,
  useTheme,
} from 'plume-ui-react'
import { saveBrand, saveColorMode } from '@/app/actions'
import { useBrand } from '@/app/providers'
import { brands, type BrandId } from '@/theme'
import styles from './settings.module.css'

const brandIds = Object.keys(brands) as BrandId[]

export function AppearanceSettings(): ReactNode {
  const { colorMode, setColorMode } = useTheme()
  const { brand, setBrand } = useBrand()
  const [, startTransition] = useTransition()

  return (
    <div className={styles.section}>
      <Field label="Color mode">
        <RadioGroup
          onValueChange={(value) => {
            setColorMode(value as 'light' | 'dark')
            startTransition(() => saveColorMode(value))
          }}
          orientation="horizontal"
          value={colorMode}
        >
          <Field label="Light" orientation="inline">
            <Radio value="light" />
          </Field>
          <Field label="Dark" orientation="inline">
            <Radio value="dark" />
          </Field>
        </RadioGroup>
      </Field>

      <Field helperText="It colors the whole app. Your choice is remembered." label="Brand color">
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
                  {brands[id].label}
                </span>
              }
              orientation="inline"
            >
              <Radio value={id} />
            </Field>
          ))}
        </RadioGroup>
      </Field>

      <div aria-label="Preview" className={styles.preview} role="group">
        <Button colorScheme="primary">Primary action</Button>
        <Button colorScheme="primary" variant="outline">
          Outline
        </Button>
        <Badge colorScheme="primary">New</Badge>
        <ProgressBar aria-label="Preview progress" colorScheme="primary" value={64} />
      </div>
    </div>
  )
}
