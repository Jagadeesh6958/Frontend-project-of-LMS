import React, { useState, useEffect, useContext } from 'react';
import { BookOpen, CheckCircle, PlayCircle, FileCheck, FileText, Loader2, Download, MessageSquare, UploadCloud, ArrowLeft } from 'lucide-react';
import { api } from '../services/api.js';
import { AuthContext, ToastContext } from '../context/Contexts.jsx';
import { Button, Card, Badge, Input } from '../components/UI.jsx';

export const Dashboard = ({ onNavigate }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (user.role === 'admin') {
        const s = await api.getStats();
        setStats(s);
      } else {
        const enrollments = await api.getStudentEnrollments(user.id);
        setMyCourses(enrollments);

        // Load recommended courses (not enrolled yet)
        const allCourses = await api.getCourses();
        const enrolledIds = enrollments.map(e => String(e.course.id));
        const notEnrolled = allCourses.filter(c => !enrolledIds.includes(String(c.id)));
        setRecommended(notEnrolled.slice(0, 3)); // Top 3
      }
    };
    loadData();
  }, [user]);

  if (user.role === 'admin') {
    if (!stats) return <Loader2 className="animate-spin mx-auto mt-10" />;
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-gray-500">Students</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-500">Courses</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-500">Active Enrollments</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeEnrollments}</div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-900 cursor-pointer hover:shadow-md" onClick={() => onNavigate('admin-courses')}>
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Manage Courses & Content</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">Create new courses, add lessons, create assignments, and grade submissions.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-900 cursor-pointer hover:shadow-md" onClick={() => onNavigate('admin-students')}>
            <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Students Register</h3>
            <p className="text-sm text-purple-700 dark:text-purple-400">View list of all registered students and their details.</p>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  const completedCount = myCourses.filter(c => c.progress === 100).length;
  const inProgressCount = myCourses.length - completedCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-300"><BookOpen size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressCount}</div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-300"><CheckCircle size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300"><FileCheck size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount * 2}</div>
            <div className="text-sm text-gray-500">Certificates</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: My Learning */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Learning</h2>
            <Button variant="ghost" onClick={() => onNavigate('student-browse')}>Browse Catalog</Button>
          </div>

          {myCourses.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500 mb-4">You are not enrolled in any courses yet.</p>
              <Button onClick={() => onNavigate('student-browse')}>Find a Course</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myCourses.map(e => (
                <Card key={e.id} className="flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow">
                  <div className="sm:w-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4">
                    <BookOpen size={32} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{e.course.title}</h3>
                        <Badge>{e.progress}%</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">{e.course.description}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${e.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={() => onNavigate(`classroom/${e.courseId}`)}>
                        {e.progress > 0 ? 'Continue' : 'Start'} Learning
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Recommended */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recommended for You</h2>
          <div className="space-y-4">
            {recommended.length === 0 ? (
              <p className="text-gray-500 text-sm">No new recommendations.</p>
            ) : (
              recommended.map(c => (
                <Card key={c.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => onNavigate('student-browse')}>
                  <Badge color="blue" className="mb-2">{c.category}</Badge>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.description}</p>
                  <div className="flex items-center text-xs text-blue-600 font-medium">
                    View Details <ArrowLeft className="rotate-180 ml-1 w-3 h-3" />
                  </div>
                </Card>
              ))
            )}
          </div>

          <Card className="mt-8 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
            <h3 className="font-bold text-lg mb-2">Premium Access</h3>
            <p className="text-sm opacity-90 mb-4">Unlock all features and get unlimited access to all courses.</p>
            <Button variant="secondary" className="w-full border-none bg-white text-indigo-600 hover:bg-gray-100">Upgrade Now</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const StudentBrowse = ({ onNavigate }) => {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const allCourses = await api.getCourses();
      const myEnrollments = await api.getStudentEnrollments(user.id);
      setCourses(allCourses);
      setEnrolledIds(myEnrollments.map(e => String(e.course.id)));
    };
    fetchData();
  }, [user.id]);

  const handleEnroll = async (id) => {
    try {
      await api.enroll(user.id, id);
      addToast('Enrolled successfully!');
      setEnrolledIds(prev => [...prev, String(id)]); // Update local state immediately
    } catch (e) {
      addToast(e.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* UPDATED: Added Back Button */}
      <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="mb-4 pl-0">
        <ArrowLeft size={16} /> Back to Dashboard
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Browse Courses</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map(c => {
          const isEnrolled = enrolledIds.includes(String(c.id));
          return (
            <Card key={c.id} className="flex flex-col h-full">
              <div className="p-6 flex-1">
                <Badge>{c.category}</Badge>
                <h3 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{c.description}</p>
              </div>
              <div className="p-6 pt-0 mt-auto border-t dark:border-gray-700">
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500 uppercase">{c.content ? c.content.length : 0} Lessons</span>
                  {isEnrolled ? (
                    <Button variant="secondary" disabled className="opacity-70 cursor-not-allowed">
                      <CheckCircle size={16} className="mr-2" /> Enrolled
                    </Button>
                  ) : (
                    <Button onClick={() => handleEnroll(c.id)}>Enroll Now</Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const Classroom = ({ courseId, onNavigate }) => {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [course, setCourse] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);
  const [submission, setSubmission] = useState('');
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const c = await api.getCourse(courseId);
      const enrollments = await api.getStudentEnrollments(user.id);
      const myEnrollment = enrollments.find(e => String(e.courseId) === String(courseId));
      const subs = await api.getMySubmissions(user.id);

      setCourse(c);
      if (c && c.content && c.content.length > 0) setActiveItem(c.content[0]);
      if (myEnrollment) setCompletedItems(myEnrollment.completedItems);
      setMySubmissions(subs);
      setLoading(false);
    };
    load();
  }, [courseId, user.id]);

  const handleComplete = async () => {
    await api.updateProgress(user.id, courseId, activeItem.id);
    setCompletedItems([...completedItems, activeItem.id]);
    addToast('Lesson marked as complete!');
  };

  // PDF Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        addToast('Only PDF files are allowed.', 'error');
        return;
      }
      if (file.size > 200 * 1024) { // 200KB limit for localStorage safety
        addToast('File too large (Limit: 200KB).', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubmission(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submission) return;
    await api.submitAssignment(user.id, activeItem.id, submission);
    addToast('Assignment submitted successfully!');
    setSubmission('');
    const subs = await api.getMySubmissions(user.id);
    setMySubmissions(subs);
    handleComplete();
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.comment.trim()) { addToast('Please add a comment', 'error'); return; }
    await api.submitFeedback(courseId, user.id, parseInt(feedback.rating), feedback.comment);
    addToast('Review submitted!');
    setShowFeedbackModal(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  if (!course) return <div className="p-8">Course not found.</div>;

  const activeSubmission = mySubmissions.find(s => s.assignmentId === activeItem?.id);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b dark:border-gray-700">
          <button onClick={() => onNavigate('dashboard')} className="text-xs text-blue-600 mb-2 hover:underline">← Back to Dashboard</button>
          <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{course.title}</h2>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.round((completedItems.length / (course.content ? course.content.length : 1)) * 100)}%` }}></div>
          </div>
          <Button variant="secondary" className="w-full text-xs py-1" onClick={() => setShowFeedbackModal(true)}>
            <MessageSquare size={14} className="mr-2" /> Rate Course
          </Button>
        </div>
        <div className="flex-1">
          {(course.content || []).map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`w-full text-left p-4 flex items-center gap-3 border-b dark:border-gray-700 transition-colors ${activeItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <div className="text-gray-400">
                {completedItems.includes(item.id) ? <CheckCircle size={18} className="text-green-500" /> :
                  (item.type === 'video' ? <PlayCircle size={18} /> : (item.type === 'assignment' ? <FileCheck size={18} /> : (item.type === 'pdf' ? <FileText size={18} /> : <FileText size={18} />)))}
              </div>
              <div>
                <p className={`text-sm font-medium ${activeItem?.id === item.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>{item.title}</p>
                <p className="text-xs text-gray-500 capitalize">{item.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          {activeItem ? (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                <div>
                  <Badge color={activeItem.type === 'assignment' ? 'purple' : (activeItem.type === 'pdf' ? 'red' : 'blue')}>{activeItem.type}</Badge>
                  <h1 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{activeItem.title}</h1>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                {/* VIDEO PLAYER */}
                {activeItem.type === 'video' && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center text-white mb-4 shadow-lg">
                    <iframe
                      src={activeItem.url}
                      title={activeItem.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* PDF VIEWER / DOWNLOADER (Course Material) */}
                {activeItem.type === 'pdf' && (
                  <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-8 text-center">
                    <FileText size={48} className="mx-auto text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{activeItem.title}</h3>
                    <p className="text-gray-500 mb-6">Course Material (PDF)</p>
                    <div className="flex justify-center gap-4">
                      <a
                        href={activeItem.url}
                        download={activeItem.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                      >
                        <Download size={20} /> View / Download PDF
                      </a>
                    </div>
                  </div>
                )}

                {activeItem.type === 'text' && <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{activeItem.body}</p>}

                {/* ASSIGNMENT LOGIC */}
                {activeItem.type === 'assignment' && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
                    <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Instructions</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{activeItem.description}</p>

                    {!activeSubmission ? (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Assignment (PDF)</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="assignment-upload" />
                          <label htmlFor="assignment-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
                            <UploadCloud size={32} />
                            <span className="text-sm">Click to upload PDF</span>
                          </label>
                          {submission && submission.startsWith('data:application/pdf') && (
                            <p className="text-xs text-green-600 mt-2 font-medium flex items-center justify-center gap-1">
                              <CheckCircle size={12} /> PDF Selected
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button onClick={handleSubmitAssignment} disabled={!submission}>Submit Assignment</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600 font-medium bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
                          <CheckCircle size={20} /> Assignment Submitted
                        </div>
                        {activeSubmission.grade ? (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Instructor Feedback</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-500">Grade:</span>
                              <Badge color={activeSubmission.grade >= 50 ? 'green' : 'red'}>{activeSubmission.grade} / 100</Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded italic">"{activeSubmission.feedback || 'No written feedback.'}"</p>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">Pending grading by instructor...</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MARK COMPLETE BUTTON */}
              {activeItem.type !== 'assignment' && !completedItems.includes(activeItem.id) && (
                <Button onClick={handleComplete} className="w-full sm:w-auto">Mark as Completed</Button>
              )}
            </Card>
          ) : <div className="text-center text-gray-500 mt-10">Select a lesson from the sidebar to begin.</div>}
        </div>
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Rate this Course</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
              <select
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={feedback.rating}
                onChange={e => setFeedback({ ...feedback, rating: e.target.value })}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <Input multiline label="Comments" placeholder="Share your experience..." value={feedback.comment} onChange={e => setFeedback({ ...feedback, comment: e.target.value })} required />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
              <Button onClick={handleSubmitFeedback}>Submit Review</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};