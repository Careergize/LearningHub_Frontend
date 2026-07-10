import React from "react";
import { motion } from "motion/react";
import { Course } from "../types";

export default function CourseCatalog() {
  const [enrolledCourse, setEnrolledCourse] = React.useState<string | null>(null);

  const courses: Course[] = [
    {
      id: "course-1",
      title: "AI & Machine Learning Track",
      duration: "24 Weeks",
      rating: 4.9,
      isPopular: true,
      skills: ["Neural Networks", "NLP", "Gemini API", "Python"],
      imageUrl: "🧠"
    },
    {
      id: "course-2",
      title: "MERN Stack Mastery",
      duration: "16 Weeks",
      rating: 4.8,
      skills: ["React 19", "Node.js", "Express", "MongoDB"],
      imageUrl: "⚛️"
    },
    {
      id: "course-3",
      title: "Flutter Mobile Development",
      duration: "12 Weeks",
      rating: 4.7,
      skills: ["Dart", "Flutter SDK", "State Management", "Firebase"],
      imageUrl: "📱"
    },
    {
      id: "course-4",
      title: "Data Science Bootcamp",
      duration: "20 Weeks",
      rating: 4.9,
      skills: ["Data Pipelines", "Pandas", "D3.js Visualization", "SQL"],
      imageUrl: "📊"
    }
  ];

  const handleEnroll = (title: string) => {
    setEnrolledCourse(title);
    setTimeout(() => {
      setEnrolledCourse(null);
    }, 3500);
  };

  return (
    <section id="courses" className="py-20 bg-brand-surface/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">CURRICULUM CATALOG</div>
            <h2 className="font-sans font-extrabold text-3xl md:text-5xl text-brand-dark tracking-tight">
              Master Modern Careers
            </h2>
            <p className="font-sans text-sm md:text-base text-brand-dark/60 mt-1">
              Curated, highly focused career tracks built alongside top-tier technical recruiters.
            </p>
          </div>
          <button className="text-brand-primary font-sans font-bold text-sm flex items-center gap-1 hover:translate-x-1.5 transition-transform shrink-0 cursor-pointer">
            View All Core Tracks
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden border border-brand-dark/5 hover:border-brand-primary/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Header Visual */}
              <div className="h-44 relative bg-gradient-to-br from-brand-surface to-brand-primary/10 flex items-center justify-center text-5xl">
                <span>{course.imageUrl}</span>
                {course.isPopular && (
                  <span className="absolute top-4 left-4 bg-brand-primary text-white font-sans text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    Popular
                  </span>
                )}
                <span className="absolute bottom-4 right-4 bg-white/80 backdrop-blur text-brand-dark font-sans text-xs font-semibold px-2.5 py-1 rounded-full border border-white/50">
                  ★ {course.rating}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-sans font-extrabold text-brand-dark text-lg leading-snug mb-2">
                    {course.title}
                  </h4>
                  
                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.skills.map((skill, i) => (
                      <span key={i} className="bg-brand-surface text-brand-dark/60 font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-brand-dark/50 font-sans">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      {course.duration}
                    </span>
                    <span className="font-bold text-brand-primary">Verified Path</span>
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleEnroll(course.title)}
                    className="w-full py-3 bg-brand-surface text-brand-dark hover:bg-brand-primary hover:text-white font-sans font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Enroll Track
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enrollment Confirmation Popup */}
        {enrolledCourse && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-brand-dark text-white p-5 rounded-2xl shadow-2xl border border-white/10 z-50 flex items-center gap-4 max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined font-bold">check_circle</span>
            </div>
            <div>
              <h4 className="font-sans font-extrabold text-xs">Enrollment Successful!</h4>
              <p className="font-sans text-[11px] text-white/70 mt-0.5">
                You've successfully unlocked <span className="text-brand-primary-light font-bold">{enrolledCourse}</span>. Check your student email for initial roadmap instructions!
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
