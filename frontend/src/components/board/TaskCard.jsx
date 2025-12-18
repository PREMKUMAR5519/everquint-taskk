import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Select from '../ui/Select'
import Tag from '../ui/Tag'
import { formatRelativeTime } from '../../utils/format'
import './TaskCard.scss'

const statusOptions = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
]

const priorityTone = {
  High: 'danger',
  Medium: 'info',
  Low: 'neutral',
}

function TaskCard({ task, onEdit, onStatusChange }) {
  return (
    <Card>
      <div className="task-card">
        <div className="task-card__top">
          <div>
            <p className="task-card__title">{task.title}</p>
            <p className="task-card__assignee">Assigned to {task.assignee || 'Unassigned'}</p>
          </div>
          <Badge tone={priorityTone[task.priority] || 'neutral'}>{task.priority} priority</Badge>
        </div>

        <p className="task-card__desc">{task.description || 'No description provided.'}</p>

        <div className="task-card__meta">
          <div className="task-card__tags">
            {task.tags?.length ? task.tags.map((tag) => <Tag key={tag} label={tag} />) : <span className="muted">No tags</span>}
          </div>
        </div>

        <div className="task-card__footer">

          <button className="task-card__edit" type="button" onClick={() => onEdit(task)}>
            Edit
          </button>
        </div>
        <div className='card-end'>
          <Select
            aria-label={`Change status for ${task.title}`}
            options={statusOptions}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          />
          <span className="muted">Updated {formatRelativeTime(task.updatedAt)}</span>
        </div>

      </div>
    </Card>
  )
}

export default TaskCard
