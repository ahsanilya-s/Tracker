import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarSelector({ selectedMonth, selectedYear, onMonthChange, onYearChange }: CalendarSelectorProps) {
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  return (
    <div className="bg-yellow-100 border-2 border-black p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-yellow-200 rounded"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold">
          {MONTHS[selectedMonth]} {selectedYear}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-yellow-200 rounded"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-4">
        <div>
          <label className="block mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="border border-black p-2 rounded bg-white"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="border border-black p-2 rounded bg-white"
          >
            {Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
