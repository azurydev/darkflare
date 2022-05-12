import { exec } from 'child_process'
import fse from 'fs-extra'
import { readdir, writeFile } from 'fs/promises'

(async () => {
  const packages = await readdir('./packages')
  , { version } = await fse.readJson('./package.json')
  
  for (let p of packages) {
    exec(`cd packages && cd ${p} && npm run build`)

    if (await fse.pathExists(`./packages/${p}/types`))
      await fse.copy(`./packages/${p}/types`, `./dist/${p}/types`)
    
    if (p !== 'darkflare') {
      const packageJson = await fse.readJson(`./packages/${p}/package.json`)

      packageJson.version = version

      await writeFile(`./packages/${p}/package.json`, JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' })
      await writeFile(`./dist/${p}/package.json`, JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' })
    }
  }
})()
