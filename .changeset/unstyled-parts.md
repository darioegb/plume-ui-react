---
'plume-ui-react': minor
---

Makes `variant="unstyled"` usable in the components whose parts could not take a class. `Checkbox`, `Radio` and `Toggle` take `inputClassName`, for the `<input>`, and `labelClassName`, for the text: until now `className` only reached the label that wraps the input, so Tailwind or Bootstrap could not style the control. `ToastProvider` takes `classNames` to style the `icon`, `content`, `title`, `description`, `action` and `dismiss` of the toasts, and `ModalContent` takes `backdropClassName` for the layer behind the dialog, which an unstyled `Modal` had no way to style. The `Modal` backdrop now keeps its position and its centering when it is unstyled, so it covers the screen without a class of your own.
