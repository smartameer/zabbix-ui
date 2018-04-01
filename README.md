Zabbix UI
---

### Installation

- Run these to start the project
  - `npm install -g gulp bower`
  - `npm install`
  - `bower install`

#### Development

- Copy `env.json.example`, Enter proper url for zabbix API. and save as `env.json` in root folder.
- Run this command - `npm run serve`
- In console it will show the development url to open in browser. (Default: `http://localhost:3000`)

#### Production

- Copy `env.json.example`, Enter proper url for zabbix API. and save as `env.json` in root folder.
- Run this command - `npm run build`
- It will dump all built files in `dist` directory at root folder. Use that in proper server to serve as an angular app.
