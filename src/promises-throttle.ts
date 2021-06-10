type Job<T> = () => Promise<T>

const promisesThrottle = async <T>(
  jobs: Job<T>[],
  parallelCount: number,
  onParallelDone?: (results: T[], index: number) => void
): Promise<T[]> => {
  if (!(jobs && Array.isArray(jobs))) {
    return Promise.reject('jobs must be Array')
  }

  let result = [] as T[]
  for (let i = 0; i < jobs.length; i += parallelCount) {
    const parallelJobs = jobs.slice(i, i + parallelCount)
    result = await Promise.all(parallelJobs.map((j) => j()))
    onParallelDone?.(result, i)
  }

  return result
}

export default promisesThrottle
