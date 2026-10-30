---
'plume-ui-react': minor
---

Button, Input, Textarea, NumberInput, Checkbox, Toggle and Radio follow the parts contract.

- `Button` renders its icons, text and spinner as the parts `ButtonIcon`, `ButtonLabel` and `ButtonSpinner` (`data-plume-button-*`). Children that hold one of them replace the default composition. The root has `data-plume-button`, `data-busy` and `data-disabled`, no longer lets `index` reach the `<button>`, and exports `ButtonVariant` and `ButtonOwnProps`. With `variant="unstyled"` the Button and its parts drop every Plume class, including the disabled one; the hidden label while `busy` keeps working through `[data-hidden]`.
- `InputReveal` is a single `<button>` (the extra wrapper `<span>` is gone), so `className` and `style` of the part and its position inside the control are the button's own. Its class is `reveal` instead of `revealButton`, and it carries `data-revealed`. `InputField` no longer applies the base reset or the disabled class when unstyled, and `InputProps` no longer accepts `index`.
- `Textarea` no longer applies the disabled class when unstyled and exports `TextareaOwnProps`, `TextareaVariant` and `TextareaResize`.
- `NumberInput` renders its hidden form input as the `NumberInputHidden` part (`data-plume-numberinput-hidden`, with its own `name`, `form` and `ref`). The component still adds it when it has a `name`, unless its children already hold one. It also exports `NumberInputOwnProps`.
- `RadioGroup` drops its layout classes with `variant="unstyled"`, joins its classes with `joinClasses`, and carries `data-plume-radiogroup`, `data-orientation`, `data-disabled`, `data-invalid` and `data-readonly`. `RadioOwnProps`, `RadioGroupOrientation` and `RadioGroupOwnProps` are exported.
- `Checkbox`, `Toggle` and `Radio` carry `data-plume-checkbox`, `data-plume-toggle` and `data-plume-radio` and expose `data-disabled`, `data-invalid` and `data-readonly` (and `data-indeterminate` on the Checkbox). `CheckboxOwnProps`, `ToggleOwnProps` and `ToggleVariant` are exported.
- The contexts of Input, Textarea and NumberInput keep their value while the props do not change, so parts no longer re-render on every render of the root.
- The `filled` hover of `Input` and `Textarea` mixes the foreground with the surface through `--plume-overlay-hover` instead of black, so it also shows in dark mode.
