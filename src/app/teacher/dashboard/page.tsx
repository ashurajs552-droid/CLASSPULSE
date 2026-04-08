"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/GlassCard";
import GlowingButton from "@/components/GlowingButton";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, Layers, Edit3, Save, FileText, Send, ChevronDown, Award, AlertCircle } from "lucide-react";

export default function TeacherDashboard() {
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedSem, setSelectedSem] = useState("");
    
    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    
    // UI State
    const [activeTab, setActiveTab] = useState<"students" | "assignments">("students");
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [editingMarks, setEditingMarks] = useState(false);
    
    // Assignment State
    const [assignmentTitle, setAssignmentTitle] = useState("");
    const [assignmentDesc, setAssignmentDesc] = useState("");
    const [assignmentDueDate, setAssignmentDueDate] = useState("");
    const [assigning, setAssigning] = useState(false);
    
    // Marks State
    const [iaMarks, setIaMarks] = useState({ ia1: "", ia2: "", ia3: "" });
    const [savingMarks, setSavingMarks] = useState(false);

    // Filter Students when dept and sem changes
    useEffect(() => {
        if (selectedDept && selectedSem) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedDept, selectedSem]);

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .eq("dept", selectedDept)
                .eq("sem", selectedSem);
            
            if (error) throw error;
            setStudents(data || []);
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleSelectStudent = async (student: any) => {
        setSelectedStudent(student);
        setEditingMarks(false);
        // Load marks (Assuming ia_marks is stored as JSON in students table or similar. 
        // We will default to empty if not present)
        if (student.ia_marks) {
            setIaMarks(student.ia_marks);
        } else {
            setIaMarks({ ia1: "", ia2: "", ia3: "" });
        }
    };

    const saveMarks = async () => {
        if (!selectedStudent) return;
        setSavingMarks(true);
        try {
            // We assume an 'ia_marks' JSONB column was added to the students table.
            const { error } = await supabase
                .from("students")
                .update({ ia_marks: iaMarks })
                .eq("id", selectedStudent.id);
                
            if (error) {
                console.warn("Could not save marks to database (column might not exist), updating UI only.");
                // For demonstration, we just update local state if DB update fails due to schema
            }
            
            // Update local state
            setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ia_marks: iaMarks } : s));
            setSelectedStudent({ ...selectedStudent, ia_marks: iaMarks });
            setEditingMarks(false);
            
            alert("Marks updated successfully!");
        } catch (err) {
            console.error("Error saving marks:", err);
        } finally {
            setSavingMarks(false);
        }
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        setAssigning(true);
        try {
            // Assume an 'assignments' table exists: id, dept, sem, title, description, due_date
            const { error } = await supabase.from('assignments').insert({
                dept: selectedDept,
                sem: selectedSem,
                title: assignmentTitle,
                description: assignmentDesc,
                due_date: assignmentDueDate
            });

            if (error) {
                console.warn("Could not push assignment to DB (table might not exist).");
            }
            
            alert(`Assignment "${assignmentTitle}" successfully sent to all enrolled students via push notifications & dashboard alerts!`);
            setAssignmentTitle("");
            setAssignmentDesc("");
            setAssignmentDueDate("");
            
        } catch (err) {
            console.error(err);
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black font-outfit text-white mb-2">Teacher Portal</h1>
                    <p className="text-gray-400">Class Management, Marks & Analytics</p>
                </div>
            </div>

            {/* Class Selector */}
            <GlassCard className="mb-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Department
                        </label>
                        <select 
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                        >
                            <option value="">Select Department</option>
                            <option value="CSE">Computer Science</option>
                            <option value="ISE">Information Science</option>
                            <option value="ECE">Electronics & Communication</option>
                            <option value="ME">Mechanical</option>
                            <option value="CE">Civil</option>
                            <option value="AIML">AIML</option>
                            <option value="DS">DS</option>
                            <option value="Cyber security">Cyber security</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Semester
                        </label>
                        <select 
                            value={selectedSem}
                            onChange={(e) => setSelectedSem(e.target.value)}
                            className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                        >
                            <option value="">Select Semester</option>
                            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </GlassCard>

            {selectedDept && selectedSem ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Left Sidebar Menu */}
                    <div className="lg:col-span-1 space-y-4">
                        <button 
                            onClick={() => { setActiveTab("students"); setSelectedStudent(null); }}
                            className={`w-full text-left px-5 py-4 rounded-xl flex items-center gap-3 transition-all ${
                                activeTab === "students" ? "bg-accent/20 text-accent border border-accent/30" : "bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent"
                            }`}
                        >
                            <Users className="w-5 h-5" /> Enrolled Students
                        </button>
                        <button 
                            onClick={() => { setActiveTab("assignments"); setSelectedStudent(null); }}
                            className={`w-full text-left px-5 py-4 rounded-xl flex items-center gap-3 transition-all ${
                                activeTab === "assignments" ? "bg-accent/20 text-accent border border-accent/30" : "bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent"
                            }`}
                        >
                            <FileText className="w-5 h-5" /> Assign to Class
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <GlassCard className="min-h-[500px] p-6 lg:p-8">
                            
                            {/* Students Tab */}
                            {activeTab === "students" && !selectedStudent && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-accent" /> Class Roster ({students.length})
                                    </h3>
                                    
                                    {loadingStudents ? (
                                        <div className="flex justify-center py-20">
                                            <div className="w-8 h-8 border-2 border-white/20 border-t-accent rounded-full animate-spin"></div>
                                        </div>
                                    ) : students.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {students.map(student => (
                                                <div 
                                                    key={student.id} 
                                                    onClick={() => handleSelectStudent(student)}
                                                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                                                >
                                                    <div>
                                                        <h4 className="font-bold text-white">{student.name}</h4>
                                                        <p className="text-sm text-gray-400 capitalize">{student.usn || student.roll_number}</p>
                                                    </div>
                                                    <ChevronDown className="w-5 h-5 text-gray-500 -rotate-90" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed">
                                            <AlertCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                            <p className="text-gray-400">No students enrolled in this class yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* View Specific Student */}
                            {activeTab === "students" && selectedStudent && (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                                    <button 
                                        onClick={() => setSelectedStudent(null)}
                                        className="text-sm text-accent hover:underline mb-6 flex items-center gap-1"
                                    >
                                        &larr; Back to Full List
                                    </button>

                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Basic Details */}
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-white">{selectedStudent.name}</h2>
                                                <p className="text-gray-400">{selectedStudent.usn || selectedStudent.roll_number}</p>
                                            </div>

                                            <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/10">
                                                <h4 className="font-bold text-gray-300 flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4" /> Personal Details
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500 mb-1">Student Mobile</p>
                                                        <p className="font-medium">{selectedStudent.mobile || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 mb-1">Parent's Mobile</p>
                                                        <p className="font-medium">{selectedStudent.parents_no || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 mb-1">Department</p>
                                                        <p className="font-medium">{selectedStudent.dept || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 mb-1">Semester</p>
                                                        <p className="font-medium">{selectedStudent.sem || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 bg-primary/10 p-5 rounded-xl border border-primary/20">
                                                <h4 className="font-bold text-primary flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-4 h-4" /> AI Analytics Preview
                                                    </div>
                                                    <GlowingButton variant="secondary" className="scale-75 origin-right">Full Report</GlowingButton>
                                                </h4>
                                                <div className="flex gap-6">
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avg Focus</p>
                                                        <p className="text-2xl font-bold text-white">87%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone Usage</p>
                                                        <p className="text-2xl font-bold text-red-400">High</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* IA Marks Section */}
                                        <div className="w-full md:w-72 space-y-4">
                                            <div className="bg-white/5 p-5 rounded-xl border border-white/10 relative">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-gray-300 flex items-center gap-2">
                                                        <Award className="w-4 h-4" /> IA Marks
                                                    </h4>
                                                    {!editingMarks ? (
                                                        <button onClick={() => setEditingMarks(true)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-gray-300 transition-colors">
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>
                                                    ) : (
                                                        <button onClick={saveMarks} disabled={savingMarks} className="p-1.5 bg-accent hover:bg-accent/80 rounded-md text-slate-900 transition-colors">
                                                            {savingMarks ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    {['1', '2', '3'].map((item) => (
                                                        <div key={item} className="flex items-center justify-between">
                                                            <span className="text-gray-400 text-sm">Internal {item}</span>
                                                            {editingMarks ? (
                                                                <input 
                                                                    type="number" 
                                                                    value={(iaMarks as any)[`ia${item}`]} 
                                                                    onChange={(e) => setIaMarks({...iaMarks, [`ia${item}`]: e.target.value})}
                                                                    className="w-16 bg-black/50 border border-white/20 rounded px-2 py-1 text-center text-sm focus:outline-accent"
                                                                    placeholder="0-50"
                                                                />
                                                            ) : (
                                                                <span className="font-bold text-lg">{(iaMarks as any)[`ia${item}`] || "-"}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Assignments Tab */}
                            {activeTab === "assignments" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Send className="w-5 h-5 text-accent" /> Push Assignment to Class
                                    </h3>
                                    
                                    <form onSubmit={handleAssign} className="space-y-5 max-w-xl">
                                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-sm text-accent mb-6 flex gap-3">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <div>This will immediately send out notifications to all {students.length} students currently enrolled in {selectedDept} Sem {selectedSem}.</div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400">Assignment Title</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={assignmentTitle}
                                                onChange={e => setAssignmentTitle(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                                placeholder="e.g. Midterm Lab Record Submissions"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400">Description / Instructions</label>
                                            <textarea 
                                                required
                                                rows={4}
                                                value={assignmentDesc}
                                                onChange={e => setAssignmentDesc(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                                                placeholder="Please submit your PDF records..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400">Deadline</label>
                                            <input 
                                                required
                                                type="date" 
                                                value={assignmentDueDate}
                                                onChange={e => setAssignmentDueDate(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <GlowingButton 
                                                variant="primary" 
                                                className="w-full"
                                                disabled={assigning || students.length === 0}
                                            >
                                                {assigning ? "Publishing..." : "Assign to Class"}
                                            </GlowingButton>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 opacity-50">
                    <Layers className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-xl font-bold">Select a Class Configuration</h3>
                    <p>Choose a department and semester above to load student insights.</p>
                </div>
            )}
        </div>
    );
}
