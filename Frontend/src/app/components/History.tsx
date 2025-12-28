import { useState } from 'react';
import { Calendar, Search } from 'lucide-react';

interface HistoryProps {
  onDateSelect: (year: number, month: number) => void;
}

export function History({ onDateSelect }: HistoryProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSearch = () => {
    onDateSelect(selectedYear, selectedMonth);
  };

  return (
    <div className="bg-blue-50 border-2 border-black p-4 mb-4">
      <h3 className="mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        History - View Any Date Data
      </h3>
      
      <div className="bg-white border-2 border-black p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full border-2 border-black rounded px-3 py-2"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full border-2 border-black rounded px-3 py-2"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 border-2 border-black"
          >
            <Search className="w-4 h-4" />
            Load Data
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mt-3">
          Select any year and month to view historical data from the past 10+ years
        </p>
      </div>
    </div>
  );
}
