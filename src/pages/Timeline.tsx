// 24-hour Timeline Component
import React, { useState } from 'react';
import type { TimelineSlot } from '../types';

interface TimelineProps {
  timeline: TimelineSlot[];
}

export default function Timeline({ timeline }: TimelineProps) {
  const [hoveredSlot, setHoveredSlot] = useState<TimelineSlot | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getColor = (state: string) => {
    switch (state) {
      case 'Present':
        return 'bg-green-500';
      case 'Absent':
        return 'bg-red-500';
      case 'Unknown':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  // Group timeline by hour for better visualization
  const hourlySlots = [];
  for (let hour = 0; hour < 24; hour++) {
    const slots = timeline.filter((slot) => {
      const slotHour = parseInt(slot.time.split(':')[0]);
      return slotHour === hour;
    });
    hourlySlots.push({ hour, slots });
  }

  const handleMouseMove = (e: React.MouseEvent, slot: TimelineSlot) => {
    setHoveredSlot(slot);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-6">
      <h3 className="text-lg text-gray-900 mb-4">24-Hour Presence Timeline</h3>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-700">Unknown</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Hour labels */}
          <div className="flex mb-1">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="flex-1 text-center text-xs text-gray-600">
                {i.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Timeline bars */}
          <div className="flex h-12 border border-gray-300 rounded">
            {hourlySlots.map(({ hour, slots }) => (
              <div key={hour} className="flex-1 flex border-r border-gray-200 last:border-r-0">
                {slots.map((slot, idx) => (
                  <div
                    key={`${hour}-${idx}`}
                    className={`flex-1 ${getColor(slot.state)} cursor-pointer hover:opacity-80`}
                    onMouseEnter={(e) => handleMouseMove(e, slot)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onMouseMove={(e) => handleMouseMove(e, slot)}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          {/* Hour markers */}
          <div className="flex mt-1">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="flex-1 border-l border-gray-200 first:border-l-0 h-2"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredSlot && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-sm pointer-events-none"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 40}px`,
          }}
        >
          <div>Time: {hoveredSlot.time}</div>
          <div>Status: {hoveredSlot.state}</div>
        </div>
      )}
    </div>
  );
}
