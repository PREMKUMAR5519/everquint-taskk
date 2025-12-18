import { useEffect, useMemo, useState } from 'react'
import Column from './components/board/Column'
import TaskModal from './components/board/TaskModal'
import Button from './components/ui/Button'
import Select from './components/ui/Select'
import TextInput from './components/ui/TextInput'
import Toast from './components/ui/Toast'
import { priorityRank } from './utils/format'
import { loadTasks, saveTasks } from './utils/storage'
import './styles/app.scss'

const STATUSES = ['Backlog', 'In Progress', 'Done']

function App() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(() => readFiltersFromQuery())
  const [sortBy, setSortBy] = useState(() => readSortFromQuery())
  const [modalTask, setModalTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try {
      const { tasks: stored, migrated } = loadTasks()
      setTasks(stored)
      if (migrated) {
        setToast('Stored tasks were updated to the latest format.')
      }
    } catch (error) {
      setStorageError(true)
    }
  }, [])

  useEffect(() => {
    syncQuery(filters, sortBy)
  }, [filters, sortBy])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const filteredTasks = useMemo(() => {
    const statusSet = new Set(filters.statuses)
    return tasks
      .filter((task) => statusSet.has(task.status))
      .filter((task) => (filters.priority === 'all' ? true : task.priority === filters.priority))
      .filter((task) => {
        if (!filters.search.trim()) return true
        const text = `${task.title} ${task.description}`.toLowerCase()
        return text.includes(filters.search.trim().toLowerCase())
      })
      .sort((a, b) => sortTasks(a, b, sortBy))
  }, [tasks, filters, sortBy])

  const grouped = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status)
      return acc
    }, {})
  }, [filteredTasks])

  const openCreate = () => {
    setModalTask(null)
    setIsModalOpen(true)
  }

  const openEdit = (task) => {
    setModalTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = (task) => {
    const now = new Date().toISOString()
    let nextTasks = []
    if (task.id) {
      nextTasks = tasks.map((existing) => (existing.id === task.id ? { ...existing, ...task, updatedAt: now } : existing))
    } else {
      nextTasks = [
        ...tasks,
        {
          ...task,
          id: String(Date.now()),
          createdAt: now,
          updatedAt: now,
        },
      ]
    }
    persistTasks(nextTasks)
    setIsModalOpen(false)
    setModalTask(null)
  }

  const handleStatusChange = (id, status) => {
    const now = new Date().toISOString()
    const nextTasks = tasks.map((task) => (task.id === id ? { ...task, status, updatedAt: now } : task))
    persistTasks(nextTasks)
  }

  const persistTasks = (nextTasks) => {
    setTasks(nextTasks)
    try {
      saveTasks(nextTasks)
    } catch (error) {
      setStorageError(true)
    }
  }

  const toggleStatusFilter = (status) => {
    setFilters((prev) => {
      const active = new Set(prev.statuses)
      if (active.has(status)) {
        if (active.size === 1) {
          return prev
        }
        active.delete(status)
      } else {
        active.add(status)
      }
      return { ...prev, statuses: Array.from(active) }
    })
  }

  const handlePriorityFilter = (event) => {
    setFilters((prev) => ({ ...prev, priority: event.target.value }))
  }

  const handleSearch = (event) => {
    setFilters((prev) => ({ ...prev, search: event.target.value }))
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
  }

  const hasTasks = tasks.length > 0
  const hasVisible = filteredTasks.length > 0
  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <div className="brand__title">
            <img src="./logo.png" alt="" />
            <span>Simple, focused board for small squads</span>
          </div>
        </div>
        <Button onClick={openCreate}>New task</Button>
      </header>

      <section className="filters">
        <div className="filter-group">
          <label>Status</label>
          <div className="status-filters">
            {STATUSES.map((status) => (
              <label key={status} className="status-checkbox">
                <input type="checkbox" checked={filters.statuses.includes(status)} onChange={() => toggleStatusFilter(status)} />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <Select
            label="Priority"
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={handlePriorityFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
          />
        </div>
        <div className="filter-group">
          <TextInput label="Search" aria-label="Search tasks" name="search" value={filters.search} onChange={handleSearch} placeholder="Search title or description" />
        </div>
        <div className="filter-group">
          <Select
            label="Sort by"
            aria-label="Sort tasks"
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'updatedAt', label: 'Last updated' },
              { value: 'createdAt', label: 'Created date' },
              { value: 'priority', label: 'Priority' },
            ]}
          />
        </div>
      </section>

      {storageError && <div className="error-state">localStorage is not available. Changes will not be saved.</div>}

      {!hasTasks && <div className="empty-state">No tasks yet. Create your first task to get moving.</div>}
      {hasTasks && !hasVisible && <div className="empty-state">No tasks match these filters. Try adjusting filters.</div>}

      <div className="board-grid">
        {STATUSES.map((status) => (

          <>
          {console.log(grouped)}
            <Column key={status} title={status} tasks={grouped[status] || []} onEdit={openEdit} onStatusChange={handleStatusChange} />
          </>
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        initialTask={modalTask}
        onClose={() => {
          setIsModalOpen(false)
          setModalTask(null)
        }}
        onSave={handleSaveTask}
      />
      <Toast message={toast} tone="info" />
    </div>
  )
}

function sortTasks(a, b, sortBy) {
  if (sortBy === 'priority') {
    return priorityRank(b.priority) - priorityRank(a.priority)
  }
  const aDate = new Date(a[sortBy] || a.updatedAt).getTime()
  const bDate = new Date(b[sortBy] || b.updatedAt).getTime()
  return bDate - aDate
}

function readFiltersFromQuery() {
  const params = new URLSearchParams(window.location.search)
  const statusParam = params.get('status')
  const parsedStatuses = statusParam ? statusParam.split(',').filter(Boolean) : STATUSES
  const statuses = parsedStatuses.length ? parsedStatuses : STATUSES
  const priority = params.get('priority') || 'all'
  const search = params.get('q') || ''
  return { statuses, priority, search }
}

function readSortFromQuery() {
  const params = new URLSearchParams(window.location.search)
  return params.get('sort') || 'updatedAt'
}

function syncQuery(filters, sortBy) {
  const params = new URLSearchParams()
  if (filters.statuses.length && filters.statuses.length < STATUSES.length) {
    params.set('status', filters.statuses.join(','))
  }
  if (filters.priority !== 'all') {
    params.set('priority', filters.priority)
  }
  if (filters.search.trim()) {
    params.set('q', filters.search.trim())
  }
  if (sortBy !== 'updatedAt') {
    params.set('sort', sortBy)
  }
  const query = params.toString()
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`
  window.history.replaceState({}, '', nextUrl)
}

export default App
