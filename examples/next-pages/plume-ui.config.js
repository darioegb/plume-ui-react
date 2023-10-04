import { setUserConfig } from '@plume-ui-react/core'

/** @type {import('@plume-ui-react/core').PlumeUIConfig}  */
const userConfig = {
  colors: {
    primary: 'rgb(0, 0, 255)', // overwrite primaryColor
    pink: 'rgb(228, 35, 235)',
    salmon: 'rgb(250 128 114)',
  },
}

setUserConfig(userConfig)
