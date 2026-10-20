---
'plume-ui-react': minor
---

Adds `Modal` (with `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter` and `ModalClose`): a dialog built with no dependencies. The focus moves into it, stays inside while the user tabs and goes back to the trigger on close, the page behind doesn't scroll, and `Esc` and a click on the backdrop close it, only on the one on top when they are nested. It can be controlled with `open` and `onOpenChange`, is named by its header or an `aria-label`, and its body takes the focus when it scrolls so a keyboard user can reach it.

Adds `Popover` (with `PopoverTrigger`, `PopoverContent` and `PopoverClose`): a panel that opens next to its trigger, with `placement`, `offset`, `flip` and `shift`, and `elevated`, `outline` and `unstyled` variants. It is a non-modal dialog: the focus moves into it and goes back to the trigger, `Esc` and a click outside close it, and the page behind keeps scrolling.

Adds `Tooltip`: `<Tooltip content="Save"><Button /></Tooltip>`. It opens when the pointer rests on the element or when it takes the focus with the keyboard, describes the element with `aria-describedby` while it is open, never takes the focus, and closes with `Esc`, on blur or when the pointer leaves. The pointer can move onto the tooltip without it closing. It has `placement`, `offset`, `openDelay` and `closeDelay`, and `solid`, `outline` and `unstyled` variants.
