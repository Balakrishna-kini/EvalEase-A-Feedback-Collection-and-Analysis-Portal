import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type InputTypes = "rating" | "text" | "textarea" | "multiple" | "checkbox";

type Question = {
  id: number;
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
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const navigate = useNavigate();

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

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addOption = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: any
  ) => {
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

  const deleteOption = (questionId: number, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    );
  };

  const saveForm = async () => {
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
      questions,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_PORT}/api/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 409) {
        const errData = await res.json();
        alert(errData.error || "Form title already exists.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to save form");
      }

      const data = await res.json();
      toast.success("Form saved successfully! 🎉");

      // redirect back one step
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Error saving form:", err);
      toast.error("Failed to save form");
    }
  };

  const renderQuestionEditor = (question: Question) => {
    return (
      <div
        key={question.id}
        className="border border-gray-200 rounded-lg p-6 bg-white"
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
              className="w-full text-lg font-medium border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none pb-2"
            />
          </div>
          <button
            onClick={() => deleteQuestion(question.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm text-gray-600">
            Type: {questionTypes.find((t) => t.type === question.type)?.label}
          </span>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) =>
                updateQuestion(question.id, "required", e.target.checked)
              }
            />
            <span className="text-sm text-gray-600">Required</span>
          </label>
        </div>

        {question.type === "rating" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating Scale (1 to {question.ratingScale})
            </label>
            <select
              value={question.ratingScale}
              onChange={(e) =>
                updateQuestion(
                  question.id,
                  "ratingScale",
                  parseInt(e.target.value)
                )
              }
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={5}>1 to 5</option>
              <option value={10}>1 to 10</option>
            </select>
          </div>
        )}

        {(question.type === "multiple" || question.type === "checkbox") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
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
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
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

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Editor</span>
                </button>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Form Preview
              </h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {formTitle || "Untitled Form"}
            </h1>
            {formDescription && (
              <p className="text-gray-600 mb-8">{formDescription}</p>
            )}

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {index + 1}. {question.title || "Untitled Question"}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>

                  {question.type === "rating" && (
                    <div className="flex space-x-2">
                      {[...Array(question.ratingScale)].map((_, i) => (
                        <button
                          key={i}
                          className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === "text" && (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Your answer..."
                      disabled
                    />
                  )}

                  {question.type === "textarea" && (
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                          />
                          <span>{option}</span>
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
                          <input type="checkbox" disabled />
                          <span>{option}</span>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={saveForm}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Form</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Form Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Form Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter form title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter form description"
              />
            </div>
          </div>
        </div>

        {/* Question Types */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add Questions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {questionTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => addQuestion(type.type)}
                className="flex flex-col items-center space-y-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition duration-200"
              >
                <type.icon className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
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
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <Type className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
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
