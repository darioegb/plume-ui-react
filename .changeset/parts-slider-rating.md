---
'plume-ui-react': minor
---

`Slider` and `Rating` are made of exported parts (`SliderBody`, `SliderTrack`, `SliderRange`, `SliderMarks`, `SliderMarkItem`, `SliderMarkLabel`, `SliderThumb`, `RatingItem`, `RatingEmpty`, `RatingFilled`, `RatingRadio`, `RatingValueText`), each with its own `className`, `style` and `ref`, and `classNames`, `SliderPart` and `RatingPart` are removed. With this, no component takes `classNames` any more: every element is a part. See "Upgrading to 1.0".
