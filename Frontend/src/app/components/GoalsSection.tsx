import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export interface Task {
  id: string;
  name: string;
  description: string;
  weekCompletions: boolean[][]; // [week][day]
}

export interface Goal {
  id: string;
  name: string;
  tasks: Task[];
}

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: () => void;
  onDeleteGoal: (goalId: string) => void;
  onAddTask: (goalId: string) => void;
  onDeleteTask: (goalId: string, taskId: string) => void;
  onToggleTaskCompletion: (goalId: string, taskId: string, week: number, day: number) => void;
  onUpdateGoalName: (goalId: string, name: string) => void;
  onUpdateTask: (goalId: string, taskId: string, name: string, description: string) => void;
  daysInWeeks: number[][];
  weekDays: string[][];
}

export function GoalsSection({
  goals,
  onAddGoal,
  onDeleteGoal,
  onAddTask,
  onDeleteTask,
  onToggleTaskCompletion,
  onUpdateGoalName,
  onUpdateTask,
  daysInWeeks,
  weekDays
}: GoalsSectionProps) {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  
  // Update expanded goals when goals prop changes
  useEffect(() => {
    setExpandedGoals(new Set(goals.map(g => g.id)));
  }, [goals]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const toggleGoalExpanded = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const getCheckboxColor = (isCompleted: boolean, week: number) => {
    if (!isCompleted) return 'bg-white border-2 border-gray-400';
    
    // Different colors for different weeks based on the reference image
    const colors = [
      'bg-pink-400',    // Week 1
      'bg-purple-400',  // Week 2
      'bg-green-400',   // Week 3
      'bg-orange-400'   // Week 4
    ];
    
    return colors[week % 4];
  };

  return (
    <div className="bg-yellow-50 border-2 border-black p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3>Daily Goal</h3>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Table Header */}
      <div className="bg-white border-2 border-black overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-gray-100">
              <th className="p-2 text-left border-r-2 border-black min-w-[200px]">Goal</th>
              {daysInWeeks.map((week, weekIndex) => (
                <th key={weekIndex} className="border-r border-gray-300" colSpan={week.length}>
                  Week {weekIndex + 1}
                </th>
              ))}
            </tr>
            <tr className="border-b border-black bg-gray-50">
              <th className="p-2 border-r-2 border-black"></th>
              {daysInWeeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => (
                  <th key={`${weekIndex}-${dayIndex}`} className="p-1 border-r border-gray-200">
                    <div className="text-xs">{weekDays[weekIndex][dayIndex]}</div>
                    <div>{day}</div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <React.Fragment key={goal.id}>
                <tr key={goal.id} className="border-b border-gray-300 bg-yellow-100">
                  <td className="p-2 border-r-2 border-black">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleGoalExpanded(goal.id)}
                        className="p-1 hover:bg-yellow-200 rounded"
                      >
                        {expandedGoals.has(goal.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {editingGoal === goal.id ? (
                        <input
                          type="text"
                          defaultValue={goal.name}
                          autoFocus
                          onBlur={(e) => {
                            onUpdateGoalName(goal.id, e.target.value);
                            setEditingGoal(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onUpdateGoalName(goal.id, e.currentTarget.value);
                              setEditingGoal(null);
                            }
                          }}
                          className="flex-1 px-2 py-1 border border-black rounded"
                        />
                      ) : (
                        <span
                          onClick={() => setEditingGoal(goal.id)}
                          className="flex-1 cursor-pointer hover:underline"
                        >
                          {goal.name}
                        </span>
                      )}
                      <button
                        onClick={() => onAddTask(goal.id)}
                        className="p-1 hover:bg-yellow-200 rounded"
                        title="Add Task"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1 hover:bg-red-200 rounded"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                  <td colSpan={daysInWeeks.reduce((sum, week) => sum + week.length, 0)}></td>
                </tr>
                {expandedGoals.has(goal.id) &&
                  goal.tasks.map((task) => (
                    <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2 border-r-2 border-black">
                        <div className="flex items-center gap-2 pl-8">
                          {editingTask === task.id ? (
                            <div className="flex-1">
                              <input
                                type="text"
                                defaultValue={task.name}
                                placeholder="Task name"
                                autoFocus
                                onBlur={(e) => {
                                  const newName = e.target.value;
                                  const descInput = e.target.nextElementSibling as HTMLInputElement;
                                  const newDesc = descInput?.value || task.description;
                                  onUpdateTask(goal.id, task.id, newName, newDesc);
                                  setEditingTask(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const newName = e.currentTarget.value;
                                    const descInput = e.currentTarget.nextElementSibling as HTMLInputElement;
                                    const newDesc = descInput?.value || task.description;
                                    onUpdateTask(goal.id, task.id, newName, newDesc);
                                    setEditingTask(null);
                                  }
                                }}
                                className="w-full px-2 py-1 border border-black rounded mb-1"
                              />
                              <input
                                type="text"
                                defaultValue={task.description}
                                placeholder="Task description"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const nameInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    const newName = nameInput?.value || task.name;
                                    const newDesc = e.currentTarget.value;
                                    onUpdateTask(goal.id, task.id, newName, newDesc);
                                    setEditingTask(null);
                                  }
                                }}
                                className="w-full px-2 py-1 border border-black rounded text-sm"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => setEditingTask(task.id)}
                              className="flex-1 cursor-pointer hover:underline"
                              title={task.description}
                            >
                              {task.name}
                            </div>
                          )}
                          <button
                            onClick={() => onDeleteTask(goal.id, task.id)}
                            className="p-1 hover:bg-red-200 rounded"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      </td>
                      {daysInWeeks.map((week, weekIndex) =>
                        week.map((_, dayIndex) => (
                          <td
                            key={`${weekIndex}-${dayIndex}`}
                            className="p-1 border-r border-gray-200 text-center"
                          >
                            <button
                              onClick={() =>
                                onToggleTaskCompletion(goal.id, task.id, weekIndex, dayIndex)
                              }
                              className={`w-6 h-6 rounded ${getCheckboxColor(
                                task.weekCompletions[weekIndex]?.[dayIndex] || false,
                                weekIndex
                              )}`}
                              title={task.description}
                            />
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
