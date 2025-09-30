import { useState } from 'react'
import AppButton from '../../ui/AppButton'

interface TaskSearchProps {
  onSearch: (taskId: number) => void
}

const TaskSearch: React.FC<TaskSearchProps> = ({ onSearch }) => {
  const [searchId, setSearchId] = useState<string>('')

  const handleSearch = (): void => {
    const taskId = parseInt(searchId.trim())
    if (!isNaN(taskId) && taskId > 0) {
      onSearch(taskId)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchId(e.target.value)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Search Task by ID</h3>
      <div className="flex gap-3">
        <input
          type="number"
          value={searchId}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter task ID..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
        />
        <AppButton
          onClick={handleSearch}
          twStyle="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
        >
          Search
        </AppButton>
      </div>
    </div>
  )
}

export default TaskSearch
