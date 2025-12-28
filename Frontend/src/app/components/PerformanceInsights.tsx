import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';

interface PerformanceInsightsProps {
  dailyData: { day: number; completed: number; total: number }[];
  month: number;
  year: number;
}

export function PerformanceInsights({ dailyData, month, year }: PerformanceInsightsProps) {
  const insights = useMemo(() => {
    const validDays = dailyData.filter(d => d.total > 0);
    
    if (validDays.length === 0) {
      return {
        averageCompletion: 0,
        bestDay: null,
        worstDay: null,
        streak: 0,
        totalTasks: 0,
        totalCompleted: 0,
        trend: 'stable' as const
      };
    }

    const completionRates = validDays.map(d => d.total > 0 ? (d.completed / d.total) * 100 : 0);
    const averageCompletion = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
    
    const bestDayIndex = completionRates.indexOf(Math.max(...completionRates));
    const worstDayIndex = completionRates.indexOf(Math.min(...completionRates));
    
    const bestDay = validDays[bestDayIndex];
    const worstDay = validDays[worstDayIndex];
    
    // Calculate current streak (consecutive days with 100% completion)
    let streak = 0;
    for (let i = validDays.length - 1; i >= 0; i--) {
      const day = validDays[i];
      if (day.total > 0 && day.completed === day.total) {
        streak++;
      } else {
        break;
      }
    }
    
    const totalTasks = dailyData.reduce((sum, d) => sum + d.total, 0);
    const totalCompleted = dailyData.reduce((sum, d) => sum + d.completed, 0);
    
    // Calculate trend (comparing first half vs second half of month)
    const midPoint = Math.floor(validDays.length / 2);
    const firstHalf = validDays.slice(0, midPoint);
    const secondHalf = validDays.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, d) => sum + (d.completed / d.total) * 100, 0) / firstHalf.length 
      : 0;
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, d) => sum + (d.completed / d.total) * 100, 0) / secondHalf.length 
      : 0;
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondHalfAvg > firstHalfAvg + 5) trend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 5) trend = 'declining';
    
    return {
      averageCompletion,
      bestDay,
      worstDay,
      streak,
      totalTasks,
      totalCompleted,
      trend
    };
  }, [dailyData]);

  const monthName = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-black p-4 mb-4">
      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <Target className="w-5 h-5" />
        Performance Insights - {monthName} {year}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Completion */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Completion</p>
              <p className="text-2xl font-bold text-blue-600">
                {insights.averageCompletion.toFixed(1)}%
              </p>
            </div>
            <div className="text-blue-500">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Perfect Days Streak</p>
              <p className="text-2xl font-bold text-green-600">
                {insights.streak}
              </p>
            </div>
            <div className="text-green-500">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Trend</p>
              <p className={`text-2xl font-bold capitalize ${
                insights.trend === 'improving' ? 'text-green-600' : 
                insights.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {insights.trend}
              </p>
            </div>
            <div className={
              insights.trend === 'improving' ? 'text-green-500' : 
              insights.trend === 'declining' ? 'text-red-500' : 'text-gray-500'
            }>
              {insights.trend === 'improving' ? <TrendingUp className="w-8 h-8" /> :
               insights.trend === 'declining' ? <TrendingDown className="w-8 h-8" /> :
               <Target className="w-8 h-8" />}
            </div>
          </div>
        </div>

        {/* Total Progress */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {insights.totalCompleted}/{insights.totalTasks}
              </p>
            </div>
            <div className="text-purple-500">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Best and Worst Day Details */}
      {insights.bestDay && insights.worstDay && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-100 p-3 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-1">🏆 Best Day</h4>
            <p className="text-sm text-green-700">
              Day {insights.bestDay.day}: {insights.bestDay.completed}/{insights.bestDay.total} tasks 
              ({insights.bestDay.total > 0 ? Math.round((insights.bestDay.completed / insights.bestDay.total) * 100) : 0}%)
            </p>
          </div>
          
          <div className="bg-orange-100 p-3 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-1">📈 Improvement Opportunity</h4>
            <p className="text-sm text-orange-700">
              Day {insights.worstDay.day}: {insights.worstDay.completed}/{insights.worstDay.total} tasks 
              ({insights.worstDay.total > 0 ? Math.round((insights.worstDay.completed / insights.worstDay.total) * 100) : 0}%)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}