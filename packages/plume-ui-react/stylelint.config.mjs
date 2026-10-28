const rem = String.raw`(?<![\w.-])\d*\.?\d+rem\b`
const fontLength = String.raw`(?<![\w.-])\d*\.?\d+(rem|px)\b`

export default {
  rules: {
    'media-feature-name-disallowed-list': [/width/],
    'declaration-property-value-disallowed-list': {
      '/^(padding|margin|gap|row-gap|column-gap|padding-.+|margin-.+)$/': [new RegExp(rem)],
      'font-size': [
        new RegExp(`^${fontLength}$`),
        /^(xx-small|x-small|small|medium|large|x-large|xx-large)$/,
      ],
      'z-index': [/^\d{2,}$/],
      '/^(transition|transition-duration|transition-delay|animation|animation-duration)$/': [
        /(?<![\w.])0?\.\d+m?s\b/,
      ],
    },
  },
}
