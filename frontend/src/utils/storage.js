const STORAGE_KEY = 'workflow_tasks'
export const CURRENT_SCHEMA = 1

export function isStorageAvailable() {
  try {
    const testKey = '__workflow_test__'
    window.localStorage.setItem(testKey, 'ok')
    window.localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

export function loadTasks() {
  if (!isStorageAvailable()) {
    throw new Error('localStorage unavailable')
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { tasks: [], migrated: false }
  }

  try {
    const parsed = JSON.parse(raw)
    if (parsed.schemaVersion === CURRENT_SCHEMA) {
      return { tasks: normalizeTasks(parsed.tasks || []), migrated: false }
    }

    const migratedTasks = migrateTasks(parsed)
    saveTasks(migratedTasks)
    return { tasks: migratedTasks, migrated: true }
  } catch (error) {
    console.error('Failed to parse storage', error)
    const fallback = []
    saveTasks(fallback)
    return { tasks: fallback, migrated: true }
  }
}

export function saveTasks(tasks) {
  if (!isStorageAvailable()) {
    throw new Error('localStorage unavailable')
  }
  const payload = { schemaVersion: CURRENT_SCHEMA, tasks: normalizeTasks(tasks) }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function migrateTasks(data) {
  if (Array.isArray(data)) {
    return normalizeTasks(data)
  }
  if (Array.isArray(data?.tasks)) {
    return normalizeTasks(data.tasks)
  }
  return []
}

function normalizeTasks(tasks) {
  return (tasks || []).map((task) => {
    const created = task.createdAt || new Date().toISOString()
    return {
      id: task.id || String(Date.now() + Math.random()),
      title: task.title || 'Untitled task',
      description: task.description || '',
      status: task.status || 'Backlog',
      priority: task.priority || 'Medium',
      assignee: task.assignee || '',
      tags: Array.isArray(task.tags) ? task.tags : [],
      createdAt: created,
      updatedAt: task.updatedAt || created,
    }
  })
}
