---
'plume-ui-react': minor
---

`Alert`, `Chip`, `Avatar` (with `AvatarGroup`), `EmptyState`, `Divider` and `Skeleton` are made of exported parts (`AlertIcon`, `AlertContent`, `AlertAction`, `AlertDismiss`, `ChipIcon`, `ChipLabel`, `ChipRemove`, `AvatarImage`, `AvatarFallback`, `AvatarStatusDot`, `AvatarOverflow`, `EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateAction`, `DividerLabel`, `SkeletonLine`), each with its own `className`, `style` and `ref`, and `classNames` is removed from them. Without parts they render the same default composition as before. `EmptyState`, `Divider` and `Skeleton` stay Server Component safe. See "Upgrading to 1.0".
