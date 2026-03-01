import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  getForms,
  getAverageSentimentAllForms,
  getResponseCountPerForm,
  getSuggestions,
  getTopPerformersSummary
} from "@/services/api";
import { useNavigate, Link } from "react-router-dom";
import { 
  BarChart3, 
  PieChart as PieIcon, 
  MessageSquare, 
  Users, 
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  Zap,
  Info,
  ChevronDown,
  Award,
  ThumbsUp
} from "lucide-react";

interface Suggestion {
  category: string;
  observation: string;
  actionableStep: string;
  priority: string;
}

interface SummaryData {
  topRatedForm: string;
  topRating: number;
  topSentimentForm: string;
  topSentiment: number;
  totalForms: number;
  totalResponses: number;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [responseCounts, setResponseCounts] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    if (selectedFormId) {
      setLoadingSuggestions(true);
      getSuggestions(Number(selectedFormId))
        .then((res) => setSuggestions(res.data))
        .catch((err) => console.error("Failed to fetch suggestions", err))
        .finally(() => setLoadingSuggestions(false));
    } else {
      setSuggestions([]);
    }
  }, [selectedFormId]);

  useEffect(() => {
    getTopPerformersSummary()
      .then((res) => setSummary(res?.data || null))
      .catch((err) => console.error("Failed to fetch summary", err));

    getAverageSentimentAllForms()
      .then((res) => setSentimentData(res?.data || []))
      .catch((err) => console.error("Failed to fetch sentiment data", err));

    getResponseCountPerForm()
      .then((res) => setResponseCounts(res?.data || []))
      .catch((err) => console.error("Failed to fetch response counts", err));

    getForms()
      .then((res) => {
        console.log("Forms received:", res.data);
        setForms(res?.data || []);
      })
      .catch((err) => console.error("Error fetching forms:", err));
  }, []);

  const participationData = Array.isArray(responseCounts) 
    ? responseCounts.map((item) => {
        const formName = item?.form || "Untitled";
        return {
          name: formName.length > 15 ? `${formName.substring(0, 15)}...` : formName,
          fullName: formName,
          responses: item?.responses || 0,
        };
      })
    : [];

  const sentimentCounts: { [key: string]: number } = {};
  if (Array.isArray(sentimentData)) {
    sentimentData.forEach((form) => {
      const category = form?.category || "Unknown";
      sentimentCounts[category] = (sentimentCounts[category] || 0) + 1;
    });
  }

  const ratingDistribution = Object.entries(sentimentCounts).map(
    ([category, count]) => ({
      name: category,
      value: count,
      color:
        category === "Very Positive"
          ? "#10b981"
          : category === "Positive"
          ? "#3b82f6"
          : category === "Neutral"
          ? "#f59e0b"
          : category === "Negative"
          ? "#ef4444"
          : "#94a3b8",
    })
  );

  const globalAvgSentiment = Array.isArray(sentimentData) && sentimentData.length > 0
    ? (sentimentData.reduce((acc, curr) => acc + (curr?.averageSentiment || 0), 0) / sentimentData.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 mb-8">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Analytics Overview</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
            <span>Live System Metrics</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Total Active Forms</p>
                  <p className="text-4xl font-bold">{summary?.totalForms || (Array.isArray(forms) ? forms.length : 0)}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Overall Responses</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {summary?.totalResponses || (Array.isArray(responseCounts) ? responseCounts.reduce((acc, curr) => acc + (curr?.responses || 0), 0) : 0)}
                  </p>
                </div>
                <div className="bg-green-50 p-2 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Global Avg. Sentiment</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {(globalAvgSentiment * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-purple-50 p-2 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights Row */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-none shadow-sm rounded-2xl bg-white border-l-4 border-l-amber-500">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Top Rated Session</p>
                  <p className="text-lg font-bold text-gray-900 line-clamp-1">{summary.topRatedForm || "N/A"}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <ThumbsUp className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600">{(summary.topRating || 0).toFixed(1)} / 5.0 Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-white border-l-4 border-l-green-500">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Highest Sentiment</p>
                  <p className="text-lg font-bold text-gray-900 line-clamp-1">{summary.topSentimentForm || "N/A"}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Activity className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-bold text-green-600">{((summary.topSentiment || 0) * 100).toFixed(0)}% Positive Vibes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 🔹 Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8 pb-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                <CardTitle className="text-lg font-bold text-gray-800">Participation by Form</CardTitle>
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Responses received per training session</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(value) => participationData.find(d => d.name === value)?.fullName || value}
                    />
                    <Bar dataKey="responses" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8 pb-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                <CardTitle className="text-lg font-bold text-gray-800">Sentiment Distribution</CardTitle>
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Global sentiment across all forms</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Detailed List View */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Training Forms List</h2>
            <Link to="/admin/forms" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center">
              Create New <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.isArray(forms) && forms.filter(f => f && f.id).map((form) => {
              const formSentiment = Array.isArray(sentimentData) ? sentimentData.find(s => s && s.formId === form.id) : null;
              return (
                <Card 
                  key={form.id} 
                  className="group border-none shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden cursor-pointer bg-white"
                  onClick={() => navigate(`/admin/analytics/${form.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 p-2 rounded-xl group-hover:bg-blue-600 transition-colors">
                        <Activity className="w-5 h-5 text-blue-600 group-hover:text-white" />
                      </div>
                      {formSentiment && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                          formSentiment.category === 'Very Positive' ? 'bg-green-100 text-green-700' :
                          formSentiment.category === 'Positive' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {formSentiment.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{form.title}</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[40px]">{form.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Responses</span>
                          <span className="text-sm font-bold text-gray-800">
                            {Array.isArray(responseCounts) ? (responseCounts.find(r => r && r.form === form.title)?.responses || 0) : 0}
                          </span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


