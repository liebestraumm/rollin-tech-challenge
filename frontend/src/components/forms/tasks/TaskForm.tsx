import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from '../../Modal'
import AppButton from '../../ui/AppButton'
import { createTaskSchema, type CreateTaskInput } from '../../../validators/taskValidator'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: CreateTaskInput) => Promise<void>
  initialData?: Partial<CreateTaskInput>
  mode: 'create' | 'update'
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  mode 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      complete: initialData?.complete || false,
      due: initialData?.due 
        ? (initialData.due instanceof Date 
            ? initialData.due.toISOString().slice(0, 16)
            : new Date(initialData.due).toISOString().slice(0, 16))
        : undefined
    }
  })

  // Reset form when initialData changes (for update mode)
  useEffect(() => {
    if (initialData) {
      // Format the date for datetime-local input (YYYY-MM-DDTHH:MM)
      const formattedDue = initialData.due 
        ? (initialData.due instanceof Date 
            ? initialData.due.toISOString().slice(0, 16)
            : new Date(initialData.due).toISOString().slice(0, 16))
        : undefined
      
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        complete: initialData.complete || false,
        due: formattedDue
      })
    }
  }, [initialData, reset])

  const onFormSubmit = async (data: CreateTaskInput): Promise<void> => {
    try {
      await onSubmit(data)
      handleClose()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleClose = (): void => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeButton={true}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Task' : 'Update Task'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task description (optional)"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Complete Status Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="complete"
              {...register('complete')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="complete" className="ml-2 block text-sm font-medium text-gray-700">
              Task is complete
            </label>
          </div>
          {errors.complete && (
            <p className="mt-1 text-sm text-red-600">{errors.complete.message}</p>
          )}

          {/* Due Date Field */}
          <div className="relative">
            <label htmlFor="due" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                id="due"
                {...register('due')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.due ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                onBlur={(e) => {
                  // Ensure the date picker closes when focus is lost
                  e.target.blur()
                }}
                style={{
                  // CSS to influence calendar position
                  position: 'relative',
                  zIndex: 10,
                  // Add transform to potentially influence calendar position
                  transform: 'translateY(0)'
                }}
              />
            </div>
            {errors.due && (
              <p className="mt-1 text-sm text-red-600">{errors.due.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <AppButton
              onClick={handleClose}
              twStyle="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
            >
              Cancel
            </AppButton>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </div>
              ) : (
                mode === 'create' ? 'Create Task' : 'Update Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default TaskForm
