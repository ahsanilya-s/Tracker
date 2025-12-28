import { useState } from 'react';

interface MoodTrackerProps {
  moods: { [date: string]: string };
  daysInMonth: number;
  month: number;
  year: number;
  onMoodSelect: (date: string, emoji: string) => void;
}

const MOOD_EMOJIS = ['😊', '😐', '😟', '😢'];

export function MoodTracker({ moods, daysInMonth, month, year, onMoodSelect }: MoodTrackerProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div className="bg-yellow-50 border-2 border-black p-4">
      <h3 className="mb-2">Daily Mood</h3>
      <p className="mb-4 text-sm">
        How are you feeling today? Select your mood (Double click the Cell to choose)
      </p>
      
      <div className="bg-white border-2 border-black p-4">
        <div className="grid grid-cols-10 gap-2 mb-4">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const mood = moods[dateKey];
            
            return (
              <div
                key={day}
                className="relative"
              >
                <button
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                  onDoubleClick={() => setSelectedDay(day)}
                  className="w-full aspect-square border-2 border-black rounded hover:bg-gray-100 flex flex-col items-center justify-center"
                >
                  <div className="text-xs">{day}</div>
                  {mood && <div className="text-2xl">{mood}</div>}
                </button>
                
                {selectedDay === day && (
                  <div className="absolute top-full left-0 mt-1 bg-white border-2 border-black rounded shadow-lg p-2 z-10 flex gap-2">
                    {MOOD_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          onMoodSelect(dateKey, emoji);
                          setSelectedDay(null);
                        }}
                        className="text-2xl hover:bg-gray-100 p-1 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}