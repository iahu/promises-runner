type Task<T> = () => Promise<T>

const promisesThrottle = async <T>(
  Tasks: Task<T>[],
  groupCount: number,
  onGroupDone?: (results: T[], index: number) => void
): Promise<T[]> => {
  if (!(Tasks && Array.isArray(Tasks))) {
    return Promise.reject('Tasks must be Array')
  }

  let result = [] as T[]
  for (let i = 0; i < Tasks.length; i += groupCount) {
    const groupTasks = Tasks.slice(i, i + groupCount)
    result = await Promise.all(groupTasks.map((j) => j()))
    onGroupDone?.(result, i)
  }

  return result
}

export default promisesThrottle
