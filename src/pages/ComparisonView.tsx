// Availability Comparison View
import  { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockPeople } from '../components/data/mockData';
import type { ShiftType } from '../types';

export default function ComparisonView() {
  const [selectedShift, setSelectedShift] = useState<ShiftType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'availability'>('availability');

  // Prepare data for chart
  const chartData = useMemo(() => {
    let data = [...mockPeople];

    // Filter by shift
    if (selectedShift !== 'All') {
      data = data.filter((person) => person.shift === selectedShift);
    }

    // Sort
    if (sortBy === 'availability') {
      data.sort((a, b) => a.availabilityPercent - b.availabilityPercent);
    } else {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data.map((person) => ({
      name: person.name,
      availability: person.availabilityPercent,
      status: person.status,
      id: person.id,
      shift: person.shift,
    }));
  }, [selectedShift, sortBy]);

  const getBarColor = (status: string) => {
    switch (status) {
      case 'Good':
        return '#22c55e'; // green-500
      case 'Warning':
        return '#eab308'; // yellow-500
      case 'Low':
        return '#ef4444'; // red-500
      default:
        return '#9ca3af'; // gray-400
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 rounded p-3 shadow-lg">
          <p className="text-sm text-gray-900">{data.name}</p>
          <p className="text-xs text-gray-600">ID: {data.id}</p>
          <p className="text-xs text-gray-600">Shift: {data.shift}</p>
          <p className="text-sm text-gray-900 mt-1">
            Availability: <span className="font-medium">{data.availability.toFixed(1)}%</span>
          </p>
          <p className="text-xs text-gray-600">Status: {data.status}</p>
        </div>
      );
    }
    return null;
  };

  // Statistics
  const stats = useMemo(() => {
    const lowAvailability = chartData.filter((d) => d.availability < 60);
    const avgAvailability =
      chartData.reduce((sum, d) => sum + d.availability, 0) / (chartData.length || 1);

    return {
      total: chartData.length,
      lowCount: lowAvailability.length,
      avgAvailability: avgAvailability.toFixed(1),
    };
  }, [chartData]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl text-gray-900 mb-6">Availability Comparison</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Filter by Shift</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as ShiftType | 'All')}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="All">All Shifts</option>
              <option value="Shift A">Shift A</option>
              <option value="Shift B">Shift B</option>
              <option value="Shift C">Shift C</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'availability')}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="availability">Availability (Low to High)</option>
              <option value="name">Name (A to Z)</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-sm text-gray-600 mb-1">Total People</p>
            <p className="text-2xl text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-sm text-gray-600 mb-1">Average Availability</p>
            <p className="text-2xl text-gray-900">{stats.avgAvailability}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-sm text-gray-600 mb-1">Low Availability (&lt;60%)</p>
            <p className="text-2xl text-red-600">{stats.lowCount}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg text-gray-900">Availability Ranking</h2>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700">Good (≥80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-700">Warning (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-700">Low (&lt;60%)</span>
            </div>
          </div>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 40)}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="availability" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-12 text-center text-gray-500">
            No data available for the selected shift
          </div>
        )}
      </div>

      {/* Low Availability Alert */}
      {stats.lowCount > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm">
              !
            </div>
            <div>
              <h3 className="text-red-900 mb-1">Low Availability Alert</h3>
              <p className="text-sm text-red-800">
                {stats.lowCount} {stats.lowCount === 1 ? 'person has' : 'people have'} availability
                below 60%. Review individual timelines for detailed analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
