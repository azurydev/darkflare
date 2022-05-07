import build from '../modules/build'
import chokidar from 'chokidar'

export default async (directory: string, { watch, logging }: {
  watch: boolean,
  logging: boolean
}) => {
  await build(directory, logging)

  if (watch) {
    const watcher = chokidar.watch(directory, {
      persistent: true
    })
  
    watcher.on('all', async () => await build(directory, true))
  }
}
