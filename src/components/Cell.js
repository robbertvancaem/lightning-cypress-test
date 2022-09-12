import { Lightning } from '@lightningjs/sdk'

const SIZE = 60

export default class Cell extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        w: w => w,
        h: h => h,
        rect: true,
        color: 0xffffffff,
      },
    }
  }

  _focus() {
    this.alpha = 0.25
  }

  _unfocus() {
    this.alpha = 1
  }

  static get width() {
    return SIZE
  }
  static get height() {
    return SIZE
  }
}
