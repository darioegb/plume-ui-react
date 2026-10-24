'use client'

import type { ElementType, ForwardedRef, HTMLAttributes, MouseEvent, ReactNode } from 'react'
import { forwardRef, useId, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import { ChipContext, type ChipLabels } from './chip-context'
import { ChipIcon } from './chip-icon'
import { ChipLabel } from './chip-label'
import { ChipRemove } from './chip-remove'
import styles from './chip.module.css'

export type { ChipLabels } from './chip-context'

export type ChipVariant = 'solid' | 'outline' | 'subtle' | 'unstyled'

export interface ChipOwnProps {
  colorScheme?: ColorScheme
  disabled?: boolean
  icon?: ReactNode
  labels?: Partial<ChipLabels>
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  shape?: Shape
  size?: Size
  variant?: ChipVariant
}

type ChipRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type ChipProps = Omit<ComponentProps, 'index'> & ChipRootAttributes & ChipOwnProps

const DEFAULT_LABELS: ChipLabels = { remove: 'Remove' }

const CHIP_PARTS: readonly ElementType[] = [ChipIcon, ChipLabel, ChipRemove]

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      children,
      className = '',
      colorScheme = 'secondary',
      disabled = false,
      icon,
      labels,
      onRemove,
      shape = 'pill',
      size = 'md',
      style,
      variant = 'subtle',
      ...rest
    }: ChipProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const text = useLabels('chip', DEFAULT_LABELS, labels)
    const isStyled = variant !== 'unstyled'
    const labelId = useId()
    const removeId = useId()
    const customRemoveLabel = Boolean(labels?.remove)
    const context = useMemo(
      () => ({
        customRemoveLabel,
        disabled,
        isStyled,
        labelId,
        labels: text,
        onRemove,
        removeId,
      }),
      [customRemoveLabel, disabled, isStyled, labelId, onRemove, removeId, text],
    )
    const classes = joinClasses(
      isStyled && styles.chip,
      isStyled && tag[size],
      isStyled && tag[shape],
      isStyled && tag[variant],
      isStyled && disabled && styles.disabled,
      className,
    )

    return (
      <ChipContext.Provider value={context}>
        <span
          className={classes}
          data-plume-chip=""
          ref={ref}
          style={tagColorVars('chip', colorScheme, style)}
          {...rest}
        >
          {hasPart(children, CHIP_PARTS) ? (
            children
          ) : (
            <>
              {icon ? <ChipIcon>{icon}</ChipIcon> : null}
              <ChipLabel>{children}</ChipLabel>
              {onRemove ? <ChipRemove /> : null}
            </>
          )}
        </span>
      </ChipContext.Provider>
    )
  },
)

Chip.displayName = 'Chip'
