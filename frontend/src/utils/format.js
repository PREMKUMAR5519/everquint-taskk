export function formatRelativeTime(dateString) {
  if (!dateString) return 'just now'
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function priorityRank(priority) {
  const ranks = { High: 3, Medium: 2, Low: 1 }
  return ranks[priority] || 0
}
