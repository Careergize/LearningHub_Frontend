import { ArrowRight, BadgeCheck, BriefcaseBusiness, Search, Sparkles } from "lucide-react";

const featuredCourses = [
  { category: "CAREER CERTIFICATE", title: "Frontend Development", partner: "Careergize Academy", detail: "6 courses · Beginner friendly", color: "blue", icon: "⌘" },
  { category: "SPECIALIZATION", title: "Data Analytics", partner: "Careergize Academy", detail: "4 courses · Build a portfolio", color: "orange", icon: "▥" },
  { category: "GUIDED PROJECT", title: "AI & Machine Learning", partner: "Careergize Academy", detail: "Learn by building · Flexible", color: "violet", icon: "✳" },
];

export default function HeroSection() {
  return (
    <header className="landing-hero">
      <div className="landing-hero-inner">
        <div className="landing-hero-copy">
          <div className="hero-eyebrow"><Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Build skills.<br /><span>Build your future.</span></h1>
          <p className="hero-lede">Learn in-demand skills from expert-led courses, then put them to work with hands-on projects and career guidance.</p>
          <div className="hero-actions">
            <a href="#courses" className="hero-primary">Explore courses <ArrowRight size={18} /></a>
            <a href="/signup" className="hero-secondary">Join for free</a>
          </div>
          <div className="hero-proof"><span className="proof-avatars"><i>A</i><i>R</i><i>S</i><i>+</i></span><span><strong>Learn at your pace</strong><small>Practical lessons. Real career momentum.</small></span></div>
        </div>

        <div className="hero-course-panel">
          <div className="hero-panel-heading"><div><span className="panel-kicker">FIND YOUR DIRECTION</span><h2>Skills for what’s next</h2></div><span className="panel-spark"><Sparkles size={19} /></span></div>
          <label className="hero-search"><Search size={19} /><input aria-label="Search courses" placeholder="What do you want to learn?" /><kbd>↵</kbd></label>
          <div className="hero-suggestions"><span>Popular:</span><a href="#courses">Data analytics</a><a href="#courses">UX design</a><a href="#courses">AI</a></div>
          <div className="hero-featured-head"><span>Explore learning paths</span><a href="#courses">View all <ArrowRight size={14} /></a></div>
          <div className="hero-course-list">
            {featuredCourses.map((course) => <a href="#courses" className="hero-course-item" key={course.title}>
              <span className={`course-mark ${course.color}`}>{course.icon}</span><span className="course-info"><small>{course.category}</small><strong>{course.title}</strong><span>{course.partner} <b>·</b> {course.detail}</span></span><ArrowRight className="course-arrow" size={17} />
            </a>)}
          </div>
          <div className="hero-panel-foot"><BadgeCheck size={16} /> Learn practical skills with a clear path forward</div>
        </div>
      </div>
      <div className="hero-trust"><div className="trust-caption"><BriefcaseBusiness size={17} /> Skills employers value</div><div className="trust-names"><span>Google</span><span>Microsoft</span><span>amazon</span><span>Meta</span><span>IBM</span><span>Adobe</span></div></div>
    </header>
  );
}
