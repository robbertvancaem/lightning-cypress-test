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
      Logo: {
        mountX: 0.5,
        mountY: 1,
        x: 960,
        y: 600,
        src: Utils.asset('images/logo.png'),
      },
      Input: {
        w: 800,
        h: 75,
        x: 560,
        y: 600,
        rect: true,
        color: 0xffffffff,
      },
      Text: {
        x: 560,
        y: 600,
        w: 800,
        h: 75,
        text: {
          textColor: 0xff000000,
          text: '',
        },
      },
    }
  }

  get Text() {
    return this.tag('Text')
  }

  _handleKey({ key }) {
    console.log(key)
    const newText = this.Text.text.text + key

    if (newText.length > 10) {
      throw new Error(`Too much text AGAIN: ${newText}`)
    }

    this.Text.text.text = newText
  }

  _init() {
    this._textToggle = true
    console.log(this.Input)

    this.tag('Background')
      .animation({
        duration: 15,
        repeat: -1,
        actions: [
          {
            t: '',
            p: 'color',
            v: { 0: { v: 0xfffbb03b }, 0.5: { v: 0xfff46730 }, 0.8: { v: 0xfffbb03b } },
          },
        ],
      })
      .start()
  }
}
