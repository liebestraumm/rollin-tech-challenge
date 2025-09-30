import { useState } from 'react'
import Main from "../components/layouts/Main"
import Header from "../components/sections/Header"
import TaskList from "../components/sections/tasks/TaskList"
import TaskDetail from "../components/sections/tasks/TaskDetail"
import TaskForm from "../components/forms/tasks/TaskForm"
import AppButton from "../components/ui/AppButton"
import { type CreateTaskInput } from "../validators/taskValidator"

const TaskManager = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState<boolean>(false)
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false)
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false)
  const [updateTaskData, setUpdateTaskData] = useState<Partial<CreateTaskInput>>({})

  const handleTaskSelect = (taskId: number): void => {
    setSelectedTaskId(taskId)
    setShowTaskDetail(true)
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

      console.log('Task created successfully')
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const handleUpdateTask = async (taskData: CreateTaskInput): Promise<void> => {
    if (!selectedTaskId) return

    try {
      const response = await fetch(`http://localhost:8000/api/v1/tasks/${selectedTaskId}`, {
        method: 'PUT',
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

      console.log('Task updated successfully')
    } catch (error) {
      console.error('Error updating task:', error)
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

      console.log('Task deleted successfully')
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  return (
    <Main>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Header />

          {/* Action Buttons */}
          <div className="mb-6 flex gap-4">
            <AppButton
              onClick={() => setShowCreateForm(true)}
              twStyle="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Create New Task
            </AppButton>
            <AppButton
              onClick={() => {
                setShowUpdateForm(true)
                setUpdateTaskData({ title: 'Sample Task', description: 'Sample description', complete: false })
              }}
              twStyle="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Update Task
            </AppButton>
            <AppButton
              onClick={() => handleDeleteTask(1)}
              twStyle="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Delete Task (ID: 1)
            </AppButton>
          </div>

          <TaskList onTaskSelect={handleTaskSelect} />

          <TaskDetail
            taskId={selectedTaskId}
            isOpen={showTaskDetail}
            onClose={handleCloseTaskDetail}
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
            onSubmit={handleUpdateTask}
            initialData={updateTaskData}
            mode="update"
          />
        </div>
      </div>
    </Main>
  );
};

export default TaskManager;
