 customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
          const totalPages = Math.ceil(count / rowsPerPage);
          const from = (page * rowsPerPage) + 1;
          const to = Math.min((page + 1) * rowsPerPage, count);
          const pageOptions = [5, 10, 25, 50, 100];
        
          return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm mt-4">
              {/* Rows per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Rows:</span>
                <select 
                  value={rowsPerPage}
                  onChange={(e) => changeRowsPerPage(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {pageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
        
              {/* Entries info */}
              <div className="bg-white px-3 py-1.5 rounded-md border border-gray-200">
                <span className="text-gray-700">Showing </span>
                <span className="font-medium text-blue-600">{from}-{to}</span>
                <span className="text-gray-700"> of </span>
                <span className="font-medium text-blue-600">{count}</span>
              </div>
        
              {/* Page navigation */}
              <div className="flex items-center gap-3">
                {/* Page input */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 hidden sm:inline">Page</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={page + 1}
                    onChange={(e) => {
                      const newPage = Math.min(Math.max(1, parseInt(e.target.value || 1)), totalPages) - 1;
                      changePage(newPage);
                    }}
                    className="w-16 border border-gray-300 rounded-md px-3 py-1.5 text-center text-sm bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">of</span>
                  <span className="font-medium">{totalPages}</span>
                </div>
        
                {/* Navigation buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => changePage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className={`px-3 py-1.5 rounded-md border ${page === 0 
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-gray-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500'}`}
                  >
                    <IoIosArrowBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => changePage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className={`px-3 py-1.5 rounded-md border ${page >= totalPages - 1
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-gray-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500'}`}
                  >
                    <IoIosArrowForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        }