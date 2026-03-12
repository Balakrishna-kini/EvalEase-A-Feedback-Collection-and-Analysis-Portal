import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Star,
  Type,
  CheckSquare,
  Circle,
  Save,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

type InputTypes = "rating" | "text" | "textarea" | "multiple" | "checkbox";

type Question = {
  id?: number;
  type: InputTypes;
  title: string;
  required: boolean;
  options: string[];
  ratingScale: number | null;
};

type QuestionType = {
  type: InputTypes;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const FormBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [category, setCategory] = useState<string>("General");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      fetchFormDetails();
    }
  }, [id]);

  const fetchFormDetails = async () => {
    const apiBaseUrl = API_BASE_URL;
    const token = localStorage.getItem('token');
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/forms/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch form details");
      const data = await res.json();
      
      setFormTitle(data.title);
      setFormDescription(data.description || "");
      setCategory(data.category || "General");
      
      if (data.deadline) {
        // Convert ISO to datetime-local format (YYYY-MM-DDThh:mm)
        const date = new Date(data.deadline);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDeadline(localDateTime);
      }
      
      setQuestions(data.questions.map((q: any) => ({
        ...q,
        options: q.options || []
      })));
    } catch (err) {
      console.error("Error fetching form:", err);
      toast.error("Failed to load form details");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ["General", "Technical", "Soft Skills", "Product Training", "Onboarding", "Quarterly Review"];

  const questionTypes: QuestionType[] = [
    { type: "rating", label: "Rating Scale", icon: Star },
    { type: "text", label: "Text Input", icon: Type },
    { type: "textarea", label: "Long Text", icon: Type },
    { type: "multiple", label: "Multiple Choice", icon: Circle },
    { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
  ];

  const addQuestion = (type: InputTypes) => {
    const newQuestion = {
      id: Date.now(),
      type,
      title: "Untitled question",
      required: false,
      options: type === "multiple" || type === "checkbox" ? ["Option 1"] : [],
      ratingScale: type === "rating" ? 5 : null,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: number | undefined, field: keyof Question, value: any) => {
    if (id === undefined) return;
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const deleteQuestion = (id: number | undefined) => {
    if (id === undefined) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addOption = (questionId: number | undefined) => {
    if (questionId === undefined) return;
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    );
  };

  const updateOption = (
    questionId: number | undefined,
    optionIndex: number,
    value: any
  ) => {
    if (questionId === undefined) return;
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const deleteOption = (questionId: number | undefined, optionIndex: number) => {
    if (questionId === undefined) return;
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    );
  };

  const saveForm = async () => {
    const apiBaseUrl = API_BASE_URL;
    if (!apiBaseUrl) {
      console.error("API_BASE_URL is not defined in config.ts");
      toast.error("Server configuration error. Please contact admin.");
      return;
    }

    if (!formTitle) {
      alert("Form title is required.");
      return;
    }

    if (!questions.length || questions.length === 0) {
      alert("Add at least one input field to the form.");
      return;
    }

    // Check for empty/invalid question titles
    for (const question of questions) {
      if (!question.title.trim()) {
        alert("Each question must have a valid title (non-empty).");
        return;
      }

      // Check for empty options in multiple/checkbox type
      if (
        (question.type === "multiple" || question.type === "checkbox") &&
        (!question.options.length ||
          question.options.some((opt) => !opt.trim()))
      ) {
        alert(
          `Question "${question.title}" has empty or missing options. Please fill all options.`
        );
        return;
      }
    }

    const formData = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: category,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      questions,
      createdAt: isEditMode ? undefined : new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('token');
      const url = isEditMode ? `${apiBaseUrl}/api/forms/${id}` : `${apiBaseUrl}/api/forms`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 409) {
        const errData = await res.json();
        alert(errData.error || "Form title already exists.");
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'save'} form`);
      }

      toast.success(`Form ${isEditMode ? 'updated' : 'saved'} successfully! 🎉`);

      // redirect back one step
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'saving'} form:`, err);
      toast.error(`Failed to ${isEditMode ? 'update' : 'save'} form`);
    }
  };

  const renderQuestionEditor = (question: Question) => {
    return (
      <div
        key={question.id}
        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter question title"
              value={question.title}
              onChange={(e) =>
                updateQuestion(question.id, "title", e.target.value)
              }
              className="w-full text-lg font-medium border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:border-blue-500 focus:outline-none pb-2"
            />
          </div>
          <button
            onClick={() => deleteQuestion(question.id)}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Type: {questionTypes.find((t) => t.type === question.type)?.label}
          </span>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) =>
                updateQuestion(question.id, "required", e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Required</span>
          </label>
        </div>

        {question.type === "rating" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating Scale (1 to {question.ratingScale})
            </label>
            <select
              value={question.ratingScale || 5}
              onChange={(e) =>
                updateQuestion(
                  question.id,
                  "ratingScale",
                  parseInt(e.target.value)
                )
              }
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
            >
              <option value={5}>1 to 5</option>
              <option value={10}>1 to 10</option>
            </select>
          </div>
        )}

        {(question.type === "multiple" || question.type === "checkbox") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      updateOption(question.id, index, e.target.value)
                    }
                    className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
                  />
                  {question.options.length > 1 && (
                    <button
                      onClick={() => deleteOption(question.id, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addOption(question.id)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Option</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Editor</span>
                </button>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Form Preview
              </h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {formTitle || "Untitled Form"}
            </h1>
            {formDescription && (
              <p className="text-gray-600 dark:text-gray-400 mb-8">{formDescription}</p>
            )}

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {index + 1}. {question.title || "Untitled Question"}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>

                  {question.type === "rating" && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {[...Array(question.ratingScale || 5)].map((_, i) => (
                        <button
                          key={i}
                          className="flex-shrink-0 w-10 h-10 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === "text" && (
                    <input
                      type="text"
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
                      placeholder="Your answer..."
                      disabled
                    />
                  )}

                  {question.type === "textarea" && (
                    <textarea
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
                      rows={4}
                      placeholder="Your answer..."
                      disabled
                    />
                  )}

                  {question.type === "multiple" && (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            disabled
                            className="text-blue-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "checkbox" && (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-2"
                        >
                          <input type="checkbox" disabled className="text-blue-600 rounded" />
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={saveForm}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>{isEditMode ? 'Update' : 'Save'} Form</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Edit Feedback Form' : 'Create New Form'}
        </h1>

        {/* Form Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Form Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Form Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter form title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Submission Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter form description"
              />
            </div>
          </div>
        </div>

        {/* Question Types */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Add Questions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {questionTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => addQuestion(type.type)}
                className="flex flex-col items-center space-y-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition duration-200"
              >
                <type.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question) => renderQuestionEditor(question))}

          {questions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
              <Type className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No questions added yet. Add your first question above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
