import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getSessionAnalytics,
  getQuestions,
  getAverageSentiment,
  getResponseCount
} from '@/services/api';
import RatingChart from '../analytics/RatingChart';
import McqChart from '../analytics/McqChart';
import DonutChart from '../analytics/DonutChart';
import HalfDonutChart from './HalfDonutChart';
import ParagraphChart from './ParagraphChart';

interface AnalyticsData {
  formId: number;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Assuming getSessionAnalytics now returns the complete data structure
        const response = await getSessionAnalytics(formId!);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading) {
    return <div className="p-6">Loading analytics data...</div>;
  }

  if (!analyticsData) {
    return <div className="p-6">No analytics data available for this form.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics for Form {formId}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Form ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{analyticsData.formId}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analyticsData.questionCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.totalResponses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.sentiment.polarity} ({analyticsData.averageSentiment.toFixed(1)})
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Improvement suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Questions */}
      {analyticsData.questions.some(q => q.questionType === 'rating') && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Rating Questions</h2>
          <div className="grid grid-cols-1 gap-6">
            {analyticsData.questions
              .filter(q => q.questionType === 'rating')
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{question.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RatingChart data={question.optionCounts} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Textarea Questions with Sentiment */}
      {analyticsData.questions.some(q => q.questionType === 'textarea') && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Text Responses Sentiment</h2>
          <div className="grid grid-cols-1 gap-6">
            {analyticsData.questions
              .filter(q => q.questionType === 'textarea')
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{question.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonutChart data={question.optionCounts} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Multiple Choice Questions */}
      {analyticsData.questions.some(q => q.questionType === 'multiple') && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Multiple Choice Questions</h2>
          <div className="grid grid-cols-1 gap-6">
            {analyticsData.questions
              .filter(q => q.questionType === 'multiple')
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{question.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <McqChart data={question.optionCounts} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Checkbox Questions */}
      {analyticsData.questions.some(q => q.questionType === 'checkbox') && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Checkbox Questions</h2>
          <div className="grid grid-cols-1 gap-6">
            {analyticsData.questions
              .filter(q => q.questionType === 'checkbox')
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{question.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HalfDonutChart data={question.optionCounts} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Textarea Questions (Sentiment) */}
      {analyticsData.questions.some(q => q.questionType === 'textarea') && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Text Responses</h2>
          <div className="grid grid-cols-1 gap-6">
            {analyticsData.questions
              .filter(q => q.questionType === 'textarea')
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{question.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ParagraphChart data={question.optionCounts} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionAnalytics;