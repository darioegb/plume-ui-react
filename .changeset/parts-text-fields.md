---
'plume-ui-react': minor
---

`Input`, `Textarea`, `NumberInput` and `PinInput` are made of exported parts (`InputField`, `InputReveal`, `InputAddon`, `InputElement`, `InputControl`, `InputGroup`, `TextareaField`, `TextareaCount`, `TextareaStatus`, `NumberInputField`, `NumberInputDecrement`, `NumberInputIncrement`, `PinInputCell`, `PinInputHidden`), each with its own `className`, `style` and `ref`, and `classNames` is removed from them. Without children the components render the same default composition as before. The `ref` of the root is always the native field. See "Upgrading to 1.0".
