# promises-runner

批量（同时而非并行）运行多个 Promise 任务的工具函数，有点像带数量限制的 `Promise.all`

example:

```ts
const createTask =
  <T>(value: T) =>
  (): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(value), 1000))

export default createTask
```

固定数量，动态滑动窗口，窗口内有完成的任务就再补上新任务:

```ts
import createTask from './createTask'
import ProHub from './src/prohub'

const tasks = [1, 2, 3, 4, 5].map(createTask)

console.time('prohub')
// shfit tasks to run
const proHub = new ProHub(tasks, 3)
proHub.push(createTask(6))
proHub.on('shift', (event) => console.log(event))
proHub.on('done', () => console.timeEnd('prohub'))
proHub.start()

// output:
// { value: 1, index: 0, next: Promise { <pending> }, done: false }
// { value: 2, index: 1, next: Promise { <pending> }, done: false }
// { value: 3, index: 2, next: Promise { <pending> }, done: false }
// { value: 4, index: 3, next: undefined, done: true }
// { value: 5, index: 4, next: undefined, done: true }
// { value: 6, index: 6, next: undefined, done: true }
```

切片运行，切片内所有任务完成再执行下一个切片的任务:

```ts
import createTask from './createTask'
import promisesThrottle from './src/promises-throttle'

const tasks = [1, 2, 3, 4, 5].map(createTask)

// order to run:
promisesThrottle(tasks, 3, console.log)

// output:
// [ 1, 2, 3 ] 0
// [ 4, 5 ] 3
```
