/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import fs from 'fs'

class NodeStorage {
  walletsUrl: string

  constructor() {
    this.walletsUrl = process.env.HOME + '/.alephium-wallet-apps'

    if (!fs.existsSync(this.walletsUrl)) {
      fs.mkdirSync(this.walletsUrl)
    }
  }

  remove = (name: string) => {
    fs.unlinkSync(this.walletsUrl + '/' + name + '.dat')
  }

  load = (name: string) => {
    let buffer
    try {
      buffer = fs.readFileSync(this.walletsUrl + '/' + name + '.dat')
    } catch (error) {
      throw new Error(`Unable to load wallet ${name}: ${error}`)
    }
    return JSON.parse(buffer.toString())
  }

  save = (name: string, json: unknown) => {
    const str = JSON.stringify(json)
    const data = new Uint8Array(Buffer.from(str))
    fs.writeFileSync(this.walletsUrl.toString() + '/' + name + '.dat', data)
  }

  list = () => {
    const xs: string[] = []
    try {
      const files = fs.readdirSync(this.walletsUrl)
      files.forEach(function (file) {
        if (file.endsWith('.dat')) {
          xs.push(file.substring(0, file.length - 4))
        }
      })
    } catch (e) {
      return []
    }

    return xs
  }
}

export default NodeStorage
