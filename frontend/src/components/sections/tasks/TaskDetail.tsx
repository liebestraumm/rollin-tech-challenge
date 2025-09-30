import { useState } from 'react'
import Loader from '../../ui/Loader'
import Modal from '../../Modal'
import AppButton from '../../ui/AppButton'
import useFetchData from '../../../hooks/useFetchData'
import { type Task } from '../../../interfaces/TaskInterface'

interface TaskDetailProps {
  taskId: number | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (taskId: number) => void
  onDelete?: (taskId: number) => void
  refreshKey?: number
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, isOpen, onClose, onUpdate, onDelete, refreshKey }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const url = taskId ? `http://localhost:8000/api/v1/tasks/${taskId}` : ''
  const { data: task, loading, error } = useFetchData<Task>(url, refreshKey)

  const handleClose = (): void => {
    setShowDeleteConfirm(false)
    onClose()
  }

  const handleDeleteClick = (): void => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = (): void => {
    if (task && onDelete) {
      onDelete(task.id)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteCancel = (): void => {
    setShowDeleteConfirm(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeButton={true}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {task && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                task.complete 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300'
              }`}>
                {task.complete && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <h3 className={`text-lg font-semibold ${
                task.complete ? 'text-green-800 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
            </div>

            {task.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className={`text-sm p-3 rounded-md border ${
                  task.complete 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-gray-600 bg-gray-50 border-gray-200'
                }`}>
                  {task.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {task.complete && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    Complete
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <p className="text-sm text-gray-600">#{task.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(task.created).toLocaleString()}
                </p>
              </div>

              {task.due && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(task.due).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && !task && (
          <div className="text-center py-8">
            <p className="text-gray-600">No task data available</p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <div>
            {task && onDelete && (
              <AppButton
                onClick={handleDeleteClick}
                twStyle="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Delete Task
              </AppButton>
            )}
          </div>
          <div className="flex gap-3">
            {task && onUpdate && (
              <AppButton
                onClick={() => onUpdate(task.id)}
                twStyle="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Update Task
              </AppButton>
            )}
            <AppButton
              onClick={handleClose}
              twStyle="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Close
            </AppButton>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <AppButton
                  onClick={handleDeleteCancel}
                  twStyle="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Cancel
                </AppButton>
                <AppButton
                  onClick={handleDeleteConfirm}
                  twStyle="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Delete
                </AppButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default TaskDetail
