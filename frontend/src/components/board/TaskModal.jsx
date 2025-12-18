import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import TextInput from '../ui/TextInput'
import TextArea from '../ui/TextArea'
import Select from '../ui/Select'
import './TaskModal.scss'

const statusOptions = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
]

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

function TaskModal({ isOpen, onClose, onSave, initialTask }) {
  const titleRef = useRef(null)
  const [form, setForm] = useState(getInitialState(initialTask))
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(getInitialState(initialTask))
    setErrors({})
  }, [initialTask, isOpen])

  const isDirty = useMemo(() => {
    if (!initialTask) {
      return form.title || form.description || form.assignee || form.tags
    }
    return (
      form.title !== initialTask.title ||
      form.description !== initialTask.description ||
      form.status !== initialTask.status ||
      form.priority !== initialTask.priority ||
      form.assignee !== (initialTask.assignee || '') ||
      form.tags !== (initialTask.tags?.join(', ') || '')
    )
  }, [form, initialTask])

  const handleClose = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) {
      return
    }
    onClose()
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) {
      nextErrors.title = 'Title is required'
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    const payload = {
      ...initialTask,
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      assignee: form.assignee.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }
    onSave(payload)
  }

  return (
    <Modal title={initialTask ? 'Edit task' : 'Create task'} isOpen={isOpen} onClose={handleClose} initialFocusRef={titleRef}>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-form__grid">
          <TextInput ref={titleRef} label="Title" name="title" value={form.title} onChange={handleChange} error={errors.title} required />
          <Select label="Status" name="status" value={form.status} onChange={handleChange} options={statusOptions} />
          <Select label="Priority" name="priority" value={form.priority} onChange={handleChange} options={priorityOptions} />
          <TextInput label="Assignee" name="assignee" value={form.assignee} onChange={handleChange} placeholder="Who owns this?" />
        </div>
        <TextArea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What needs to be done?"
        />
        <TextInput label="Tags" name="tags" value={form.tags} onChange={handleChange} helper="Comma separated" placeholder="design, api" />
        <div className="task-form__actions">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">{initialTask ? 'Save changes' : 'Create task'}</Button>
        </div>
      </form>
    </Modal>
  )
}

function getInitialState(task) {
  if (!task) {
    return { title: '', description: '', status: 'Backlog', priority: 'Medium', assignee: '', tags: '' }
  }
  return {
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'Backlog',
    priority: task.priority || 'Medium',
    assignee: task.assignee || '',
    tags: task.tags?.join(', ') || '',
  }
}

export default TaskModal
