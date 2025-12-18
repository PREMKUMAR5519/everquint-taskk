import TaskCard from './TaskCard'
import './Column.scss'

function Column({ title, tasks, onEdit, onStatusChange }) {
  return (
   <>
   {tasks?.length>0 &&(
     <section className="column">
      <header className="column__header">
        <h3>{title}</h3>
        {/* <span className="column__count">{tasks.length}</span> */}
      </header>
      <div className="column__list">
        {tasks.length === 0 && <p className="column__empty">No tasks here yet.</p>}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onStatusChange={onStatusChange} />
        ))}
      </div>
    </section>
   )}
   </>
  )
}

export default Column
