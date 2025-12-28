import { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarSelector } from './components/CalendarSelector';
import { DailyCompletionChart } from './components/DailyCompletionChart';
import { PerformanceStats } from './components/PerformanceStats';
import { GoalsSection, Goal, Task } from './components/GoalsSection';
import { PerformanceInsights } from './components/PerformanceInsights';
import { safeLocalStorage } from './utils/performance';
import { MoodTracker } from './components/MoodTracker';
import { History } from './components/History';

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getWeekDayName(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function organizeIntoWeeks(month: number, year: number) {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = new Date(year, month, 1).getDay();
  const totalWeeks = Math.ceil((daysInMonth + firstDay) / 7);
  const weeks: number[][] = Array.from({ length: totalWeeks }, () => []);
  const weekDays: string[][] = Array.from({ length: totalWeeks }, () => []);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const weekIndex = Math.floor((day + firstDay - 1) / 7);
    
    weeks[weekIndex].push(day);
    weekDays[weekIndex].push(getWeekDayName(date));
  }
  
  return { weeks, weekDays };
}

// Helper function to find week and day position
function findWeekAndDay(day: number, weeks: number[][]) {
  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
    const dayIndex = weeks[weekIndex].indexOf(day);
    if (dayIndex !== -1) {
      return { weekIndex, dayIndex };
    }
  }
  return { weekIndex: -1, dayIndex: -1 };
}

// Helper function to reset task completions
function resetTaskCompletions(goals: Goal[], weeks: number[][]) {
  return goals.map(goal => ({
    ...goal,
    tasks: goal.tasks.map(task => ({
      ...task,
      weekCompletions: weeks.map(week => new Array(week.length).fill(false))
    }))
  }));
}

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [moods, setMoods] = useState<{ [date: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // Load data from localStorage with error handling
  useEffect(() => {
    const savedGoals = safeLocalStorage.getItem('goals');
    const savedMoods = safeLocalStorage.getItem('moods');
    const savedMonth = safeLocalStorage.getItem('selectedMonth');
    const savedYear = safeLocalStorage.getItem('selectedYear');

    if (savedGoals) {
      setGoals(savedGoals);
    } else {
      // Initialize with sample data
      const sampleGoals: Goal[] = [
        {
          id: '1',
          name: 'Read for 10 minutes',
          tasks: [
            {
              id: '1-1',
              name: 'Read before bed',
              description: 'Read at least 10 minutes before sleeping',
              weekCompletions: [[], [], [], []]
            }
          ]
        },
        {
          id: '2',
          name: 'Exercise',
          tasks: [
            {
              id: '2-1',
              name: 'Morning workout',
              description: '30 minutes of exercise',
              weekCompletions: [[], [], [], []]
            }
          ]
        }
      ];
      setGoals(sampleGoals);
    }

    if (savedMoods) {
      setMoods(savedMoods);
    }

    if (savedMonth !== null) {
      setSelectedMonth(savedMonth);
    }

    if (savedYear !== null) {
      setSelectedYear(savedYear);
    }
  }, []);

  // Save data to localStorage with error handling
  useEffect(() => {
    safeLocalStorage.setItem('goals', goals);
  }, [goals]);

  useEffect(() => {
    safeLocalStorage.setItem('moods', moods);
  }, [moods]);

  useEffect(() => {
    safeLocalStorage.setItem('selectedMonth', selectedMonth);
    safeLocalStorage.setItem('selectedYear', selectedYear);
  }, [selectedMonth, selectedYear]);

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const { weeks, weekDays } = organizeIntoWeeks(selectedMonth, selectedYear);

  // Memoized calculations for better performance
  const dailyCompletionData = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      let completed = 0;
      let total = 0;

      goals.forEach(goal => {
        goal.tasks.forEach(task => {
          total++;
          const { weekIndex, dayIndex: dayInWeek } = findWeekAndDay(day, weeks);
          if (weekIndex !== -1 && dayInWeek !== -1 && task.weekCompletions[weekIndex]?.[dayInWeek]) {
            completed++;
          }
        });
      });

      return { day, completed, total };
    });
  }, [goals, daysInMonth, weeks]);

  // Calculate performance stats with memoization
  const stats = useMemo(() => {
    const completed: number[] = [];
    const notCompleted: number[] = [];
    const percentageCompleted: number[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      let dayCompleted = 0;
      let dayTotal = goals.reduce((sum, goal) => sum + goal.tasks.length, 0);

      const { weekIndex, dayIndex: dayInWeek } = findWeekAndDay(day, weeks);

      if (weekIndex !== -1 && dayInWeek !== -1) {
        goals.forEach(goal => {
          goal.tasks.forEach(task => {
            if (task.weekCompletions[weekIndex]?.[dayInWeek]) {
              dayCompleted++;
            }
          });
        });
      }

      completed.push(dayCompleted);
      notCompleted.push(dayTotal - dayCompleted);
      percentageCompleted.push(dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0);
    }

    return { completed, notCompleted, percentageCompleted };
  }, [goals, daysInMonth, weeks]);

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: generateId(),
      name: 'New Goal',
      tasks: []
    };
    setGoals([...goals, newGoal]);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const handleAddTask = useCallback((goalId: string) => {
    setGoals(goals => goals.map(goal => {
      if (goal.id === goalId) {
        const newTask: Task = {
          id: generateId(),
          name: 'New Task',
          description: 'Task description',
          weekCompletions: weeks.map(week => new Array(week.length).fill(false))
        };
        return { ...goal, tasks: [...goal.tasks, newTask] };
      }
      return goal;
    }));
  }, [weeks]);

  const handleDeleteTask = (goalId: string, taskId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, tasks: goal.tasks.filter(t => t.id !== taskId) };
      }
      return goal;
    }));
  };

  const handleToggleTaskCompletion = (goalId: string, taskId: string, week: number, day: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map(task => {
            if (task.id === taskId) {
              const newCompletions = [...task.weekCompletions];
              if (!newCompletions[week]) {
                newCompletions[week] = new Array(weeks[week].length).fill(false);
              }
              newCompletions[week] = [...newCompletions[week]];
              newCompletions[week][day] = !newCompletions[week][day];
              return { ...task, weekCompletions: newCompletions };
            }
            return task;
          })
        };
      }
      return goal;
    }));
  };

  const handleUpdateGoalName = (goalId: string, name: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, name };
      }
      return goal;
    }));
  };

  const handleUpdateTask = (goalId: string, taskId: string, name: string, description: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, name, description };
            }
            return task;
          })
        };
      }
      return goal;
    }));
  };

  const handleMoodSelect = (date: string, emoji: string) => {
    setMoods({ ...moods, [date]: emoji });
  };

  const handleMonthChange = useCallback((month: number) => {
    setSelectedMonth(month);
    const newWeeks = organizeIntoWeeks(month, selectedYear).weeks;
    setGoals(goals => resetTaskCompletions(goals, newWeeks));
  }, [selectedYear]);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    const newWeeks = organizeIntoWeeks(selectedMonth, year).weeks;
    setGoals(goals => resetTaskCompletions(goals, newWeeks));
  }, [selectedMonth]);

  const handleHistoryDateSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setActiveTab('current');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl mb-6">Goal Tracking Software</h1>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-2 rounded border-2 border-black ${
              activeTab === 'current' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Current View
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded border-2 border-black ${
              activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            History
          </button>
        </div>

        {activeTab === 'history' && (
          <History onDateSelect={handleHistoryDateSelect} />
        )}
        
        <CalendarSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />

        <DailyCompletionChart
          data={dailyCompletionData}
          month={selectedMonth}
          year={selectedYear}
        />

        <PerformanceInsights
          dailyData={dailyCompletionData}
          month={selectedMonth}
          year={selectedYear}
        />

        <PerformanceStats stats={stats} />

        <GoalsSection
          goals={goals}
          onAddGoal={handleAddGoal}
          onDeleteGoal={handleDeleteGoal}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onToggleTaskCompletion={handleToggleTaskCompletion}
          onUpdateGoalName={handleUpdateGoalName}
          onUpdateTask={handleUpdateTask}
          daysInWeeks={weeks}
          weekDays={weekDays}
        />

        <MoodTracker
          moods={moods}
          daysInMonth={daysInMonth}
          month={selectedMonth}
          year={selectedYear}
          onMoodSelect={handleMoodSelect}
        />
      </div>
    </div>
  );
}
