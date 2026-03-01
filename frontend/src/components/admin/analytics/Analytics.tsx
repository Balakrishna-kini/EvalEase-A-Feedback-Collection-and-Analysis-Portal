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
  ThumbsUp,
  QrCode,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ThemeSwitcher from "../../ThemeSwitcher";
import { API_BASE_URL } from "../../../config";

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
  const [showQrModal, setShowQrModal] = useState<string | null>(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (showSubmissionsModal) {
      setLoadingSubmissions(true);
      const token = localStorage.getItem('token');
      fetch(`${API_BASE_URL}/api/analytics/forms/${showSubmissionsModal.id}/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setSubmissions(data))
        .catch(err => console.error("Failed to fetch submissions", err))
        .finally(() => setLoadingSubmissions(false));
    }
  }, [showSubmissionsModal]);

  const handleExportCSV = (formId: number, title: string) => {
    const token = localStorage.getItem('token');
    window.location.href = `${API_BASE_URL}/api/analytics/forms/${formId}/export/csv?access_token=${token}`;
  };

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

  const isDeadlinePassed = (deadline: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-12">
      {/* Sticky Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 mb-8">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/admin/dashboard" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 font-medium border-l dark:border-gray-700 pl-4">
              <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              <span>Live System Metrics</span>
            </div>
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
          
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Overall Responses</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {summary?.totalResponses || (Array.isArray(responseCounts) ? responseCounts.reduce((acc, curr) => acc + (curr?.responses || 0), 0) : 0)}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-xl">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Global Avg. Sentiment</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {(globalAvgSentiment * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights Row */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-gray-800 border-l-4 border-l-amber-500 transition-colors">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Top Rated Session</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{summary.topRatedForm || "N/A"}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <ThumbsUp className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{(summary.topRating || 0).toFixed(1)} / 5.0 Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-gray-800 border-l-4 border-l-green-500 transition-colors">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Highest Sentiment</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{summary.topSentimentForm || "N/A"}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Activity className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">{((summary.topSentiment || 0) * 100).toFixed(0)}% Positive Vibes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 🔹 Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-gray-800 transition-colors">
            <CardHeader className="px-8 pt-8 pb-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">Participation by Form</CardTitle>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">Responses received per training session</p>
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

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-gray-800 transition-colors">
            <CardHeader className="px-8 pt-8 pb-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">Sentiment Distribution</CardTitle>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">Global sentiment across all forms</p>
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
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Training Forms List</h2>
            <Link to="/admin/forms" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
              Create New <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.isArray(forms) && forms.filter(f => f && f.id).map((form) => {
              const formSentiment = Array.isArray(sentimentData) ? sentimentData.find(s => s && s.formId === form.id) : null;
              const deadlinePassed = isDeadlinePassed(form.deadline);
              
              return (
                <Card 
                  key={form.id} 
                  className="group border-none shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl group-hover:bg-blue-600 transition-colors">
                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                      </div>
                      <div className="flex space-x-2">
                        {form.category && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {form.category}
                          </span>
                        )}
                        {formSentiment && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                            formSentiment.category === 'Very Positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            formSentiment.category === 'Positive' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                            'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {formSentiment.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{form.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">{form.description}</p>
                    
                    {form.deadline && (
                      <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider mb-4 ${deadlinePassed ? 'text-red-500' : 'text-amber-500'}`}>
                        {deadlinePassed ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                        <span>{deadlinePassed ? 'Closed' : `Ends: ${new Date(form.deadline).toLocaleDateString()}`}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t dark:border-gray-700">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowQrModal(form.id); }}
                        className="flex items-center justify-center space-x-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-all text-xs font-bold"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>QR Code</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleExportCSV(form.id, form.title); }}
                        className="flex items-center justify-center space-x-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-300 hover:text-green-600 transition-all text-xs font-bold"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowSubmissionsModal(form); }}
                        className="flex items-center space-x-2 group/sub"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Responses</span>
                          <span className="text-sm font-bold text-gray-800 dark:text-white flex items-center">
                            {Array.isArray(responseCounts) ? (responseCounts.find(r => r && r.form === form.title)?.responses || 0) : 0}
                            <Users className="w-3 h-3 ml-1 text-blue-500 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                          </span>
                        </div>
                      </button>
                      <div 
                        onClick={() => navigate(`/admin/analytics/${form.id}`)}
                        className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🔹 QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-white dark:bg-gray-800 border-none rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="p-8 pb-4 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold dark:text-white">Form QR Code</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Share this code with participants to collect feedback instantly.</p>
            </CardHeader>
            <CardContent className="p-8 pt-4 flex flex-col items-center">
              <div className="bg-white p-6 rounded-3xl shadow-inner mb-8">
                <QRCodeSVG 
                  value={`${window.location.origin}/employee/forms/${showQrModal}`} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button 
                onClick={() => setShowQrModal(null)}
                className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-all"
              >
                Close Preview
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🔹 Submissions Tracking Modal */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 border-none rounded-3xl shadow-2xl animate-in fade-in duration-200">
            <CardHeader className="p-8 border-b dark:border-gray-700 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold dark:text-white">Submission Tracking</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tracking for: {showSubmissionsModal.title}</p>
              </div>
              <button onClick={() => setShowSubmissionsModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <Zap className="w-6 h-6 rotate-45" />
              </button>
            </CardHeader>
            <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
              {loadingSubmissions ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <Activity className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">Loading participant list...</p>
                </div>
              ) : (
                <div className="divide-y dark:divide-gray-700">
                  {submissions.length > 0 ? (
                    submissions.map((sub, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                            {sub.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{sub.employeeName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{sub.employeeEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-green-600 font-bold text-[10px] uppercase tracking-widest mb-1">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Submitted
                          </div>
                          <p className="text-xs text-gray-400">{new Date(sub.submittedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-bold">No submissions yet</p>
                      <p className="text-sm text-gray-400">Participants who complete the form will appear here.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <div className="p-6 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <button 
                onClick={() => setShowSubmissionsModal(null)}
                className="w-full py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                Close List
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;export default Analytics;


