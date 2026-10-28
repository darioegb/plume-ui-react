# Plume UI React

A lightweight design system for React. Components ship their own scoped styles and are themed entirely through CSS variables, so they adapt to your brand and switch between light and dark without runtime color math.

- **Themeable**: every design token is a CSS variable emitted by `<ThemeProvider>`.
- **Light & dark**: built in, driven by a single `colorMode`.
- **Framework-agnostic**: use the components as they are, or set `variant="unstyled"` and style them with Tailwind or Bootstrap.
- **Typed**: written in TypeScript, with React 18 and 19 support.

## Installation

```sh
npm install plume-ui-react
# or
pnpm add plume-ui-react
# or
yarn add plume-ui-react
```

It includes every component, the theme (`ThemeProvider`, `useTheme`, tokens and types), the hooks and the utilities. `react` and `react-dom` (>= 18) are peer dependencies.

## Usage

Import the stylesheet once and wrap your app in `<ThemeProvider>`:

```tsx
import 'plume-ui-react/styles.css'
import { Button, ThemeProvider } from 'plume-ui-react'

export function App() {
  return (
    <ThemeProvider defaultColorMode="light">
      <Button colorScheme="primary" label="Click me" />
    </ThemeProvider>
  )
}
```

## Components

`Accordion` (with `AccordionBody`, `AccordionContent`, `AccordionHeading`, `AccordionIcon`, `AccordionItem`, `AccordionTitle` and `AccordionTrigger`), `Alert` (with `AlertAction`, `AlertContent`, `AlertDescription`, `AlertDismiss`, `AlertIcon` and `AlertTitle`), `Avatar` (with `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarOverflow` and `AvatarStatusDot`), `Badge`, `Breadcrumb` (with `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList` and `BreadcrumbSeparator`), `Button`, `Card` (with `CardHeader`, `CardBody` and `CardFooter`), `Carousel` (with `CarouselDot`, `CarouselDots`, `CarouselNext`, `CarouselPlayPause`, `CarouselPrev`, `CarouselSlide` and `CarouselSlides`), `Checkbox`, `Chip` (with `ChipIcon`, `ChipLabel` and `ChipRemove`), `Collapse` (with `CollapseBody` and `CollapseClip`), `DatePicker` (with `DatePickerApply`, `DatePickerCalendar`, `DatePickerCancel`, `DatePickerDay`, `DatePickerField`, `DatePickerFooter`, `DatePickerGrid`, `DatePickerHeader`, `DatePickerInput`, `DatePickerMonthButton`, `DatePickerMonthOption`, `DatePickerMonths`, `DatePickerNav`, `DatePickerNext`, `DatePickerPage`, `DatePickerPages`, `DatePickerPrevious`, `DatePickerSeparator`, `DatePickerTrigger`, `DatePickerView`, `DatePickerWeekday`, `DatePickerWeekdays`, `DatePickerYearButton`, `DatePickerYearOption` and `DatePickerYears`), `Divider` (with `DividerLabel`), `Drawer` (with `DrawerBackdrop`, `DrawerBody`, `DrawerClose`, `DrawerContent`, `DrawerFooter`, `DrawerHeader` and `DrawerTrigger`), `Dropdown` (with `DropdownItem`, `DropdownItemIcon`, `DropdownItemLabel`, `DropdownItemShortcut`, `DropdownLabel`, `DropdownMenu`, `DropdownSeparator` and `DropdownTrigger`), `EmptyState` (with `EmptyStateAction`, `EmptyStateDescription`, `EmptyStateIcon` and `EmptyStateTitle`), `Field`, `FileUpload` (with `FileUploadDropzone`, `FileUploadError`, `FileUploadErrors`, `FileUploadIcon`, `FileUploadInput`, `FileUploadItem`, `FileUploadList`, `FileUploadName`, `FileUploadProgress`, `FileUploadPrompt`, `FileUploadRemove` and `FileUploadSize`), `Icon`, `Input` (with `InputAddon`, `InputControl`, `InputElement`, `InputField`, `InputGroup` and `InputReveal`), `List` (with `ListDivider`, `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText` and `ListSubheader`), `Modal` (with `ModalBackdrop`, `ModalBody`, `ModalClose`, `ModalContent`, `ModalFooter`, `ModalHeader` and `ModalTrigger`), `Navbar` (with `NavbarBrand`, `NavbarContent`, `NavbarItem` and `NavbarToggle`), `NumberInput` (with `NumberInputDecrement`, `NumberInputField` and `NumberInputIncrement`), `Paginator` (with `PaginatorEllipsis`, `PaginatorFirst`, `PaginatorItem`, `PaginatorLast`, `PaginatorList`, `PaginatorNext`, `PaginatorPage`, `PaginatorPages` and `PaginatorPrevious`), `PinInput` (with `PinInputCell` and `PinInputHidden`), `Popover` (with `PopoverClose`, `PopoverContent` and `PopoverTrigger`), `ProgressBar` (with `ProgressBarIndicator`, `ProgressBarTrack` and `ProgressBarValue`), `Radio`, `RadioGroup`, `Rating` (with `RatingEmpty`, `RatingFilled`, `RatingItem`, `RatingRadio` and `RatingValueText`), `Select` (with `SelectChevron`, `SelectChip`, `SelectChips`, `SelectClear`, `SelectCombobox`, `SelectContent`, `SelectEmpty`, `SelectField`, `SelectGroup`, `SelectGroupLabel`, `SelectHidden`, `SelectList`, `SelectOption`, `SelectOptionBody`, `SelectOptionCheck`, `SelectOptionDescription`, `SelectOptionIcon`, `SelectOptionText`, `SelectPlaceholder`, `SelectSearch`, `SelectSearchInput`, `SelectTrigger`, `SelectValue`, `SelectValueIcon`, `SelectValueOption` and `SelectValueText`), `Sidebar` (with `SidebarBackdrop`, `SidebarContent`, `SidebarItem`, `SidebarItemIcon`, `SidebarItemLabel`, `SidebarProvider` and `SidebarToggle`), `Skeleton` (with `SkeletonLine`), `Slider` (with `SliderBody`, `SliderMarkItem`, `SliderMarkLabel`, `SliderMarks`, `SliderRange`, `SliderThumb` and `SliderTrack`), `Spinner`, `Stepper` (with `Step`, `StepDescription`, `StepIndicator`, `StepIndicatorContent`, `StepIndicatorLabel`, `StepSeparator` and `StepTitle`), `Table` (with `TableBody`, `TableCaption`, `TableCell`, `TableElement`, `TableEmpty`, `TableEmptyCell`, `TableFooter`, `TableHead`, `TableHeadSort`, `TableHeadSortIcon`, `TableHeader`, `TableLoading`, `TableRow` and `useTableState`), `Tabs` (with `TabList`, `Tab`, `TabPanels` and `TabPanel`), `Textarea` (with `TextareaCount`, `TextareaField` and `TextareaStatus`), `TimePicker` (with `TimePickerHours`, `TimePickerInput`, `TimePickerMinutes`, `TimePickerOption`, `TimePickerPanel`, `TimePickerPeriod` and `TimePickerTrigger`), `ToastProvider` (with `Toast`, `ToastActionButton`, `ToastBody`, `ToastDescription`, `ToastDismiss`, `ToastIcon`, `ToastTitle` and the `useToast` hook), `Toggle`, `Tooltip` and `Tree` (with `TreeItem`, `TreeItemCheckbox`, `TreeItemChevron`, `TreeItemGroup`, `TreeItemIcon` and `TreeItemLabel`).

The [documentation site](https://darioegb.github.io/plume-ui-react/) has a live playground, props and examples for each one, plus the color palette, design tokens and framework integration guides.

## Links

- [Documentation](https://darioegb.github.io/plume-ui-react/)
- [GitHub repository](https://github.com/darioegb/plume-ui-react)
- [Changelog](https://github.com/darioegb/plume-ui-react/blob/main/packages/plume-ui-react/CHANGELOG.md)
- [Report an issue](https://github.com/darioegb/plume-ui-react/issues)

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
