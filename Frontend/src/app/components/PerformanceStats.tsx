interface PerformanceStatsProps {
  stats: {
    completed: number[];
    notCompleted: number[];
    percentageCompleted: number[];
  };
}

export function PerformanceStats({ stats }: PerformanceStatsProps) {
  // Validate that all arrays have the same length
  const maxLength = Math.max(
    stats.completed.length,
    stats.notCompleted.length,
    stats.percentageCompleted.length
  );
  
  if (stats.completed.length !== maxLength || 
      stats.notCompleted.length !== maxLength || 
      stats.percentageCompleted.length !== maxLength) {
    console.warn('Performance stats arrays have mismatched lengths');
  }

  return (
    <div className="bg-white border-2 border-black p-4 mb-4">
      <h3 className="mb-2 text-lg font-semibold">Performance Statistics</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left p-2 bg-gray-100">Metric</th>
              {Array.from({ length: maxLength }, (_, index) => (
                <th key={`day-${index + 1}`} className="p-2 text-center bg-gray-100 min-w-[50px]">
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300 hover:bg-green-50">
              <td className="p-2 font-medium text-green-700">Completed</td>
              {Array.from({ length: maxLength }, (_, index) => (
                <td key={`completed-${index}`} className="p-2 text-center">
                  {stats.completed[index] || 0}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-300 hover:bg-red-50">
              <td className="p-2 font-medium text-red-700">Not Completed</td>
              {Array.from({ length: maxLength }, (_, index) => (
                <td key={`not-completed-${index}`} className="p-2 text-center">
                  {stats.notCompleted[index] || 0}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-blue-50">
              <td className="p-2 font-medium text-blue-700">% Completed</td>
              {Array.from({ length: maxLength }, (_, index) => (
                <td key={`percentage-${index}`} className="p-2 text-center font-semibold">
                  {stats.percentageCompleted[index] || 0}%
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
