import { Lightning, Utils, Router } from '@lightningjs/sdk'
import { Grid } from '@lightningjs/ui'

class Item extends Lightning.Component {
  static _template() {
    return {
      Background: {
        color: 0xfffbb03b,
        rect: true,
        w: w => w,
        h: h => h,
      },
      Number: {
        w: w => w,
        y: 150,
        mountY: 0.5,
        text: {
          textAlign: 'center',
          text: '',
        },
      },
    }
  }
  _init() {
    this.tag('Number').text.text = this.index
  }

  _focus() {
    this.tag('Background').color = 0xfffaa99b
  }

  _unfocus() {
    this.tag('Background').color = 0xfffbb03b
  }

  _handleEnter() {
    Router.navigate('detail', { keepAlive: true })
  }
}

export default class Home extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
      Grid: {
        type: Grid,
        x: 80,
        y: 90,
        w: 1620,
        h: 775,
        columns: 3,
        scrollTransition: { duration: 0.3 },
      },
    }
  }

  _init() {
    this.tag('Background')
      .animation({
        duration: 15,
        repeat: -1,
        actions: [
          {
            t: '',
            p: 'color',
            v: {
              0: { v: 0xfffbb03b },
              0.5: { v: 0xfff46730 },
              0.8: { v: 0xfffbb03b },
            },
          },
        ],
      })
      .start()

    this._update()
  }

  _update() {
    this._fillGrid()

    if (this._prevGridIndex) {
      this.tag('Grid').index = this._prevGridIndex
    }
  }

  _fillGrid() {
    this.tag('Grid').items = new Array(25).fill().map((_, i) => ({
      type: Item,
      w: 530,
      h: 300,
      index: i + 1,
    }))
  }

  historyState(params) {
    if (params) {
      const { index } = params
      this._prevGridIndex = index
      this._update()
    } else {
      return {
        index: this.tag('Grid').index,
      }
    }
  }

  _handleKey({ key }) {
    if (key !== 'Escape') {
      return
    }
    if (this.tag('Grid').hasItems) {
      this.tag('Grid').clear()
      return
    }

    this._fillGrid()
  }

  _getFocused() {
    return this.tag('Grid')
  }
}
