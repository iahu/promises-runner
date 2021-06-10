# promises-runner

example code of order run promises jobs by groups. jobs in group may parallel run.

example:

```ts
const createJob = (value: number) => () =>
  new Promise((resolve) => setTimeout(() => resolve(value), 1000))
```

shift job way:

```ts
const jobs = [1, 2, 3, 4, 5].map(createJob)

console.time('prohub')
// shfit jobs to run
const proHub = new ProHub(jobs, 3)
proHub.push(createJob(6))
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

group order way:

```ts
const jobs = [1, 2, 3, 4, 5].map(createJob)

// order to run:
promisesThrottle(jobs, 3, console.log)

// output:
// [ 1, 2, 3 ] 0
// [ 4, 5 ] 3
```
