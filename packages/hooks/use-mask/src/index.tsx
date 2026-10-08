import { useState } from 'react'

export interface MaskProps {
  initialValue: string
  mask: string
}

type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void

export function useMask(
  { initialValue, mask }: MaskProps,
  onChange: ChangeHandler | undefined = undefined,
): [string, ChangeHandler] {
  const [value, setValue] = useState<string>(initialValue)

  const applyMask = (text: string): string => {
    let maskedValue = ''
    let maskIndex = 0

    // Iterar sobre el texto y aplicar la máscara
    for (let i = 0; i < text.length && maskIndex < mask.length; i++) {
      const currentMaskChar = mask[maskIndex]

      if (currentMaskChar === '#') {
        // Si el carácter de la máscara es '#', acepta cualquier carácter
        maskedValue += text[i]
        maskIndex++
      } else if (currentMaskChar === '-' && mask[maskIndex + 1] === '#') {
        // Si el carácter actual es '-' y el siguiente es '#', acepta cualquier carácter pero no avances en la máscara
        maskedValue += text[i]
      } else {
        // De lo contrario, solo acepta el carácter si coincide con el de la máscara
        if (text[i] === currentMaskChar) {
          maskedValue += text[i]
        } else {
          // Si no coincide, continúa con el siguiente carácter de la máscara
          i--
        }
        maskIndex++
      }
    }

    return maskedValue
  }

  const handleChange: ChangeHandler = (event) => {
    const maskedValue = applyMask(event.target.value)
    setValue(maskedValue)

    // Si se proporciona un handler personalizado, ejecútalo después de aplicar la máscara
    if (onChange) {
      onChange(event)
    }
  }

  return [value, handleChange]
}
