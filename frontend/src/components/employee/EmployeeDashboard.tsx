import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  FileText,
  LogOut,
  Calendar,
  Clock,
  ChevronRight,
  ClipboardList,
  History,
  Award,
  AlertCircle,
  Tag,
  Search,
  LayoutGrid,
  List as ListIcon,
  X,
  MessageCircle,
  TrendingUp,
  Download
} from "lucide-react";
import { API_BASE_URL } from "../../config";

interface DashboardForm {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  submittedAt: string | null;
  deadline: string | null;
  category: string | null;
}

interface SubmissionHistory {
  submissionId: number;
  formTitle: string;
  submittedAt: string;
  responses: Array<{
    question: string;
    answer: string;
    sentiment: number | null;
  }>;
}

const EmployeeDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [pendingForms, setPendingForms] = useState<DashboardForm[]>([]);
  const [completedForms, setCompletedForms] = useState<DashboardForm[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [errorForms, setErrorForms] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  
  // History Modal State
  const [history, setHistory] = useState<SubmissionHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<SubmissionHistory | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showCertificate, setShowCertificate] = useState<SubmissionHistory | null>(null);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const fetchEmployeeForms = useCallback(async () => {
    setLoadingForms(true);
    setErrorForms(null);

    if (!user?.id) {
      setErrorForms("Employee ID not found. Please log in.");
      setLoadingForms(false);
      return;
    }

    try {
      const apiBaseUrl = API_BASE_URL;
      const fetchUrl = `${apiBaseUrl}/api/employee-dashboard/forms/${user.id}`;
      const token = localStorage.getItem('token');
      
      const res = await fetch(fetchUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to fetch forms");
      const data = await res.json();
      setPendingForms(data.data.pendingForms || []);
      setCompletedForms(data.data.completedForms || []);
    } catch (err: any) {
      setErrorForms(`Error: ${err.message}`);
    } finally {
      setLoadingForms(false);
    }
  }, [user?.id]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/employee-dashboard/submissions/${user.id}/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchEmployeeForms();
  }, [fetchEmployeeForms]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const isExpired = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const filteredPending = pendingForms.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCompleted = completedForms.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const FormCard = ({ form, isPending }: { form: DashboardForm, isPending: boolean }) => {
    const expired = isExpired(form.deadline);
    
    return (
      <div className={`group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300 ${expired && isPending ? 'opacity-75' : ''}`}>
        <div className={`h-2 w-full ${isPending ? (expired ? 'bg-red-500' : 'bg-blue-500') : 'bg-emerald-500'}`} />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-xl ${isPending ? (expired ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
              {isPending ? <ClipboardList className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            </div>
            {form.category && (
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {form.category}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {form.title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6 h-10">
            {form.description || "Provide your valuable feedback for this session."}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
              <span>Created: {formatDate(form.createdAt)}</span>
            </div>
            {isPending ? (
              <div className={`flex items-center text-xs font-medium ${expired ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                <Clock className="h-3.5 w-3.5 mr-2" />
                <span>Deadline: {formatDate(form.deadline)} {expired && "(Expired)"}</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="h-3.5 w-3.5 mr-2" />
                <span>Submitted: {formatDate(form.submittedAt)}</span>
              </div>
            )}
          </div>

          {isPending ? (
            expired ? (
              <div className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                <AlertCircle className="h-4 w-4" />
                Closed
              </div>
            ) : (
              <Link
                to={`/employee/feedback/${form.id}`}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
              >
                Start Feedback
                <ChevronRight className="h-4 w-4" />
              </Link>
            )
          ) : (
            <button 
              onClick={() => {
                fetchHistory();
                const sub = history.find(h => h.formTitle === form.title);
                if (sub) setSelectedHistory(sub);
              }}
              className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <History className="h-4 w-4" />
              View Response
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  EvalEase
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Welcome, {user?.name || "Employee"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingForms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                <History className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedForms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {pendingForms.length + completedForms.length > 0 
                    ? Math.round((completedForms.length / (pendingForms.length + completedForms.length)) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search forms or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white text-sm"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}><ListIcon className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Content Section */}
        {loadingForms ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Syncing your feedback forms...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Required Feedback</h2>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-md">{filteredPending.length}</span>
              </div>
              {filteredPending.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredPending.map((form) => <FormCard key={form.id} form={form} isPending={true} />)}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-slate-900 dark:text-white font-semibold">All Caught Up!</h3>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submission History</h2>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-md">{filteredCompleted.length}</span>
              </div>
              {filteredCompleted.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredCompleted.map((form) => <FormCard key={form.id} form={form} isPending={false} />)}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm italic text-center py-12">No submissions yet.</p>
              )}
            </section>
          </div>
        )}
      </main>

      {/* History Detail Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedHistory.formTitle}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Submitted on {formatDate(selectedHistory.submittedAt)}
                </p>
              </div>
              <button onClick={() => setSelectedHistory(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                        <Award className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Completion Status</p>
                        <p className="text-emerald-900 dark:text-emerald-100 font-semibold">Feedback Successfully Verified</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowCertificate(selectedHistory)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
                >
                    <Download className="h-3.5 w-3.5" />
                    Certificate
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    Your Responses
                </h3>
                {selectedHistory.responses.map((resp, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-tight">Question {idx + 1}</p>
                    <p className="text-slate-900 dark:text-white font-medium mb-3">{resp.question}</p>
                    <div className="flex items-center justify-between">
                        <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 italic">
                            "{resp.answer}"
                        </div>
                        {resp.sentiment !== null && (
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${resp.sentiment > 0.6 ? 'bg-emerald-100 text-emerald-700' : resp.sentiment > 0.4 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                <TrendingUp className="h-3.5 w-3.5" />
                                {Math.round(resp.sentiment * 100)}%
                            </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
              <button onClick={() => setSelectedHistory(null)} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl print:shadow-none print:w-full print:max-w-none print:m-0 print:rounded-none">
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center print:hidden">
                    <button onClick={() => setShowCertificate(null)} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium">
                        <X className="h-4 w-4" /> Cancel
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                    >
                        <Download className="h-4 w-4" /> Save as PDF / Print
                    </button>
                </div>

                <div id="certificate-content" className="p-12 text-center bg-white relative print:p-8">
                    <div className="absolute inset-8 border-4 border-double border-slate-200 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-blue-50 rounded-full">
                                <Award className="h-16 w-16 text-blue-600" />
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2 uppercase tracking-widest">
                            Certificate of Participation
                        </h1>
                        <p className="text-slate-500 font-medium italic mb-8">Training Feedback Completion</p>
                        
                        <div className="mb-10">
                            <p className="text-slate-600 text-lg mb-2">This is to certify that</p>
                            <h2 className="text-2xl font-bold text-slate-900 underline decoration-blue-600/30 underline-offset-8">
                                {user?.name || "Valued Employee"}
                            </h2>
                        </div>

                        <div className="mb-10 px-12">
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Has successfully completed the professional evaluation for the training session:
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 mt-2">
                                {showCertificate.formTitle}
                            </h3>
                        </div>

                        <div className="flex justify-center items-center gap-12 mt-12 pt-8 border-t border-slate-100">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter mb-1">Date of Submission</p>
                                <p className="text-sm font-bold text-slate-700">{formatDate(showCertificate.submittedAt)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter mb-1">Verification ID</p>
                                <p className="text-sm font-bold text-slate-700">EV-{showCertificate.submissionId}-{user?.id || '000'}</p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="h-10 w-48 mx-auto flex items-center justify-center opacity-30 grayscale pointer-events-none">
                                <div className="h-0.5 w-full bg-slate-900" />
                                <span className="absolute px-4 bg-white text-[10px] font-bold uppercase tracking-widest">EvalEase Official</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden; }
                    #certificate-content, #certificate-content * { visibility: visible; }
                    #certificate-content { 
                        position: fixed !important; 
                        left: 0 !important; 
                        top: 0 !important; 
                        width: 100% !important; 
                        height: 100% !important; 
                        margin: 0 !important; 
                        padding: 2cm !important;
                        background: white !important;
                    }
                }
            `}} />
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;