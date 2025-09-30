import { useState } from 'react'
import Main from "../components/layouts/Main"
import Header from "../components/sections/Header"
import TaskSearch from "../components/sections/tasks/TaskSearch"
import TaskList from "../components/sections/tasks/TaskList"
import TaskDetail from "../components/sections/tasks/TaskDetail"
import TaskForm from "../components/forms/tasks/TaskForm"
import AppButton from "../components/ui/AppButton"
import AppToast from "../components/ui/AppToast"
import { type CreateTaskInput } from "../validators/taskValidator"

const TaskManager = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState<boolean>(false)
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false)
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false)
  const [updateTaskData, setUpdateTaskData] = useState<Partial<CreateTaskInput>>({})
  const [refreshKey, setRefreshKey] = useState<number>(0)
  
  // Toast state management
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
    isVisible: boolean
  }>({
    message: '',
    type: 'success',
    isVisible: false
  })

  const handleTaskSelect = (taskId: number): void => {
    setSelectedTaskId(taskId)
    setShowTaskDetail(true)
  }

  const handleSearch = (taskId: number): void => {
    handleTaskSelect(taskId)
  }

  const handleUpdateTask = async (taskId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/tasks/${taskId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const task = await response.json()
      
      setSelectedTaskId(taskId)
      setUpdateTaskData({
        title: task.title,
        description: task.description || '',
        complete: task.complete,
        due: task.due ? new Date(task.due) : undefined
      })
      setShowUpdateForm(true)
    } catch (error) {
      console.error('Error fetching task for update:', error)
      showToast('Failed to load task data for update', 'error')
    }
  }

  const triggerRefresh = (): void => {
    setRefreshKey(prev => prev + 1)
  }

  const showToast = (message: string, type: 'success' | 'error'): void => {
    setToast({
      message,
      type,
      isVisible: true
    })
  }

  const hideToast = (): void => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  const handleCloseTaskDetail = (): void => {
    setShowTaskDetail(false)
    setSelectedTaskId(null)
  }

  const handleCloseCreateForm = (): void => {
    setShowCreateForm(false)
  }

  const handleCloseUpdateForm = (): void => {
    setShowUpdateForm(false)
    setUpdateTaskData({})
  }

  const handleCreateTask = async (taskData: CreateTaskInput): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description || undefined,
          complete: taskData.complete,
          due: taskData.due || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      showToast('Task created successfully!', 'success')
      triggerRefresh()
    } catch (error) {
      console.error('Error creating task:', error)
      showToast('Failed to create task. Please try again.', 'error')
      throw error
    }
  }

  const handleUpdateTaskSubmit = async (taskData: CreateTaskInput): Promise<void> => {
    if (!selectedTaskId) return

    try {
      const response = await fetch(`http://localhost:8000/api/v1/tasks/${selectedTaskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description || undefined,
          complete: taskData.complete,
          due: taskData.due || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      showToast('Task updated successfully!', 'success')
      triggerRefresh()
    } catch (error) {
      console.error('Error updating task:', error)
      showToast('Failed to update task. Please try again.', 'error')
      throw error
    }
  }

  const handleDeleteTask = async (taskId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      showToast('Task deleted successfully!', 'success')
      triggerRefresh()
      // Close the task detail modal after successful deletion
      setShowTaskDetail(false)
      setSelectedTaskId(null)
    } catch (error) {
      console.error('Error deleting task:', error)
      showToast('Failed to delete task. Please try again.', 'error')
      throw error
    }
  }

  return (
    <Main>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Header />

          {/* Task Search */}
          <TaskSearch onSearch={handleSearch} />

          {/* Action Buttons */}
          <div className="mb-6 flex gap-4 text-center justify-center">
            <AppButton
              onClick={() => setShowCreateForm(true)}
              twStyle="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Create New Task
            </AppButton>
          </div>

          <TaskList onTaskSelect={handleTaskSelect} onDelete={handleDeleteTask} refreshKey={refreshKey} />

          <TaskDetail
            taskId={selectedTaskId}
            isOpen={showTaskDetail}
            onClose={handleCloseTaskDetail}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            refreshKey={refreshKey}
          />

          <TaskForm
            isOpen={showCreateForm}
            onClose={handleCloseCreateForm}
            onSubmit={handleCreateTask}
            mode="create"
          />

          <TaskForm
            isOpen={showUpdateForm}
            onClose={handleCloseUpdateForm}
            onSubmit={handleUpdateTaskSubmit}
            initialData={updateTaskData}
            mode="update"
          />
        </div>
      </div>

      {/* Toast Notification */}
      <AppToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </Main>
  );
};

export default TaskManager;
