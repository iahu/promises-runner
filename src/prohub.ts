import EventEmitter from 'events'

type PromiseTask<T = unknown> = () => Promise<T>

class ProHub<T = unknown> extends EventEmitter {
  private taskCount: number
  private eventTasks = [] as PromiseTask<T>[]
  private hubSize: number
  runningTasks = [] as PromiseTask<T>[]

  constructor(tasks: PromiseTask<T>[], hubSize: number) {
    super()
    this.taskCount = tasks.length
    this.eventTasks = tasks.map(this.TaskMapping)
    this.hubSize = hubSize
  }

  private taskMapping = (task: PromiseTask<T>, index?: number) => {
    return () => {
      const eventTasks = this.eventTasks
      const runningTasks = this.runningTasks
      return task().then((res) => {
        const idx = runningTasks.findIndex(Task)
        const next = eventTasks.shift()
        if (next) {
          runningTasks[idx] = next
        } else {
          runningTasks.splice(idx, 1)
        }
        const data = { value: res, index, next: next?.(), done: !next }
        this.emit('shift', data)
        if (runningTasks.length === 0) {
          this.emit('done', data)
        }
        return res
      })
    }
  }

  async start(): Promise<void> {
    const eventTasks = this.eventTasks
    this.runningTasks = eventTasks.splice(0, this.hubSize)
    const runningTasks = this.runningTasks
    await Promise.all(runningTasks.map((j) => j()))
  }

  push(Task: PromiseTask<T>): number {
    this.taskCount += 1
    return this.eventTasks.push(this.taskMapping(Task, this.TaskCount))
  }

  pop(): PromiseTask<T> | undefined {
    this.taskCount -= 1
    return this.eventTasks.pop()
  }
}

export default ProHub
