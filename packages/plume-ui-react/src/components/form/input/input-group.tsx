import type { CSSProperties, ReactNode } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { afterElementClass } from './input-reveal'
import styles from './input.module.css'

interface InputGroupProps {
  addonAfter?: ReactNode
  addonBefore?: ReactNode
  canReveal: boolean
  className?: string
  children: ReactNode
  elementAfter?: ReactNode
  elementBefore?: ReactNode
  isStyled: boolean
  reveal: ReactNode
  style: CSSProperties
}

const slot = (isStyled: boolean, ...classes: string[]): string | undefined =>
  isStyled ? classes.join(' ') : undefined

export function InputGroup({
  addonAfter,
  addonBefore,
  canReveal,
  children,
  className,
  elementAfter,
  elementBefore,
  isStyled,
  reveal,
  style,
}: Readonly<InputGroupProps>): ReactNode {
  return (
    <div
      className={joinClasses(isStyled && styles.inputGroup, className)}
      data-plume-input-group=""
      style={style}
    >
      {addonBefore ? (
        <span className={slot(isStyled, styles.addOn, styles.addOnBefore)}>{addonBefore}</span>
      ) : null}
      <div className={slot(isStyled, styles.control)} data-plume-input-control="">
        {elementBefore ? (
          <span className={slot(isStyled, styles.element, styles.elementBefore)}>
            {elementBefore}
          </span>
        ) : null}
        {children}
        {elementAfter ? (
          <span className={afterElementClass(isStyled, canReveal)}>{elementAfter}</span>
        ) : null}
        {reveal}
      </div>
      {addonAfter ? (
        <span className={slot(isStyled, styles.addOn, styles.addOnAfter)}>{addonAfter}</span>
      ) : null}
    </div>
  )
}
