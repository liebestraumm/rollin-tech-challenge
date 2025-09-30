import Loader from '../../ui/Loader'
import Modal from '../../Modal'
import AppButton from '../../ui/AppButton'
import TaskItem from './TaskItem'
import useFetchData from '../../../hooks/useFetchData'
import { type Task } from '../../../interfaces/TaskInterface'

interface TaskListProps {
  onTaskSelect?: (taskId: number) => void
  onDelete?: (taskId: number) => void
  refreshKey?: number
}

const TaskList: React.FC<TaskListProps> = ({ onTaskSelect, onDelete, refreshKey }) => {
  const { data: tasks, loading, error, refetch } = useFetchData<Task[]>('http://localhost:8000/api/v1/tasks', refreshKey)

  const handleRefresh = (): void => {
    refetch()
  }

  if (loading) {
    return (
      <Modal isOpen={true} twStyle="bg-black/80">
        <Loader />
      </Modal>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Tasks</h2>
        <AppButton
          onClick={handleRefresh}
          twStyle="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Refresh
        </AppButton>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {(!tasks || tasks.length === 0) && !error ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-600">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskSelect={onTaskSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        Total: {tasks?.length || 0} task{(tasks?.length || 0) !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export default TaskList
