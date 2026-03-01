import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  HelpCircle, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Activity,
  Calendar,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { getSessionAnalytics, getSuggestions } from '@/services/api';
import RatingChart from '../analytics/RatingChart';
import McqChart from '../analytics/McqChart';
import DonutChart from '../analytics/DonutChart';
import HalfDonutChart from './HalfDonutChart';
import ParagraphChart from './ParagraphChart';

interface Suggestion {
  category: string;
  observation: string;
  actionableStep: string;
  priority: string;
}

interface AnalyticsData {
  formId: number;
  formTitle?: string;
  totalResponses: number;
  questionCount: number;
  averageRating: number;
  sentiment: {
    polarity: string;
    score: number;
  };
  questions: Array<{
    questionText: string;
    questionType: string;
    sectionName: string;
    optionCounts: { [key: string]: number };
  }>;
  averageSentiment: number;
}

const SessionAnalytics: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, suggestionsRes] = await Promise.all([
          getSessionAnalytics(Number(formId)),
          getSuggestions(Number(formId))
        ]);
        setAnalyticsData(analyticsRes?.data || null);
        setSuggestions(suggestionsRes?.data || []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-sm inline-block">
          <p className="text-gray-500 mb-4">No analytics data available for this form.</p>
          <Link to="/admin/analytics" className="text-blue-600 font-semibold hover:underline flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Overview
          </Link>
        </div>
      </div>
    );
  }

  const getSentimentColor = (score: number) => {
    if (score >= 0.5) return 'text-green-600 bg-green-50';
    if (score >= 0.2) return 'text-blue-600 bg-blue-50';
    if (score >= -0.2) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 mb-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin/analytics" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Form Insights</h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Form ID: {formId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">Live Data</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Modern Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalResponses}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <HelpCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Question Set</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.questionCount} Items</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{(analyticsData.averageRating || 0).toFixed(1)}/5.0</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${getSentimentColor(analyticsData.averageSentiment || 0)}`}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sentiment Score</p>
                <p className="text-2xl font-bold text-gray-900">{((analyticsData.averageSentiment || 0) * 100).toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Question Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.isArray(analyticsData?.questions) && analyticsData.questions.map((q, index) => (
            <Card key={index} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 border-b border-gray-50 px-8 py-6">
                <div className="flex items-start justify-between">
                  <div className="max-w-[80%]">
                    <CardTitle className="text-lg font-bold text-gray-800 leading-tight mb-2">
                      {q.questionText}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded tracking-wider">
                        {q.questionType}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl text-gray-400 font-bold text-xs">
                    Q{index + 1}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mt-4">
                  {q.questionType?.toLowerCase() === 'rating' && (
                    <RatingChart data={q.optionCounts || {}} />
                  )}
                  {(q.questionType?.toLowerCase() === 'multiple' || q.questionType?.toLowerCase() === 'radio') && (
                    <McqChart data={q.optionCounts || {}} />
                  )}
                  {q.questionType?.toLowerCase() === 'checkbox' && (
                    <HalfDonutChart data={q.optionCounts || {}} />
                  )}
                  {(q.questionType?.toLowerCase() === 'paragraph' || q.questionType?.toLowerCase() === 'text' || q.questionType?.toLowerCase() === 'textarea') && (
                    <DonutChart data={q.optionCounts || {}} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔹 Improvement Suggestions Section */}
        <div className="mt-12 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Improvement Suggestions</h2>
              <p className="text-sm text-gray-500">Actionable insights generated from participant feedback</p>
            </div>
          </div>

          {Array.isArray(suggestions) && suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion, idx) => (
                <Card key={idx} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        suggestion.priority === 'High' ? 'bg-red-100 text-red-700' :
                        suggestion.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {suggestion.priority} Priority
                      </span>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <Zap className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2">{suggestion.category}</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center space-x-2 mb-1">
                          <Activity className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Observation</span>
                        </div>
                        <p className="text-sm text-gray-600 italic">"{suggestion.observation}"</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <div className="flex items-center space-x-2 mb-1">
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Actionable Step</span>
                        </div>
                        <p className="text-sm text-blue-800 font-medium">{suggestion.actionableStep}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-sm rounded-3xl bg-white p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Analyzing feedback...</h3>
                <p className="text-gray-500">We're still processing the responses to generate meaningful suggestions. Check back shortly!</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionAnalytics;