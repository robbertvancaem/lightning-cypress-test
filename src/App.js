/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Lightning, Utils } from '@lightningjs/sdk'
import { Grid } from '@lightningjs/ui'
import Cell from '@/components/Cell'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
      Grid: {
        x: 560,
        y: 960 / 2,
        mount: 0.5,
        type: Grid,
        autoResize: true,
        columns: 10,
        direction: 'column',
        spacing: 15,
        signals: {
          onIndexChanged: true,
        },
      },
    }
  }

  _handleKey({ key }) {
    if (key !== 's') {
      return
    }
    this.Grid.setIndex(this.Grid.index + 1)
  }

  onIndexChanged({ index }) {
    console.log(index)
  }

  get Grid() {
    return this.tag('Grid')
  }

  _getFocused() {
    return this.Grid
  }

  _init() {
    this._textToggle = true

    this.Grid.items = new Array(50).fill({
      type: Cell,
    })
  }
}
