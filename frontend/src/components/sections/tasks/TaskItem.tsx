import { useState } from 'react'
import AppButton from '../../ui/AppButton'
import { type Task } from '../../../interfaces/TaskInterface'

interface TaskItemProps {
  task: Task
  onTaskSelect?: (taskId: number) => void
  onDelete?: (taskId: number) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskSelect, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)

  const handleDeleteClick = (): void => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = (): void => {
    if (onDelete) {
      onDelete(task.id)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteCancel = (): void => {
    setShowDeleteConfirm(false)
  }
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        task.complete 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onTaskSelect?.(task.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              task.complete 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300'
            }`}>
              {task.complete && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <h3 className={`font-semibold ${
              task.complete ? 'text-green-800 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-2 ${
              task.complete ? 'text-green-700' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex gap-4 text-xs text-gray-500">
            <span>ID: {task.id}</span>
            <span>Created: {new Date(task.created).toLocaleDateString()}</span>
            {task.due && (
              <span>Due: {new Date(task.due).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {task.complete && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Complete
            </span>
          )}
          <div className="flex gap-2">
            <AppButton
              onClick={() => {
                onTaskSelect?.(task.id)
              }}
              twStyle="text-blue-600 hover:text-white text-sm font-medium bg-transparent p-0 border-0 shadow-none p-2"
            >
              View Details
            </AppButton>
            {onDelete && (
              <AppButton
                onClick={handleDeleteClick}
                twStyle="text-red-600 hover:text-white text-sm font-medium bg-transparent p-0 border-0 shadow-none p-2"
              >
                Delete
              </AppButton>
            )}
          </div>
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
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
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
  )
}

export default TaskItem
