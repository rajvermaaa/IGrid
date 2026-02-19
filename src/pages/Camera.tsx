import React, { useState, useEffect } from "react";

interface CameraData {
  cameraName: string;
  ipAddress: string;
  location: string;
  station: string;
  status: string;
  stream: string;
  ai: string;
  people: number;
  lastDetected: string;
  lastAlert: string;
  hooter: string;
  view: string;
  actions: string;
}

const generateDummyData = (): CameraData[] => {
  const dummyData: CameraData[] = [];
  for (let i = 1; i <= 20; i++) {
    dummyData.push({
      cameraName: `Camera ${i}`,
      ipAddress: `192.168.0.${i}`,
      location: `Zone ${i % 5}`,
      station: `Station ${i % 10}`,
      status: i % 3 === 0 ? "Offline" : "Online",
      stream: i % 2 === 0 ? "Live" : "Stopped",
      ai: i % 4 === 0 ? "Enabled" : "Disabled",
      people: Math.floor(Math.random() * 5),
      lastDetected: `2025-07-${(i % 28) + 1} 14:${(i * 2) % 60}`,
      lastAlert: `2025-07-${(i % 28) + 1} 13:${(i * 3) % 60}`,
      hooter: i % 5 === 0 ? "Active" : "Inactive",
      view: "💻",
      actions: "⚙",
    });
  }
  return dummyData;
};

const Camera: React.FC = () => {
  const [cameraData, setCameraData] = useState<CameraData[]>(
    generateDummyData()
  );
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null);
  const [addCameraModal, setAddCameraModal] = useState(false);
  const [newCamera, setNewCamera] = useState({
    cameraName: "",
    ipAddress: "",
    location: "",
    station: "",
    ai: "Enabled",
    stream: "Live",
    hooter: "Active",
  });

  useEffect(() => {
    const scrollContainer = document.getElementById("scroll-container");
    if (scrollContainer) {
      scrollContainer.style.position = "fixed";
      scrollContainer.style.bottom = "0";
      scrollContainer.style.left = "0";
      scrollContainer.style.right = "0";
      scrollContainer.style.zIndex = "10";
      scrollContainer.style.backgroundColor = "#f3f4f6";
      scrollContainer.style.overflowX = "auto";
    }
  }, []);

  const handleAddCamera = () => {
    const newEntry: CameraData = {
      ...newCamera,
      status: "Online",
      people: 0,
      lastDetected: new Date().toISOString(),
      lastAlert: new Date().toISOString(),
      view: "💻",
      actions: "⚙",
    };
    setCameraData([newEntry, ...cameraData]);
    setAddCameraModal(false);
    setNewCamera({
      cameraName: "",
      ipAddress: "",
      location: "",
      station: "",
      ai: "Enabled",
      stream: "Live",
      hooter: "Active",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black relative w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Camera Dashboard</h1>
        <button
          onClick={() => setAddCameraModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Camera
        </button>
      </div>

      <div
        className="w-full border border-gray-300 rounded-md"
        style={{ paddingBottom: "60px" }}
      >
        <div className="min-w-[1500px]">
          <table className="w-full text-sm bg-white">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                {[
                  "Camera Name",
                  "IP Address",
                  "Location",
                  "Station",
                  "Status",
                  "Stream",
                  "AI",
                  "People",
                  "Last Detected",
                  "Last Alert",
                  "Hooter",
                  "View",
                  "Actions",
                ].map((heading, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {cameraData.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{row.cameraName}</td>
                  <td className="px-4 py-2">{row.ipAddress}</td>
                  <td className="px-4 py-2">{row.location}</td>
                  <td className="px-4 py-2">{row.station}</td>
                  <td className="px-4 py-2">{row.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          row.stream === "Live"
                            ? "bg-green-500 blink"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span>{row.stream}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{row.ai}</td>
                  <td className="px-4 py-2">{row.people}</td>
                  <td className="px-4 py-2">{row.lastDetected}</td>
                  <td className="px-4 py-2">{row.lastAlert}</td>
                  <td className="px-4 py-2">{row.hooter}</td>
                  <td className="px-4 py-2">
                    <img
                      src="/src/assets/cctv.png"
                      alt="View Camera"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => setSelectedCamera(row)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-blue-500 hover:underline">
                      Actions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Static bottom scrollbar container */}
      <div id="scroll-container"></div>

      <style>
        {`
                    .blink {
                      animation: blink-animation 1s steps(1, start) infinite;
                    }

                    @keyframes blink-animation {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0; }
                    }
                `}
      </style>

      {selectedCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <h2 className="text-lg font-semibold mb-2">
              🎥 {selectedCamera.cameraName} – Live Feed
            </h2>
            <p className="mb-4 text-gray-700">
              This is a placeholder for the real-time camera stream.
            </p>
            <div className="w-full h-64 bg-gray-300 rounded-md flex items-center justify-center">
              <span className="text-gray-600">[Live video stream]</span>
            </div>
            <button
              onClick={() => setSelectedCamera(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {addCameraModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 relative">
            <h2 className="text-xl font-semibold">Add New Camera</h2>

            {["cameraName", "ipAddress", "location", "station"].map((field) => (
              <input
                key={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={(newCamera as any)[field]}
                onChange={(e) =>
                  setNewCamera({ ...newCamera, [field]: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none"
              />
            ))}

            <select
              value={newCamera.ai}
              onChange={(e) =>
                setNewCamera({ ...newCamera, ai: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-2 rounded"
            >
              <option>Enabled</option>
              <option>Disabled</option>
            </select>

            <select
              value={newCamera.stream}
              onChange={(e) =>
                setNewCamera({ ...newCamera, stream: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-2 rounded"
            >
              <option>Live</option>
              <option>Stopped</option>
            </select>

            <select
              value={newCamera.hooter}
              onChange={(e) =>
                setNewCamera({ ...newCamera, hooter: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-2 rounded"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddCameraModal(false)}
                className="px-4 py-1 border border-gray-400 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCamera}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
