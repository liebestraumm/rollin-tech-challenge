const Header = () => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
      </div>

      {/* API Endpoints Info */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Available API Endpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-mono bg-blue-100 px-2 py-1 rounded">GET /api/v1/tasks</span>
            <p className="text-blue-700">Get all tasks</p>
          </div>
          <div>
            <span className="font-mono bg-blue-100 px-2 py-1 rounded">GET /api/v1/tasks/:id</span>
            <p className="text-blue-700">Get task by ID</p>
          </div>
          <div>
            <span className="font-mono bg-blue-100 px-2 py-1 rounded">POST /api/v1/tasks</span>
            <p className="text-blue-700">Create new task</p>
          </div>
          <div>
            <span className="font-mono bg-blue-100 px-2 py-1 rounded">PUT /api/v1/tasks/:id</span>
            <p className="text-blue-700">Update task</p>
          </div>
          <div>
            <span className="font-mono bg-blue-100 px-2 py-1 rounded">DELETE /api/v1/tasks/:id</span>
            <p className="text-blue-700">Delete task</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
