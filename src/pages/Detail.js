import { Lightning } from '@lightningjs/sdk'

export default class Detail extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: 0xfffbb03b,
      },
      Text: {
        text: {
          text: '#detail',
        },
      },
    }
  }
}
