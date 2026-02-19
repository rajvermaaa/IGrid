import { useState, useRef } from "react";
import { Upload, X, Eye, User, Calendar, MapPin, Search, Loader2, ImageIcon, ArrowLeft } from "lucide-react";
import { searchFaceMatch, SNAPSHOT_BASE } from "../components/services/igridApi";
import type { FaceMatchResult } from "../components/types/igrid";

interface FaceMatchProps {
  onNavigateBack?: () => void;
}

export default function FaceMatch({ onNavigateBack }: FaceMatchProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [matches, setMatches] = useState<FaceMatchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    if (!uploadedFile) return;

    setIsSearching(true);
    setMatches([]);

    try {
      const results = await searchFaceMatch(uploadedFile);
      setMatches(results);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Face search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setMatches([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "from-emerald-500 to-green-600";
      case "medium":
        return "from-amber-500 to-orange-600";
      case "low":
        return "from-red-500 to-rose-600";
      default:
        return "from-zinc-500 to-slate-600";
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return "text-emerald-600";
    if (percentage >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-slate-100 text-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm px-6 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateBack?.()}
              className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              Back
            </button>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-1.5 rounded-lg shadow-md">
              <Search className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-zinc-800 tracking-tight">
                Face Matching System
              </h1>
              <p className="text-[10px] text-zinc-500">Upload and identify individuals from surveillance database</p>
            </div>
            <div className="flex items-center gap-2 bg-zinc-100 px-2.5 py-1 rounded-full">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-medium text-zinc-600">iGrid System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-zinc-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-1.5 rounded-lg">
                    <Upload className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-800">Upload Face Image</div>
                    <div className="text-[10px] text-zinc-500">JPG, PNG or JPEG format</div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all group"
                  >
                    <div className="bg-purple-100 group-hover:bg-purple-200 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center transition-all">
                      <ImageIcon className="w-8 h-8 text-purple-600" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-zinc-700 mb-1">Click to upload image</p>
                    <p className="text-xs text-zinc-500">or drag and drop</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative group">
                      <img
                        src={uploadedImage}
                        alt="Uploaded face"
                        className="w-full h-64 object-cover rounded-lg border border-zinc-200"
                      />
                      <button
                        onClick={resetUpload}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg hover:bg-red-50 text-zinc-600 hover:text-red-600 transition-all"
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>

                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-zinc-400 disabled:to-zinc-500 text-white px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                          Searching Database...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" strokeWidth={2.5} />
                          Search for Matches
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {uploadedImage && matches.length > 0 && (
              <div className="bg-white rounded-xl border border-zinc-200 shadow-md p-4">
                <div className="text-xs font-semibold text-zinc-800 mb-2">Search Summary</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Total Matches Found</span>
                    <span className="font-bold text-purple-600">{matches.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">High Confidence</span>
                    <span className="font-bold text-emerald-600">
                      {matches.filter(m => m.confidence === "high").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Medium Confidence</span>
                    <span className="font-bold text-amber-600">
                      {matches.filter(m => m.confidence === "medium").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Low Confidence</span>
                    <span className="font-bold text-red-600">
                      {matches.filter(m => m.confidence === "low").length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                  <User className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-800">Match Results</div>
                  <div className="text-[10px] text-zinc-500">
                    {matches.length > 0 ? `${matches.length} potential match${matches.length > 1 ? 'es' : ''} found` : 'No matches yet'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {!uploadedImage ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="bg-zinc-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Search className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-zinc-700 mb-1">No search performed</p>
                    <p className="text-xs text-zinc-500">Upload an image to begin face matching</p>
                  </div>
                </div>
              ) : isSearching ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-sm font-medium text-zinc-700 mb-1">Searching database...</p>
                    <p className="text-xs text-zinc-500">Analyzing facial features</p>
                  </div>
                </div>
              ) : matches.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <User className="w-8 h-8 text-amber-600" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-zinc-700 mb-1">No matches found</p>
                    <p className="text-xs text-zinc-500">No similar faces in the database</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match, idx) => (
                    <MatchCard
                      key={idx}
                      match={match}
                      rank={idx + 1}
                      onViewImage={setPreview}
                      getConfidenceColor={getConfidenceColor}
                      getMatchColor={getMatchColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="relative max-w-6xl w-full animate-in zoom-in-95 duration-300">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-slate-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-1.5 rounded-lg shadow-md">
                    <Eye className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-800">Snapshot Evidence</h3>
                    <p className="text-[10px] text-zinc-500">High-resolution surveillance capture</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreview(null)}
                  className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-1.5 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
              <div className="p-4 bg-zinc-900">
                <img
                  src={SNAPSHOT_BASE + preview.replace("./", "")}
                  className="max-h-[75vh] w-full object-contain rounded-lg shadow-2xl"
                  alt="Snapshot evidence"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MatchCardProps {
  match: FaceMatchResult;
  rank: number;
  onViewImage: (url: string) => void;
  getConfidenceColor: (confidence: string) => string;
  getMatchColor: (percentage: number) => string;
}

function MatchCard({ match, rank, onViewImage, getConfidenceColor, getMatchColor }: MatchCardProps) {
  return (
    <div className="border border-zinc-200 rounded-lg bg-white hover:border-purple-300 hover:shadow-md transition-all overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <div className={`bg-gradient-to-br ${getConfidenceColor(match.confidence)} text-white rounded-lg p-2 shadow-md`}>
            <div className="text-[8px] uppercase tracking-wider font-bold text-center">Rank</div>
            <div className="text-2xl font-bold text-center leading-none">{rank}</div>
          </div>
        </div>

        {/* Snapshot */}
        <div
          className="flex-shrink-0 relative group cursor-pointer"
          onClick={() => onViewImage(match.snapshot)}
        >
          <img
            src={SNAPSHOT_BASE + match.snapshot.replace("./", "")}
            alt={match.person_name}
            className="w-24 h-24 object-cover rounded-lg border border-zinc-200 group-hover:border-purple-300 transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-lg">
            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4 text-purple-600" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm font-bold text-zinc-800 truncate">{match.person_id}</div>
              <div className="text-xs text-zinc-600">{match.person_name}</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getMatchColor(match.match_percentage)}`}>
                {match.match_percentage}%
              </div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Match</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-start gap-1.5 p-2 bg-zinc-50 rounded-lg">
              <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Location</div>
                <div className="text-xs text-zinc-900 font-medium truncate">{match.last_seen_zone}</div>
              </div>
            </div>

            <div className="flex items-start gap-1.5 p-2 bg-zinc-50 rounded-lg">
              <Calendar className="w-3 h-3 text-zinc-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Last Seen</div>
                <div className="text-[10px] text-zinc-900 font-mono font-medium">
                  {new Date(match.last_seen_time).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r ${getConfidenceColor(match.confidence)} text-white shadow-sm inline-block`}>
              {match.confidence} confidence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}