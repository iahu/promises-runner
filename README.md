# promises-runner

example code of concurrently run promises tasks by groups.

example:

```ts
const createTask = (value: number) => () =>
  new Promise((resolve) => setTimeout(() => resolve(value), 1000))
```

shift task mode:

```ts
const tasks = [1, 2, 3, 4, 5].map(createTob)

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

group order mode:

```ts
const tasks = [1, 2, 3, 4, 5].map(createTask)

// order to run:
promisesThrottle(tasks, 3, console.log)

// output:
// [ 1, 2, 3 ] 0
// [ 4, 5 ] 3
```
