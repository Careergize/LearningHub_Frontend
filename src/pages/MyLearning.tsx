import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Trophy,
  Brain,
  User,
  LogOut,
  ChevronRight,
  Clock,
  Award,
  Menu,
  X,
  Search,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  Share2,
  Download,
  GraduationCap,
  Layers,
  ArrowRight,
  Check,
  Compass,
  FileText,
  Bookmark,
  FileDown,
  Eye,
  Printer,
  ZoomIn,
  ZoomOut,
  Copy,
  ChevronLeft,
} from "lucide-react";

import careergizeLogo from "../assets/careergize-logo.jpeg";

/* =========================================================
   TYPES
========================================================= */

export type CourseStatus = "in_progress" | "completed";

export interface EnrolledCourse {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Pro";
  progress: number;
  completedLessons: number;
  totalLessons: number;
  icon: string;
  bannerGradient: string;
  accentColor: string;
  status: CourseStatus;
  instructor: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  duration: string;
  nextLessonTitle?: string;
  completedDate?: string;
  certificateId?: string;
  lastAccessed: string;
  skills: string[];
}

export interface NoteSection {
  heading: string;
  content: string;
  bulletPoints?: string[];
  keyHighlight?: string;
}

export interface NoteCodeSnippet {
  title: string;
  language: string;
  code: string;
}

export interface CourseNote {
  id: string;
  courseId: string;
  courseTitle: string;
  courseIcon: string;
  accentColor: string;
  moduleNumber: string;
  title: string;
  description: string;
  instructor: string;
  pages: number;
  fileSize: string;
  updatedDate: string;
  type: "Lecture Handout" | "Cheatsheet" | "Architecture Guide" | "Exam Prep";
  topics: string[];
  previewContent: {
    summary: string;
    tableOfContents: string[];
    keyTakeaways: string[];
    codeSnippets?: NoteCodeSnippet[];
    sections: NoteSection[];
  };
}

/* =========================================================
   MOCK DATA (Realistic & Easily Swappable With API)
========================================================= */

const initialEnrolledCourses: EnrolledCourse[] = [
  {
    id: "cg-course-101",
    title: "Python Full Stack Development",
    category: "Development",
    level: "Beginner",
    progress: 68,
    completedLessons: 17,
    totalLessons: 25,
    icon: "🐍",
    bannerGradient: "from-blue-600/10 via-cyan-500/10 to-brand-primary/10",
    accentColor: "#006399",
    status: "in_progress",
    instructor: {
      name: "Arun Krishnan",
      role: "Principal Architect, Cloud Systems",
      avatarInitials: "AK",
    },
    duration: "24 Weeks",
    nextLessonTitle: "Building Scalable REST APIs with Django & PostgreSQL",
    lastAccessed: "Yesterday",
    skills: ["Python", "Django", "PostgreSQL", "REST API", "Git"],
  },
  {
    id: "cg-course-102",
    title: "React & Modern Frontend",
    category: "Frontend",
    level: "Beginner",
    progress: 44,
    completedLessons: 11,
    totalLessons: 25,
    icon: "⚛️",
    bannerGradient: "from-cyan-500/10 via-sky-500/10 to-blue-600/10",
    accentColor: "#0284c7",
    status: "in_progress",
    instructor: {
      name: "Sarah Jenkins",
      role: "UI Systems Engineer",
      avatarInitials: "SJ",
    },
    duration: "16 Weeks",
    nextLessonTitle: "Component Architecture, Hooks & Modern State Management",
    lastAccessed: "3 hours ago",
    skills: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "Vite"],
  },
  {
    id: "cg-course-103",
    title: "AI & Generative AI",
    category: "Artificial Intelligence",
    level: "Beginner",
    progress: 100,
    completedLessons: 26,
    totalLessons: 26,
    icon: "🤖",
    bannerGradient: "from-purple-600/10 via-indigo-500/10 to-brand-primary/10",
    accentColor: "#7c3aed",
    status: "completed",
    instructor: {
      name: "Dr. David Chen",
      role: "AI Research Lead & Author",
      avatarInitials: "DC",
    },
    duration: "20 Weeks",
    completedDate: "August 24, 2026",
    certificateId: "CG-AI-902847-X",
    lastAccessed: "Completed",
    skills: ["Python", "Generative AI", "Prompt Engineering", "LLM APIs", "RAG"],
  },
];

/* =========================================================
   MOCK COURSE NOTES (PDF Study Materials for Enrolled Tracks)
========================================================= */

const courseNotesData: CourseNote[] = [
  // --- PYTHON FULL STACK DEVELOPMENT (cg-course-101) ---
  {
    id: "cg-note-101-1",
    courseId: "cg-course-101",
    courseTitle: "Python Full Stack Development",
    courseIcon: "🐍",
    accentColor: "#006399",
    moduleNumber: "Module 01",
    title: "Python 3 Core Syntax, OOP & Memory Allocation",
    description: "In-depth guide covering Python object models, dunder protocols (__init__, __repr__, __call__), CPython memory management, and generators.",
    instructor: "Arun Krishnan",
    pages: 36,
    fileSize: "4.2 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Lecture Handout",
    topics: ["OOP Principles", "Dunder Methods", "Memory Management", "Generators"],
    previewContent: {
      summary: "This lecture note covers Python's data model under the hood. You will master class definition protocols, multiple inheritance method resolution order (MRO), descriptor protocols, and how CPython manages memory through reference counting and generational cyclic garbage collection.",
      tableOfContents: [
        "1. The Python Data Model & PyObject Memory Layout",
        "2. Classes, Instances & Attribute Lookup Order (__dict__)",
        "3. Magic Methods: Construction, Representation & Operators",
        "4. Generators, Yield Expressions & Memory Profiling",
        "5. Production Best Practices & PEP 8 Standards",
      ],
      keyTakeaways: [
        "Everything in Python is an object derived from PyObject with ob_refcnt and ob_type pointers.",
        "Attribute resolution traverses instance.__dict__, then class.__dict__, following C3 Linearization (MRO).",
        "Use __slots__ on high-volume data classes to eliminate __dict__ memory overhead and boost attribute access speed.",
        "Generators maintain execution state on the stack, allowing constant memory O(1) processing of large datasets.",
      ],
      codeSnippets: [
        {
          title: "Custom Context Manager & Generator Protocol",
          language: "python",
          code: `class DatabaseSession:
    def __init__(self, dsn: str):
        self.dsn = dsn
        self.connection = None

    def __enter__(self):
        self.connection = connect_to_pool(self.dsn)
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            if exc_type:
                self.connection.rollback()
            else:
                self.connection.commit()
            self.connection.close()
        return False  # Propagate exceptions if any`,
        },
      ],
      sections: [
        {
          heading: "1. The Python Data Model & PyObject Memory Layout",
          content: "At the C layer, every Python entity is a pointer to a PyObject struct containing a reference count (ob_refcnt) and a type descriptor pointer (ob_type). When an object's reference counter drops to zero, deallocation is instantaneous.",
          bulletPoints: [
            "Small integer caching: Python pre-allocates integers between -5 and 256 for instant lookup.",
            "String interning: Identifier-like strings are interned in an internal hash table for pointer-equality checks.",
            "Generational GC handles circular references across 3 generation tiers (Gen 0, 1, and 2).",
          ],
        },
        {
          heading: "2. Object-Oriented Architecture & C3 MRO",
          content: "Python uses the C3 Linearization algorithm to determine Method Resolution Order in multiple inheritance scenarios. You can inspect any class's resolution order directly using ClassName.__mro__.",
          bulletPoints: [
            "super() returns a proxy object delegating method calls to the next class in the MRO chain.",
            "Always use super().__init__() when designing cooperatively inherited mixin classes.",
            "Prefer composition over deep inheritance hierarchies for maintainable application logic.",
          ],
        },
        {
          heading: "3. Memory Optimization with __slots__",
          content: "By default, Python stores instance attributes in a dynamic dict. Defining __slots__ allocates a fixed array of pointers, saving significant RAM when instantiating millions of records.",
          bulletPoints: [
            "Saves approximately 40-50% memory per instance in high-scale data processing.",
            "Prevents arbitrary dynamic attribute assignment, catching spelling errors early at runtime.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-101-2",
    courseId: "cg-course-101",
    courseTitle: "Python Full Stack Development",
    courseIcon: "🐍",
    accentColor: "#006399",
    moduleNumber: "Module 02",
    title: "Django REST Framework & Scalable API Architecture",
    description: "Production blueprint for engineering enterprise-grade RESTful APIs using Django REST Framework (DRF), custom Serializer validation, ViewSets, and stateless JWT token cycles.",
    instructor: "Arun Krishnan",
    pages: 48,
    fileSize: "5.6 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Architecture Guide",
    topics: ["Django REST", "JWT Auth", "ModelSerializers", "Query Optimization"],
    previewContent: {
      summary: "An engineering guide to designing scalable RESTful microservices with DRF. Learn how to structure clean service layers, eliminate N+1 query bottlenecks with select_related and prefetch_related, and secure endpoints with stateless JSON Web Tokens.",
      tableOfContents: [
        "1. DRF Architecture: Views, ViewSets & Routers",
        "2. Serializers, Deserializers & Contextual Validation",
        "3. Stateless JWT Authentication & Refresh Tokens",
        "4. PostgreSQL Query Optimization: select_related & prefetch_related",
        "5. API Rate Limiting, Throttling & OpenAPI Documentation",
      ],
      keyTakeaways: [
        "Separate business logic into service layer functions rather than stuffing queries into serializer validate() methods.",
        "Always run django-debug-toolbar or inspect connection.queries to catch N+1 query explosions.",
        "Use GenericViewSet combined with mixins to craft tailored HTTP verb handlers without unnecessary boilerplate.",
        "Store JWT access tokens in memory and refresh tokens in HttpOnly, SameSite=Strict cookies to guard against XSS.",
      ],
      codeSnippets: [
        {
          title: "Optimized ViewSet with Prefetching & Dynamic Serializer",
          language: "python",
          code: `from rest_framework import viewsets, permissions
from .models import CourseEnrollment
from .serializers import EnrollmentDetailSerializer, EnrollmentListSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            CourseEnrollment.objects
            .filter(student=self.request.user)
            .select_related('course', 'course__instructor')
            .prefetch_related('completed_lessons')
            .order_by('-enrolled_at')
        )

    def get_serializer_class(self):
        if self.action == 'list':
            return EnrollmentListSerializer
        return EnrollmentDetailSerializer`,
        },
      ],
      sections: [
        {
          heading: "1. DRF Request-Response Pipeline",
          content: "When a request hits DRF, it passes through authentication schemes, permission classes, throttling checks, parser negotiation, and finally view execution.",
          bulletPoints: [
            "Authentication schemes verify incoming credentials and assign request.user.",
            "Permissions evaluate whether the authenticated principal has permission to invoke the action.",
            "Serializers convert complex model instances into native Python datatypes, then rendered to JSON.",
          ],
        },
        {
          heading: "2. Solving the N+1 Query Problem in PostgreSQL",
          content: "The most frequent source of latency in Django APIs is issuing one database query for the parent object and N additional queries in a loop for foreign key relationships.",
          bulletPoints: [
            "select_related(): Performs a SQL INNER/LEFT JOIN for ForeignKey and OneToOne relationships.",
            "prefetch_related(): Performs a separate SQL query with WHERE id IN (...) for ManyToMany relationships and joins in Python memory.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-101-3",
    courseId: "cg-course-101",
    courseTitle: "Python Full Stack Development",
    courseIcon: "🐍",
    accentColor: "#006399",
    moduleNumber: "Module 03",
    title: "PostgreSQL Database Schema Design & Query Tuning",
    description: "Quick-reference cheatsheet for designing normalized relational schemas, configuring B-Tree and GIN indexes, and deciphering EXPLAIN ANALYZE execution cost trees.",
    instructor: "Arun Krishnan",
    pages: 28,
    fileSize: "3.1 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Cheatsheet",
    topics: ["PostgreSQL", "B-Tree Indexes", "EXPLAIN ANALYZE", "Transactions"],
    previewContent: {
      summary: "Database administration and performance tuning manual covering normalization up to 3NF, multi-column composite index strategies, VACUUM maintenance, and interpreting PostgreSQL query planner estimates.",
      tableOfContents: [
        "1. Schema Modeling & Foreign Key Referential Integrity",
        "2. B-Tree, Hash, GiST & GIN Index Types",
        "3. Deciphering EXPLAIN (ANALYZE, BUFFERS) Trees",
        "4. Transaction Isolation Levels & Deadlock Prevention",
        "5. Connection Pooling with PgBouncer",
      ],
      keyTakeaways: [
        "Index columns based on leftmost selectivity; place highest equality filter column first in composite indexes.",
        "A Sequential Scan isn't always bad on small tables, but on tables > 10,000 rows it indicates a missing index.",
        "Use EXPLAIN (ANALYZE, BUFFERS) to verify shared hit vs read block counters.",
        "Set transaction isolation to Read Committed by default; elevate to Repeatable Read only for financial operations.",
      ],
      codeSnippets: [
        {
          title: "Composite Index & Query Analysis",
          language: "sql",
          code: `-- High-performance composite index for multi-filter search
CREATE INDEX CONCURRENTLY idx_enrollments_student_status
ON courses_enrollment (student_id, status, enrolled_at DESC);

-- Analyze execution plan and buffer hit ratio
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT e.id, c.title, e.progress
FROM courses_enrollment e
JOIN courses_course c ON e.course_id = c.id
WHERE e.student_id = 42 AND e.status = 'in_progress';`,
        },
      ],
      sections: [
        {
          heading: "1. Indexing Strategy & Selectivity Heuristics",
          content: "Indexes speed up read operations at the cost of slower writes and additional disk space. Never index columns with low cardinality (e.g. booleans) unless using partial indexes.",
          bulletPoints: [
            "Partial Index: CREATE INDEX idx_active ON users (email) WHERE is_active = TRUE;",
            "Expression Index: CREATE INDEX idx_lower_email ON users (LOWER(email));",
            "Always create indexes with the CONCURRENTLY flag in production to prevent table locks.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-101-4",
    courseId: "cg-course-101",
    courseTitle: "Python Full Stack Development",
    courseIcon: "🐍",
    accentColor: "#006399",
    moduleNumber: "Module 04",
    title: "Full-Stack Production Deployment: Docker, Nginx & CI/CD",
    description: "Production deployment playbook for containerizing Django applications, configuring multi-stage Docker builds, Nginx reverse proxy buffers, and automated GitHub Actions pipelines.",
    instructor: "Arun Krishnan",
    pages: 32,
    fileSize: "3.8 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Architecture Guide",
    topics: ["Docker Compose", "Nginx", "Gunicorn", "CI/CD Pipelines"],
    previewContent: {
      summary: "End-to-end ops handbook for shipping modern full-stack web applications into cloud production. Features hardening tips, non-root container users, Gunicorn worker math, and zero-downtime rolling deployments.",
      tableOfContents: [
        "1. Multi-Stage Dockerfile for Python & Vite Builds",
        "2. Docker Compose Orchestration & Healthchecks",
        "3. Nginx Reverse Proxy Configuration & SSL/TLS Termination",
        "4. Gunicorn Worker Architecture: Sync vs Gevent vs Uvicorn",
        "5. Automated CI/CD Testing & Blue-Green Deployments",
      ],
      keyTakeaways: [
        "Gunicorn worker formula: Recommended workers = (2 * CPU_CORES) + 1.",
        "Always serve static media through Nginx or CDN, never directly through Django WSGI.",
        "Multi-stage Docker builds reduce container image footprint from ~1.2GB down to under 180MB.",
        "Use environment variables via Docker Secrets rather than baking credentials into repository files.",
      ],
      codeSnippets: [
        {
          title: "Production Nginx Proxy Configuration Block",
          language: "nginx",
          code: `upstream django_app {
    server web:8000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.careergize.com;

    location /static/ {
        alias /var/www/static/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location / {
        proxy_pass http://django_app;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }
}`,
        },
      ],
      sections: [
        {
          heading: "1. Container Hardening & Multi-Stage Builds",
          content: "Use non-root users inside container images to safeguard the host kernel in case of runtime escape vulnerabilities.",
          bulletPoints: [
            "Pin base images to specific sha256 digests or exact alpine/slim tags.",
            "Run pip install --no-cache-dir to prevent build cache bloat in the image layer.",
          ],
        },
      ],
    },
  },

  // --- REACT & MODERN FRONTEND (cg-course-102) ---
  {
    id: "cg-note-102-1",
    courseId: "cg-course-102",
    courseTitle: "React & Modern Frontend",
    courseIcon: "⚛️",
    accentColor: "#0284c7",
    moduleNumber: "Module 01",
    title: "React 19 Core Mechanics & Virtual DOM Reconciliation",
    description: "Detailed exploration of React 19 rendering pipeline, reconciliation heuristics, fiber nodes, automatic batching, and server components mental model.",
    instructor: "Sarah Jenkins",
    pages: 34,
    fileSize: "3.9 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Lecture Handout",
    topics: ["React 19", "Fiber Engine", "Virtual DOM", "Reconciliation"],
    previewContent: {
      summary: "Understand how React 19 transforms JSX into fiber trees, schedules updates across concurrent lanes, executes diffing heuristics in O(N) linear time, and compiles state mutations with the React Compiler.",
      tableOfContents: [
        "1. JSX Compilation & Virtual DOM Representation",
        "2. The Fiber Architecture & Two-Phase Rendering (Render vs Commit)",
        "3. Reconciliation Heuristics & Key Prop Correctness",
        "4. Automatic Batching in React 19 & Microtasks",
        "5. React 19 Server Components (RSC) vs Client Components",
      ],
      keyTakeaways: [
        "The Render Phase is asynchronous and interruptible; the Commit Phase is synchronous and writes to the real DOM.",
        "Keys must remain stable, unique, and predictable. Never use array index for items that can reorder, insert, or delete.",
        "React 19 automatically batches all state updates across promises, timeouts, and native event listeners.",
        "Server Components never bundle into client JavaScript, shrinking the total bundle shipped over the wire.",
      ],
      codeSnippets: [
        {
          title: "Custom Fiber-Aware Component with Key Heuristic",
          language: "tsx",
          code: `import React, { useId } from "react";

interface LessonListProps {
  lessons: Array<{ id: string; title: string; duration: string }>;
}

export const LessonList: React.FC<LessonListProps> = ({ lessons }) => {
  const componentId = useId();

  return (
    <ul id={componentId} className="divide-y divide-slate-100">
      {lessons.map((lesson) => (
        // Key MUST be stable UUID from database, not array index!
        <li key={lesson.id} className="py-2.5 flex items-center justify-between">
          <span className="font-semibold text-slate-800">{lesson.title}</span>
          <span className="text-xs text-slate-400">{lesson.duration}</span>
        </li>
      ))}
    </ul>
  );
};`,
        },
      ],
      sections: [
        {
          heading: "1. Fiber Node Structure & Work Loops",
          content: "A Fiber is a plain JavaScript object representing a unit of work. Each Fiber contains references to its child, sibling, and parent (return) fibers, forming a singly-linked list tree structure.",
          bulletPoints: [
            "Current Fiber: Represents what is currently mounted on screen.",
            "WorkInProgress Fiber: Represents the alternate tree constructed in memory during state updates.",
            "Double Buffering: Once render finishes, React swaps root pointer from current to workInProgress.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-102-2",
    courseId: "cg-course-102",
    courseTitle: "React & Modern Frontend",
    courseIcon: "⚛️",
    accentColor: "#0284c7",
    moduleNumber: "Module 02",
    title: "Hooks Deep Dive: Performance, Memoization & Transitions",
    description: "Mastering useMemo, useCallback, useTransition, useDeferredValue, and custom hooks patterns to prevent unnecessary renders and build silky smooth 60fps UIs.",
    instructor: "Sarah Jenkins",
    pages: 26,
    fileSize: "2.8 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Cheatsheet",
    topics: ["useTransition", "useMemo", "useCallback", "Profiling"],
    previewContent: {
      summary: "A practical cheatsheet for React performance engineering. Covers when to memoize and when not to, how to offload heavy filtering to non-blocking transition lanes, and how to eliminate stale closures in useEffect.",
      tableOfContents: [
        "1. Memoization Economics: When useMemo & useCallback Actually Help",
        "2. React 19 useTransition & useDeferredValue for Non-blocking UI",
        "3. Rules of Hooks & Internal Fiber MemoizedState Linked List",
        "4. Custom Hooks Composition Patterns & Encapsulation",
        "5. React DevTools Profiler: Flamecharts & Render Reasons",
      ],
      keyTakeaways: [
        "useMemo cost: Allocating a dependency array and comparing dependencies on each render has nonzero overhead.",
        "useTransition demotes state updates to a low-priority lane, keeping inputs and clicks instantly responsive.",
        "Never use useEffect for deriving state from props or existing state; compute directly in the render body.",
        "Wrap callback props passed to React.memo child components with useCallback to preserve referential equality.",
      ],
      codeSnippets: [
        {
          title: "Non-blocking Search Filter with useTransition",
          language: "tsx",
          code: `import React, { useState, useTransition } from "react";

export function CourseSearchFilter({ allNotes }: { allNotes: CourseNote[] }) {
  const [query, setQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(allNotes);
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val); // High-priority input text update (instant feedback)

    startTransition(() => {
      // Low-priority background filter (non-blocking)
      const matches = allNotes.filter((n) =>
        n.title.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredNotes(matches);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearchChange} />
      {isPending && <span className="text-xs text-amber-500">Updating list...</span>}
    </div>
  );
}`,
        },
      ],
      sections: [
        {
          heading: "1. The React Hooks Memory Model",
          content: "Each component fiber stores hooks as a singly-linked list of hook objects attached to fiber.memoizedState. This is why hooks cannot be wrapped in conditional if statements or loops.",
          bulletPoints: [
            "Calling hooks conditionally desynchronizes the linked list traversal on subsequent re-renders.",
            "Always declare hooks at top-level component scope.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-102-3",
    courseId: "cg-course-102",
    courseTitle: "React & Modern Frontend",
    courseIcon: "⚛️",
    accentColor: "#0284c7",
    moduleNumber: "Module 03",
    title: "Modern State Architecture: Zustand vs Redux Toolkit vs TanStack Query",
    description: "Architectural blueprint comparing client-side atomic stores with server-state caching, optimistic mutations, and offline synchronizations.",
    instructor: "Sarah Jenkins",
    pages: 42,
    fileSize: "4.7 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Architecture Guide",
    topics: ["Zustand", "Redux Toolkit", "TanStack Query", "Server State"],
    previewContent: {
      summary: "Architecture framework for separating ephemeral UI state, global client state, and asynchronous server cache. Covers Zustand store slices, TanStack Query stale-while-revalidate caching, and optimistic rollbacks.",
      tableOfContents: [
        "1. State Taxonomy: Ephemeral vs Global Client vs Server Cache",
        "2. Zustand: Minimalist Atomic State without Context Re-renders",
        "3. TanStack Query: Stale-While-Revalidate, Garbage Collection & Deduplication",
        "4. Optimistic UI Updates & Automatic Rollback Strategies",
        "5. Syncing State with LocalStorage & URL SearchParams",
      ],
      keyTakeaways: [
        "Stop putting server data into Redux/Zustand; manage remote API data exclusively with TanStack Query or SWR.",
        "Zustand uses subscription selectors outside of React context, preventing full-tree re-renders on state changes.",
        "Always provide a queryKey that includes all dependent variables to guarantee proper cache invalidation.",
        "Use optimistic updates for high-frequency actions like toggling bookmarks or marking lessons complete.",
      ],
      codeSnippets: [
        {
          title: "Lightweight Zustand Store with Persistence",
          language: "ts",
          code: `import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotesStore {
  savedNoteIds: string[];
  toggleSaveNote: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      savedNoteIds: [],
      toggleSaveNote: (id) =>
        set((state) => ({
          savedNoteIds: state.savedNoteIds.includes(id)
            ? state.savedNoteIds.filter((item) => item !== id)
            : [...state.savedNoteIds, id],
        })),
      isSaved: (id) => get().savedNoteIds.includes(id),
    }),
    { name: "careergize_saved_notes" }
  )
);`,
        },
      ],
      sections: [
        {
          heading: "1. The Server-State Revolution",
          content: "Server state is inherently asynchronous, shared, and can become stale without the client's knowledge. Managing server state requires caching, deduplication, retry logic, and pagination.",
          bulletPoints: [
            "staleTime defines how long data is considered fresh before re-fetching in the background.",
            "gcTime (garbage collection time) determines when unused cached data is purged from memory.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-102-4",
    courseId: "cg-course-102",
    courseTitle: "React & Modern Frontend",
    courseIcon: "⚛️",
    accentColor: "#0284c7",
    moduleNumber: "Module 04",
    title: "Tailwind CSS 4 Design Tokens & Accessible UI Components",
    description: "Design engineering handbook on theme configuration, modern CSS features (@container, @starting-style), ARIA compliance, and motion primitives.",
    instructor: "Sarah Jenkins",
    pages: 30,
    fileSize: "3.3 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Lecture Handout",
    topics: ["Tailwind CSS 4", "Design Tokens", "Accessibility", "Animations"],
    previewContent: {
      summary: "Master modern design systems with Tailwind CSS 4, CSS variables, accessible keyboard navigation patterns, focus management, screen reader labels, and fluid micro-animations.",
      tableOfContents: [
        "1. Tailwind CSS 4 Engine: @theme, CSS Variables & Zero-Config",
        "2. Container Queries (@container) for Modular Micro-Layouts",
        "3. WCAG 2.1 AA Accessibility: Contrast Ratios, Focus Rings & ARIA Roles",
        "4. Keyboard Navigation & Modal Focus Traps",
        "5. Fluid Motion, Spring Physics & GPU Transform Optimization",
      ],
      keyTakeaways: [
        "Tailwind CSS 4 uses direct CSS variable integration; customize palettes with standard CSS in index.css.",
        "Always test interfaces using keyboard only (Tab, Shift+Tab, Escape, Enter, Space).",
        "Modals must trap focus while open and restore focus to trigger button upon dismissal.",
        "Animate only transform and opacity to guarantee 60fps animations without triggering layout recalculations.",
      ],
      codeSnippets: [
        {
          title: "Accessible Modal with Focus Trap & Escape Listener",
          language: "tsx",
          code: `import React, { useEffect, useRef } from "react";

export function AccessibleModal({ isOpen, onClose, children }: any) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div ref={modalRef} className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full">
        {children}
      </div>
    </div>
  );
}`,
        },
      ],
      sections: [
        {
          heading: "1. Color Tokens & High Contrast Ergonomics",
          content: "Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt+) against backgrounds according to WCAG 2.1 AA guidelines.",
          bulletPoints: [
            "Use slate-900 for dark mode headers and slate-600 for body text.",
            "Avoid low-contrast placeholder text that strains user readability.",
          ],
        },
      ],
    },
  },

  // --- AI & GENERATIVE AI (cg-course-103) ---
  {
    id: "cg-note-103-1",
    courseId: "cg-course-103",
    courseTitle: "AI & Generative AI",
    courseIcon: "🤖",
    accentColor: "#7c3aed",
    moduleNumber: "Module 01",
    title: "Transformer Architecture & Large Language Model Foundations",
    description: "Complete breakdown of self-attention mechanisms, multi-head attention, positional encodings, transformer blocks, and modern decoder-only LLM scale laws.",
    instructor: "Dr. David Chen",
    pages: 54,
    fileSize: "6.2 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Lecture Handout",
    topics: ["Transformers", "Self-Attention", "Tokenization", "LLM Scaling"],
    previewContent: {
      summary: "Comprehensive lecture notes detailing the foundational architecture behind modern AI models (GPT-4, Claude, Gemini, Llama). Master Scaled Dot-Product Attention, QKV matrices, causal masking, Rotary Position Embeddings (RoPE), and Byte-Pair Encoding.",
      tableOfContents: [
        "1. Attention Mechanism: Query, Key, Value Mathematical Formulations",
        "2. Multi-Head Attention & Representation Subspaces",
        "3. Positional Encodings: Sinusoidal vs Learned vs RoPE",
        "4. Encoder-Decoder vs Causal Decoder-Only Architectures",
        "5. Tokenization Algorithms: BPE, WordPiece & SentencePiece",
      ],
      keyTakeaways: [
        "Attention formula: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V.",
        "Dividing by sqrt(d_k) prevents the dot products from growing excessively large, which pushes softmax into regions with vanishing gradients.",
        "Causal masking forces each token to attend exclusively to previous tokens in the sequence during autoregressive generation.",
        "Modern frontier models are decoder-only transformers with RMSNorm, SwiGLU activation, and Rotary Embeddings.",
      ],
      codeSnippets: [
        {
          title: "Scaled Dot-Product Attention in PyTorch",
          language: "python",
          code: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V shapes: (batch_size, num_heads, seq_len, head_dim)
    """
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)

    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))

    attention_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attention_weights, V)
    return output, attention_weights`,
        },
      ],
      sections: [
        {
          heading: "1. The Query, Key, Value Intuition",
          content: "Think of Q as a search query, K as index keys in a database, and V as the actual content values. The attention weight determines how much weight to pull from each value based on query-key similarity.",
          bulletPoints: [
            "Multi-Head Attention projects Q, K, V into multiple lower-dimensional subspaces, allowing the model to attend to different types of semantic relationships simultaneously.",
            "Layer Normalization (or RMSNorm) stabilizes activations between transformer layers.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-103-2",
    courseId: "cg-course-103",
    courseTitle: "AI & Generative AI",
    courseIcon: "🤖",
    accentColor: "#7c3aed",
    moduleNumber: "Module 02",
    title: "Production Prompt Engineering & Structured JSON Outputs",
    description: "Industrial techniques for Chain-of-Thought prompting, ReAct frameworks, few-shot prompting, JSON schema enforcement, and hallucinations reduction.",
    instructor: "Dr. David Chen",
    pages: 32,
    fileSize: "3.6 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Cheatsheet",
    topics: ["Prompt Engineering", "Chain of Thought", "Structured Output", "Guardrails"],
    previewContent: {
      summary: "Production prompt engineering handbook for building deterministic, resilient AI workflows. Covers persona adoption, negative constraints, few-shot exemplars, structured JSON schema response formats, and automated guardrail validation.",
      tableOfContents: [
        "1. Core Principles of Deterministic System Prompts",
        "2. Zero-Shot vs Few-Shot Exemplars Construction",
        "3. Chain-of-Thought (CoT) & Step-by-Step Reasoning Guides",
        "4. Enforcing Valid JSON Output via JSON Schema Modes",
        "5. Hallucination Mitigation & Groundedness Verification",
      ],
      keyTakeaways: [
        "Give the model room to think: instruct it to generate its chain-of-thought analysis before outputting the final JSON answer.",
        "Use Few-Shot examples with diverse edge cases (e.g. empty fields, error conditions, unexpected inputs).",
        "Always use JSON mode with strict schema enforcement (Pydantic / Zod) in production backend integrations.",
        "Anchor outputs by instructing the model: 'If the provided context does not contain sufficient information, state that you do not know.'",
      ],
      codeSnippets: [
        {
          title: "Structured Prompt Template with JSON Enforcement",
          language: "typescript",
          code: `export const CAREER_ANALYSIS_PROMPT = \`
You are an expert technical recruiter and senior engineering mentor at Careergize.
Analyze the following student project submission and provide actionable feedback.

GUIDELINES:
1. First, think step-by-step inside <analysis> tags.
2. Verify code quality, test coverage, and architecture.
3. Respond ONLY with valid JSON matching the following schema:

{
  "score": number (0-100),
  "strengths": string[],
  "areasForImprovement": string[],
  "recommendedNextTopics": string[]
}
\`;`,
        },
      ],
      sections: [
        {
          heading: "1. The Anatomy of an Industrial Prompt",
          content: "An effective system prompt comprises Role, Context, Task, Constraints, Exemplars, and Output Specification. Ambiguity in any of these components leads to erratic LLM outputs.",
          bulletPoints: [
            "Role Definition: Calibrate vocabulary and domain depth.",
            "Explicit Negative Constraints: Explicitly forbid common failure modes.",
            "Delimiters: Use triple backticks or XML tags to delineate user input from system instructions.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-103-3",
    courseId: "cg-course-103",
    courseTitle: "AI & Generative AI",
    courseIcon: "🤖",
    accentColor: "#7c3aed",
    moduleNumber: "Module 03",
    title: "Enterprise RAG: Vector Databases, Chunking & HyDE Embeddings",
    description: "Comprehensive architectural guide for building production Retrieval-Augmented Generation pipelines with ChromaDB, hybrid search, and semantic re-ranking.",
    instructor: "Dr. David Chen",
    pages: 46,
    fileSize: "5.4 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Architecture Guide",
    topics: ["RAG Systems", "Vector DB", "Embeddings", "Hybrid Search"],
    previewContent: {
      summary: "End-to-end architectural blueprint for enterprise RAG systems. Learn document ingestion pipelines, recursive chunking, dense vector embeddings, BM25 sparse keyword search, cross-encoder re-ranking, and RAG evaluation frameworks.",
      tableOfContents: [
        "1. Document Ingestion: Parsing PDFs, Markdown & Source Code",
        "2. Chunking Heuristics: Fixed-Size vs Sentence vs Recursive vs Semantic",
        "3. Vector Databases: ChromaDB, Pinecone, Qdrant & pgvector",
        "4. Hybrid Search: Combining Dense Semantic Vectors with Sparse BM25",
        "5. Cross-Encoder Re-ranking & Context Window Compression",
      ],
      keyTakeaways: [
        "Chunk size matters: 500-1000 tokens with 10-20% overlap provides the optimal balance of context and specificity.",
        "Dense vectors excel at semantic concepts; BM25 keyword search excels at exact matches (product codes, function names).",
        "Hybrid search using Reciprocal Rank Fusion (RRF) consistently outperforms dense retrieval alone by 15-25%.",
        "Re-ranking retrieved chunks with a cross-encoder model filters out false positives before sending tokens to the LLM.",
      ],
      codeSnippets: [
        {
          title: "Hybrid Search with Reciprocal Rank Fusion (RRF)",
          language: "python",
          code: `def reciprocal_rank_fusion(dense_results, sparse_results, k=60):
    """
    Combines dense embedding rankings and BM25 sparse rankings.
    """
    scores = {}
    for rank, doc in enumerate(dense_results):
        scores[doc.id] = scores.get(doc.id, 0) + (1.0 / (k + rank + 1))
    for rank, doc in enumerate(sparse_results):
        scores[doc.id] = scores.get(doc.id, 0) + (1.0 / (k + rank + 1))

    sorted_docs = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    return [doc_id for doc_id, score in sorted_docs]`,
        },
      ],
      sections: [
        {
          heading: "1. The RAG Ingestion Pipeline",
          content: "Raw documents must be cleaned, chunked into coherent semantic passages, passed through an embedding model (e.g. text-embedding-3-small), and indexed in a vector store with rich metadata.",
          bulletPoints: [
            "Store metadata such as course_id, module_id, and page_number to enable filtered retrieval.",
            "Use Hypothetical Document Embeddings (HyDE) for answering complex conceptual queries.",
          ],
        },
      ],
    },
  },
  {
    id: "cg-note-103-4",
    courseId: "cg-course-103",
    courseTitle: "AI & Generative AI",
    courseIcon: "🤖",
    accentColor: "#7c3aed",
    moduleNumber: "Module 04",
    title: "Model Fine-Tuning with LoRA/QLoRA & LLM Evaluation",
    description: "Hands-on guide on parameter-efficient fine-tuning (PEFT), quantization techniques (4-bit/8-bit), and automated evaluation using ROUGE, BLEU, and LLM-as-a-judge.",
    instructor: "Dr. David Chen",
    pages: 38,
    fileSize: "4.5 MB",
    updatedDate: "Fall 2026 Edition",
    type: "Exam Prep",
    topics: ["LoRA", "Quantization", "Model Evaluation", "Fine-Tuning"],
    previewContent: {
      summary: "Practical guide to fine-tuning open-weight foundation models (Llama 3, Mistral) on custom datasets. Covers parameter-efficient Low-Rank Adaptation (LoRA), 4-bit NormalFloat quantization (QLoRA), Direct Preference Optimization (DPO), and rigorous quantitative evaluation metrics.",
      tableOfContents: [
        "1. Full Fine-Tuning vs Parameter-Efficient Fine-Tuning (PEFT)",
        "2. LoRA Mechanics: Low-Rank Matrix Decomposition (W = W0 + B*A)",
        "3. QLoRA: 4-bit NormalFloat Quantization & Double Quantization",
        "4. Direct Preference Optimization (DPO) vs RLHF with PPO",
        "5. Automated Benchmark Evaluation: BLEU, ROUGE, MMLU & LLM-as-Judge",
      ],
      keyTakeaways: [
        "LoRA freezes base model weights and trains two low-rank matrices A and B, reducing trainable parameters by 99% with no quality loss.",
        "QLoRA enables fine-tuning a 70B parameter model on a single consumer GPU by quantizing base weights to 4-bit NF4.",
        "Rank r=16 or r=32 with alpha=2*r is the gold standard for text classification and instruction-following tasks.",
        "Use LLM-as-a-Judge with pairwise comparison and position swap to benchmark conversational performance.",
      ],
      codeSnippets: [
        {
          title: "LoRA Configuration with HuggingFace PEFT",
          language: "python",
          code: `from peft import LoraConfig, get_peft_model, TaskType

lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                       # Rank dimension
    lora_alpha=32,              # Scaling parameter
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none"
)

# Attach trainable adapter matrices to frozen base model
peft_model = get_peft_model(base_model, lora_config)
peft_model.print_trainable_parameters()`,
        },
      ],
      sections: [
        {
          heading: "1. Why Low-Rank Adaptation Works",
          content: "The weight updates during adaptation have a significantly lower intrinsic rank than the original weight matrix. By decomposing delta W into B * A (where rank r << d), we drastically slash memory consumption.",
          bulletPoints: [
            "Inference latency: LoRA weights can be mathematically merged back into W0 at zero inference speed penalty.",
            "Allows hot-swapping multiple domain-specific adapters onto a single deployed base model server.",
          ],
        },
      ],
    },
  },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

/* =========================================================
   COMPONENT: MyLearning
========================================================= */

export default function MyLearning() {
  const navigate = useNavigate();

  // Navigation & User State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Courses & Filters State
  const [courses, setCourses] = useState<EnrolledCourse[]>(initialEnrolledCourses);
  const [statusFilter, setStatusFilter] = useState<"All" | "in_progress" | "completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "alphabetical">("recent");

  // Interaction State (Modals & Feedback)
  const [selectedCertificate, setSelectedCertificate] = useState<EnrolledCourse | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [resumingCourse, setResumingCourse] = useState<EnrolledCourse | null>(null);
  const [reviewingCourse, setReviewingCourse] = useState<EnrolledCourse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Course Notes & PDF Resources State
  const [notesCourseFilter, setNotesCourseFilter] = useState<string>("all");
  const [notesTypeFilter, setNotesTypeFilter] = useState<string>("all");
  const [notesSearchQuery, setNotesSearchQuery] = useState<string>("");
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [bookmarkedNoteIds, setBookmarkedNoteIds] = useState<string[]>([]);
  const [previewingNote, setPreviewingNote] = useState<CourseNote | null>(null);
  const [activeNoteSectionIndex, setActiveNoteSectionIndex] = useState<number>(0);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [isCopiedCode, setIsCopiedCode] = useState<boolean>(false);

  // Read logged in student information from localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const studentName = user?.username || "Student";
  const studentEmail = user?.email || "student@careergize.com";

  // Sidebar / Header navigation handler
  const handleNavigation = (label: string) => {
    if (label === "Overview") navigate("/dashboard");
    if (label === "My Profile") navigate("/profile");
    if (label === "My Learning") navigate("/my-learning");
    if (label === "Schedule") navigate("/schedule");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudentId");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Distinct Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return ["All Categories", ...Array.from(set)];
  }, [courses]);

  // Top Overview / Quick Stats calculation
  const stats = useMemo(() => {
    const totalEnrolled = courses.length;
    const inProgressCount = courses.filter((c) => c.status === "in_progress").length;
    const completedCount = courses.filter((c) => c.status === "completed").length;
    const certificatesEarned = courses.filter((c) => !!c.certificateId).length;

    return {
      totalEnrolled,
      inProgressCount,
      completedCount,
      certificatesEarned,
    };
  }, [courses]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      // Status filter
      if (statusFilter !== "All" && course.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "All Categories" && course.category !== selectedCategory) {
        return false;
      }
      // Search query (matches title, category, instructor, or skills)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesCategory = course.category.toLowerCase().includes(query);
        const matchesInstructor = course.instructor.name.toLowerCase().includes(query);
        const matchesSkill = course.skills.some((s) => s.toLowerCase().includes(query));

        if (!matchesTitle && !matchesCategory && !matchesInstructor && !matchesSkill) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "progress") {
        return b.progress - a.progress;
      }
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      // default: "recent" (ongoing courses first, then higher progress)
      if (a.status !== b.status) {
        return a.status === "in_progress" ? -1 : 1;
      }
      return b.progress - a.progress;
    });

    return result;
  }, [courses, statusFilter, selectedCategory, searchQuery, sortBy]);

  // Clear all filters
  const resetFilters = () => {
    setStatusFilter("All");
    setSelectedCategory("All Categories");
    setSearchQuery("");
  };

  const handleShareCertificate = (course: EnrolledCourse) => {
    setIsCopied(true);
    triggerToast(`Verification link for ${course.certificateId} copied to clipboard!`);
    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  // Filtered Notes computation
  const filteredNotes = useMemo(() => {
    return courseNotesData.filter((note) => {
      // Filter by enrolled course
      if (notesCourseFilter !== "all" && note.courseId !== notesCourseFilter) {
        return false;
      }
      // Filter by document type
      if (notesTypeFilter !== "all" && note.type !== notesTypeFilter) {
        return false;
      }
      // Filter by bookmarked
      if (onlyBookmarked && !bookmarkedNoteIds.includes(note.id)) {
        return false;
      }
      // Search query
      if (notesSearchQuery.trim() !== "") {
        const query = notesSearchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesDesc = note.description.toLowerCase().includes(query);
        const matchesModule = note.moduleNumber.toLowerCase().includes(query);
        const matchesCourse = note.courseTitle.toLowerCase().includes(query);
        const matchesTopics = note.topics.some((t) => t.toLowerCase().includes(query));
        const matchesInstructor = note.instructor.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesModule && !matchesCourse && !matchesTopics && !matchesInstructor) {
          return false;
        }
      }
      return true;
    });
  }, [notesCourseFilter, notesTypeFilter, onlyBookmarked, bookmarkedNoteIds, notesSearchQuery]);

  // Download Note as formatted study document
  const handleDownloadNote = (note: CourseNote) => {
    const documentBody = `================================================================================
CAREERGIZE LEARNING HUB - OFFICIAL VERIFIED COURSE NOTES
================================================================================
Curriculum Track:  ${note.courseTitle}
Module Reference:  ${note.moduleNumber} - ${note.title}
Instructor:        ${note.instructor}
Document Type:     ${note.type}
Pagination:        ${note.pages} Pages (Digital PDF Edition)
File Size:         ${note.fileSize}
Edition:           ${note.updatedDate}
Security Seal:     Verified Tamper-proof Curriculum Material
================================================================================

1. EXECUTIVE SYNOPSIS:
${note.previewContent.summary}

2. TABLE OF CONTENTS:
${note.previewContent.tableOfContents.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}

3. CORE REVISION TAKEAWAYS:
${note.previewContent.keyTakeaways.map((k) => `  [✓] ${k}`).join("\n")}

4. MODULE LECTURE NOTES & CURRICULUM ANALYSIS:
${note.previewContent.sections
  .map(
    (sec) => `
--------------------------------------------------------------------------------
${sec.heading}
--------------------------------------------------------------------------------
${sec.content}
${sec.bulletPoints ? sec.bulletPoints.map((bp) => `  * ${bp}`).join("\n") : ""}`
  )
  .join("\n")}

${
  note.previewContent.codeSnippets && note.previewContent.codeSnippets.length > 0
    ? `
5. PRACTICAL CODE IMPLEMENTATIONS:
${note.previewContent.codeSnippets
  .map(
    (code) => `
[${code.title}] (${code.language.toUpperCase()})
--------------------------------------------------------------------------------
${code.code}
--------------------------------------------------------------------------------`
  )
  .join("\n")}`
    : ""
}

================================================================================
CAREERGIZE ACADEMIC REPOSITORY • REGISTERED STUDENT COPY
Tamper-evident hash: CG-NOTEDL-${note.id.toUpperCase()}-VERIFIED
================================================================================`;

    const blob = new Blob([documentBody], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedTitle = note.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    link.download = `${note.moduleNumber}_${sanitizedTitle}_Notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Downloaded "${note.title}" notes (${note.fileSize})!`);
  };

  // Download all notes bundle
  const handleDownloadAllNotes = () => {
    triggerToast(`Packaging all 12 PDF notes for enrolled courses into ZIP bundle...`);
    setTimeout(() => {
      triggerToast(`Bundle download ready! (12 Course PDF Notes • 48.6 MB)`);
    }, 1500);
  };

  // Bookmark toggle
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedNoteIds((prev) => {
      const isBookmarked = prev.includes(id);
      const updated = isBookmarked ? prev.filter((item) => item !== id) : [...prev, id];
      triggerToast(isBookmarked ? "Removed from saved notes." : "Saved note to revision bookmarks!");
      return updated;
    });
  };

  // Jump from Course Card to Notes section
  const handleJumpToCourseNotes = (courseId: string) => {
    setNotesCourseFilter(courseId);
    const el = document.getElementById("course-notes-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    const targetCourse = courses.find((c) => c.id === courseId);
    if (targetCourse) {
      triggerToast(`Viewing course PDF notes for ${targetCourse.title}`);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopiedCode(true);
    triggerToast("Code snippet copied to clipboard!");
    setTimeout(() => setIsCopiedCode(false), 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-30">
        
        {/* Brand / Logo */}
        <div className="px-7 py-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 overflow-hidden">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-8 h-8 object-contain scale-125"
              />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>

          {/* Student Profile Quick Tile */}
          <div className="mt-8 flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-extrabold text-sm shrink-0">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate text-slate-800">
                {studentName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {studentEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "My Learning";

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-bold shadow-xs"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center overflow-hidden">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-9 h-9 object-contain scale-110"
              />
            </div>
            <div>
              <div className="font-extrabold text-lg">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="px-4 pb-4 border-t border-slate-100 bg-white">
            <nav className="pt-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.label === "My Learning";

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-primary font-bold"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* =========================================================
          MAIN VIEW CONTAINER
      ========================================================= */}
      <main className="lg:ml-64 min-h-screen">
        <div className="px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto">

          {/* Section Breadcrumb & Header Banner */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              
              {/* Subtle background decorative blurs */}
              <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 right-60 w-56 h-56 rounded-full bg-blue-100/70 blur-2xl pointer-events-none" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Dashboard • Academic Journey</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    My Learning
                  </h1>

                  <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Track your registered programs, monitor weekly lesson completion milestones, and instantly access verified digital certificates.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      const el = document.getElementById("course-notes-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/30 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 font-bold text-sm transition-all cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Course Notes (12 PDFs)</span>
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-white hover:border-brand-primary/40 font-semibold text-sm transition-all cursor-pointer shadow-xs"
                  >
                    <Compass className="w-4 h-4 text-brand-primary" />
                    <span>Explore Catalog</span>
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-semibold text-sm transition shadow-sm cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Back to Overview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              1. TOP OVERVIEW / QUICK STATS METRIC CARDS
              ===================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            
            {/* Card 1: Enrolled Courses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-brand-primary/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Curriculum
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.totalEnrolled}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Enrolled Courses
                </p>
                <span className="text-xs text-brand-primary font-bold">
                  Active
                </span>
              </div>
            </div>

            {/* Card 2: In Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Ongoing
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.inProgressCount}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  In Progress
                </p>
                <span className="text-xs text-amber-600 font-bold">
                  {Math.round((stats.inProgressCount / (stats.totalEnrolled || 1)) * 100)}%
                </span>
              </div>
            </div>

            {/* Card 3: Completed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Mastered
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.completedCount}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Completed
                </p>
                <span className="text-xs text-emerald-600 font-bold">
                  100% Passed
                </span>
              </div>
            </div>

            {/* Card 4: Certificates */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Verified
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.certificatesEarned}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Certificates
                </p>
                <span className="text-xs text-purple-600 font-bold">
                  Shareable
                </span>
              </div>
            </div>

          </div>

          {/* =====================================================
              2. FILTER & NAVIGATION BAR
              ===================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <button
                  onClick={() => setStatusFilter("All")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    statusFilter === "All"
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span>All</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      statusFilter === "All"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {courses.length}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("in_progress")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    statusFilter === "in_progress"
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>In Progress</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      statusFilter === "in_progress"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {stats.inProgressCount}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    statusFilter === "completed"
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Completed</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      statusFilter === "completed"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {stats.completedCount}
                  </span>
                </button>
              </div>

              {/* Right Side: Search & Filter Selectors */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                
                {/* Search Bar matching application style */}
                <div className="relative w-full sm:w-64 md:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, skills, tutors..."
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Clear Search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition cursor-pointer appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full sm:w-auto pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition cursor-pointer appearance-none"
                  >
                    <option value="recent">Sort: Activity</option>
                    <option value="progress">Sort: Progress</option>
                    <option value="alphabetical">Sort: Name</option>
                  </select>
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

              </div>

            </div>

            {/* Active search/category tag indicator */}
            {(searchQuery || selectedCategory !== "All Categories" || statusFilter !== "All") && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Active filters:</span>

                {statusFilter !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    Status: {statusFilter === "in_progress" ? "In Progress" : "Completed"}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                      onClick={() => setStatusFilter("All")}
                    />
                  </span>
                )}

                {selectedCategory !== "All Categories" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    Category: {selectedCategory}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                      onClick={() => setSelectedCategory("All Categories")}
                    />
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    Keyword: "{searchQuery}"
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                      onClick={() => setSearchQuery("")}
                    />
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-brand-primary ml-auto transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset all
                </button>
              </div>
            )}
          </div>

          {/* =====================================================
              3. ENROLLED COURSES GRID
              ===================================================== */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isCompleted = course.status === "completed";

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Top Thumbnail & Visual Header */}
                    <div>
                      <div
                        className={`h-40 relative bg-gradient-to-br ${course.bannerGradient} p-5 flex flex-col justify-between border-b border-slate-100 overflow-hidden`}
                      >
                        {/* Decorative background glow */}
                        <div
                          className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full blur-xl opacity-40"
                          style={{ backgroundColor: course.accentColor }}
                        />

                        {/* Top badges row */}
                        <div className="flex items-center justify-between relative z-10">
                          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs border border-white/60">
                            {course.category}
                          </span>

                          {isCompleted ? (
                            <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="bg-white/90 backdrop-blur-xs text-amber-700 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs border border-amber-200/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              In Progress
                            </span>
                          )}
                        </div>

                        {/* Course Icon & Level row */}
                        <div className="flex items-end justify-between relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 border border-slate-100">
                            <span>{course.icon}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] font-bold text-slate-500 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                              {course.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Course Card Body */}
                      <div className="p-6">
                        
                        {/* Course Title */}
                        <h3 className="font-extrabold text-lg text-slate-900 leading-snug line-clamp-2 min-h-[3.25rem] group-hover:text-brand-primary transition-colors">
                          {course.title}
                        </h3>

                        {/* Instructor Details */}
                        <div className="flex items-center gap-3 mt-3.5 pb-4 border-b border-slate-100">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {course.instructor.avatarInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {course.instructor.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {course.instructor.role}
                            </p>
                          </div>
                        </div>

                        {/* Key Progress & Syllabus Stats */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-slate-400" />
                              {course.completedLessons} of {course.totalLessons} Lessons
                            </span>
                            <span
                              className={`font-extrabold text-sm ${
                                isCompleted ? "text-emerald-600" : "text-brand-primary"
                              }`}
                            >
                              {course.progress}%
                            </span>
                          </div>

                          {/* Progress Bar with smooth fill */}
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isCompleted
                                  ? "bg-emerald-500"
                                  : "bg-brand-primary"
                              }`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Next Action or Completion Date info */}
                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          {isCompleted ? (
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1.5 text-slate-500">
                                <Award className="w-3.5 h-3.5 text-emerald-600" />
                                Completed:
                              </span>
                              <span className="font-bold text-slate-800">
                                {course.completedDate || "August 2026"}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                                Next Up
                              </div>
                              <p className="font-semibold text-slate-700 truncate">
                                {course.nextLessonTitle || "Continue next lesson module"}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Skill Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {course.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                              +{course.skills.length - 3}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Card Footer / Dynamic CTAs */}
                    <div className="p-6 pt-0 mt-2 space-y-2.5">
                      {isCompleted ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => setSelectedCertificate(course)}
                            className="w-full py-2.5 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </button>

                          <button
                            onClick={() => setReviewingCourse(course)}
                            className="w-full py-2.5 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResumingCourse(course)}
                          className="w-full py-3 px-4 bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer group-hover:bg-brand-primary/95"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Resume Learning</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleJumpToCourseNotes(course.id)}
                        className="w-full py-2 px-3 bg-slate-50 hover:bg-brand-primary/5 hover:border-brand-primary/30 border border-slate-200 text-slate-600 hover:text-brand-primary font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5 text-brand-primary" />
                        <span>Course PDF Notes ({courseNotesData.filter((n) => n.courseId === course.id).length})</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* =====================================================
                4. EMPTY STATE (When no courses match filter / search)
                ===================================================== */
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-5 shadow-xs">
                <Search className="w-8 h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                No matching courses found
              </h2>

              <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? `We couldn't find any courses matching "${searchQuery}". Try searching with different keywords or clearing your current filter.`
                  : "You do not have any courses enrolled under this filter category."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <button
                  onClick={resetFilters}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Filters</span>
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Course Catalog</span>
                </button>
              </div>
            </div>
          )}

          {/* =====================================================
              5. COURSE NOTES & PDF STUDY MATERIALS SECTION
              ===================================================== */}
          <div id="course-notes-section" className="mt-16 pt-10 border-t border-slate-200 scroll-mt-6">
            
            {/* Notes Section Header Card */}
            <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 left-1/3 w-48 h-48 rounded-full bg-blue-100/60 blur-2xl pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Academic Resources • Course Handouts & Cheat Sheets</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Course Notes & PDF Study Materials
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Verified lecture handouts, architecture blueprints, quick-reference cheat sheets, and exam revision guides for your enrolled curriculum tracks.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer border ${
                      onlyBookmarked
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-slate-50 hover:bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? "fill-white" : "text-amber-500"}`} />
                    <span>Saved Notes ({bookmarkedNoteIds.length})</span>
                  </button>

                  <button
                    onClick={handleDownloadAllNotes}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All (ZIP)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Course Filter Tabs & Notes Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
              <div className="flex flex-col gap-4">
                
                {/* Course Selection Tabs */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span>Filter by Enrolled Course:</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setNotesCourseFilter("all")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        notesCourseFilter === "all"
                          ? "bg-brand-primary text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>All Courses</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        notesCourseFilter === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {courseNotesData.length}
                      </span>
                    </button>

                    {courses.map((course) => {
                      const count = courseNotesData.filter((n) => n.courseId === course.id).length;
                      const isSelected = notesCourseFilter === course.id;
                      return (
                        <button
                          key={course.id}
                          onClick={() => setNotesCourseFilter(course.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                            isSelected
                              ? "bg-brand-primary text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                          }`}
                        >
                          <span>{course.icon}</span>
                          <span className="max-w-[180px] truncate">{course.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search & Type Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={notesSearchQuery}
                      onChange={(e) => setNotesSearchQuery(e.target.value)}
                      placeholder="Search lecture notes by topic, keyword, or module..."
                      className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                    {notesSearchQuery && (
                      <button
                        onClick={() => setNotesSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        aria-label="Clear Search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={notesTypeFilter}
                        onChange={(e) => setNotesTypeFilter(e.target.value)}
                        className="pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition cursor-pointer appearance-none"
                      >
                        <option value="all">All Document Types</option>
                        <option value="Lecture Handout">Lecture Handouts</option>
                        <option value="Cheatsheet">Cheatsheets</option>
                        <option value="Architecture Guide">Architecture Guides</option>
                        <option value="Exam Prep">Exam Prep</option>
                      </select>
                      <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {(notesSearchQuery || notesTypeFilter !== "all" || notesCourseFilter !== "all" || onlyBookmarked) && (
                      <button
                        onClick={() => {
                          setNotesSearchQuery("");
                          setNotesTypeFilter("all");
                          setNotesCourseFilter("all");
                          setOnlyBookmarked(false);
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-brand-primary hover:bg-slate-50 transition cursor-pointer"
                        title="Reset Notes Filter"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Active Filter Badges for Notes */}
                {(notesSearchQuery || notesTypeFilter !== "all" || notesCourseFilter !== "all" || onlyBookmarked) && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Active notes filters:</span>

                    {notesCourseFilter !== "all" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                        Course: {courses.find((c) => c.id === notesCourseFilter)?.title || notesCourseFilter}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                          onClick={() => setNotesCourseFilter("all")}
                        />
                      </span>
                    )}

                    {notesTypeFilter !== "all" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                        Type: {notesTypeFilter}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                          onClick={() => setNotesTypeFilter("all")}
                        />
                      </span>
                    )}

                    {onlyBookmarked && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold">
                        Saved Notes Only
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-amber-600"
                          onClick={() => setOnlyBookmarked(false)}
                        />
                      </span>
                    )}

                    {notesSearchQuery && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                        Keyword: "{notesSearchQuery}"
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                          onClick={() => setNotesSearchQuery("")}
                        />
                      </span>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Notes Cards Grid */}
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNotes.map((note) => {
                  const isBookmarked = bookmarkedNoteIds.includes(note.id);

                  return (
                    <div
                      key={note.id}
                      className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 relative group"
                    >
                      <div>
                        {/* Top Row: Course Badge + Bookmark */}
                        <div className="flex items-center justify-between gap-2 mb-3.5">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/80">
                            <span>{note.courseIcon}</span>
                            <span className="truncate max-w-[170px]">{note.courseTitle}</span>
                          </div>

                          <button
                            onClick={(e) => toggleBookmark(note.id, e)}
                            className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition cursor-pointer"
                            aria-label="Bookmark Note"
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                isBookmarked ? "fill-amber-500 text-amber-500" : "text-slate-400"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Module Tag & Note Type */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary">
                            {note.moduleNumber}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[11px] font-semibold text-slate-500">
                            {note.type}
                          </span>
                        </div>

                        {/* Note Title */}
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug min-h-[3rem]">
                          {note.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-500 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                          {note.description}
                        </p>

                        {/* Topic Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {note.topics.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom / Actions */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                            <FileText className="w-3.5 h-3.5 text-brand-primary" />
                            <span>PDF • {note.pages} Pages</span>
                          </div>
                          <span className="font-medium text-slate-400">
                            {note.fileSize}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => {
                              setPreviewingNote(note);
                              setActiveNoteSectionIndex(0);
                            }}
                            className="w-full py-2.5 px-3 bg-brand-primary/10 hover:bg-brand-primary/15 text-brand-primary font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview PDF</span>
                          </button>

                          <button
                            onClick={() => handleDownloadNote(note)}
                            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Notes State */
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  No lecture notes match your filter
                </h3>
                <p className="text-slate-500 mt-1.5 text-xs sm:text-sm max-w-sm mx-auto">
                  Try switching enrolled course tabs or clearing keyword filters to view all available course study materials.
                </p>
                <button
                  onClick={() => {
                    setNotesSearchQuery("");
                    setNotesTypeFilter("all");
                    setNotesCourseFilter("all");
                    setOnlyBookmarked(false);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All PDF Notes</span>
                </button>
              </div>
            )}

          </div>

          {/* Bottom Quick Help / Mentor Callout Banner */}
          <div className="mt-12 bg-gradient-to-r from-slate-900 to-brand-dark text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-slate-800">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shrink-0 text-white shadow-lg shadow-brand-primary/30">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">
                  Need guidance with your course projects?
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  Your AI Career Mentor is ready 24/7 to review your code, explain difficult concepts, and prepare you for interviews.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Ask AI Mentor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      {/* =========================================================
          INTERACTIVE CERTIFICATE PREVIEW MODAL
      ========================================================= */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                  Verified Digital Credential
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Course Completion Certificate
                </h2>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="border-2 border-dashed border-brand-primary/30 rounded-2xl p-6 bg-brand-surface/40 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                    C.
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-slate-900">
                    Careergize Verified
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Tamper-proof
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                This is to officially certify that
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {studentName}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                has successfully completed all required modules, code reviews, and practical assignments for:
              </p>
              <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200/80 font-bold text-brand-primary text-sm">
                {selectedCertificate.title}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/60 text-xs text-slate-600">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Issued On</span>
                  <span className="font-semibold text-slate-800">
                    {selectedCertificate.completedDate || "August 2026"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Credential ID</span>
                  <span className="font-mono font-bold text-brand-primary">
                    {selectedCertificate.certificateId}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                onClick={() => handleShareCertificate(selectedCertificate)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Credential</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  triggerToast(`Downloading certificate PDF for ${selectedCertificate.title}...`);
                }}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          RESUME LEARNING CONFIRMATION MODAL
      ========================================================= */}
      {resumingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setResumingCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
              <PlayCircle className="w-6 h-6" />
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-primary mb-1">
              Resume Workspace
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {resumingCourse.title}
            </h3>

            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Jumping back into your current lesson module:
            </p>

            <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-extrabold text-slate-900">
                {resumingCourse.nextLessonTitle || "Next Scheduled Topic"}
              </p>
              <p className="text-slate-400 mt-1">
                Progress: {resumingCourse.completedLessons} of {resumingCourse.totalLessons} lessons completed ({resumingCourse.progress}%)
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setResumingCourse(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setResumingCourse(null);
                  triggerToast(`Launching lesson player for "${resumingCourse.title}"...`);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Launch Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          COURSE REVIEW MODAL
      ========================================================= */}
      {reviewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setReviewingCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Curriculum Review
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {reviewingCourse.title}
            </h3>

            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              You have completed all {reviewingCourse.totalLessons} lessons in this curriculum track. Review syllabus archives, code repositories, or re-watch lecture recordings anytime.
            </p>

            <div className="mt-4 space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Course Code Repo</span>
                <span className="font-bold text-brand-primary flex items-center gap-1 cursor-pointer hover:underline">
                  GitHub <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">All Lecture Slides & Notes</span>
                <button
                  onClick={() => {
                    const cid = reviewingCourse.id;
                    setReviewingCourse(null);
                    handleJumpToCourseNotes(cid);
                  }}
                  className="font-bold text-brand-primary flex items-center gap-1 cursor-pointer hover:underline"
                >
                  PDF Archive <Download className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setReviewingCourse(null)}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          INTERACTIVE IN-APP PDF READER MODAL
      ========================================================= */}
      {previewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            
            {/* PDF Viewer Header Toolbar */}
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              
              {/* Document Meta */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                      {previewingNote.moduleNumber}
                    </span>
                    <span className="text-xs text-slate-400 truncate hidden sm:inline">
                      {previewingNote.courseTitle}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                    {previewingNote.title}
                  </h3>
                </div>
              </div>

              {/* Center: Zoom Controls & Pagination */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setPdfZoom((prev) => Math.max(75, prev - 15))}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-300 min-w-[3rem] text-center">
                  {pdfZoom}%
                </span>
                <button
                  onClick={() => setPdfZoom((prev) => Math.min(130, prev + 15))}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="h-3 w-px bg-slate-700 mx-1" />
                <span className="text-xs font-semibold text-slate-400">
                  Section {activeNoteSectionIndex + 1} of {previewingNote.previewContent.sections.length}
                </span>
              </div>

              {/* Action Buttons: Bookmark, Download, Close */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => toggleBookmark(previewingNote.id, e)}
                  className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
                  title={bookmarkedNoteIds.includes(previewingNote.id) ? "Remove Bookmark" : "Bookmark Note"}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedNoteIds.includes(previewingNote.id)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-400"
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleDownloadNote(previewingNote)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => setPreviewingNote(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  aria-label="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* PDF Viewer Body: Sidebar & Page Canvas */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Sidebar: Table of Contents */}
              <div className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto shrink-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Table of Contents</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                    {previewingNote.pages} pgs
                  </span>
                </div>

                <div className="space-y-1.5 flex-1">
                  {previewingNote.previewContent.sections.map((sec, idx) => {
                    const isActive = activeNoteSectionIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveNoteSectionIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition cursor-pointer flex items-start gap-2 ${
                          isActive
                            ? "bg-brand-primary text-white font-bold shadow-xs"
                            : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 font-medium"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="line-clamp-2 leading-snug">
                          {sec.heading}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* PDF Document Summary Mini-card in Sidebar */}
                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Instructor:</span>
                    <span className="text-slate-300 font-semibold">{previewingNote.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span className="text-slate-300 font-semibold">{previewingNote.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edition:</span>
                    <span className="text-slate-300 font-semibold">{previewingNote.updatedDate}</span>
                  </div>
                </div>
              </div>

              {/* Main Reader Page Canvas */}
              <div className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col items-center">
                
                {/* Virtual Sheet of Paper (PDF Page) */}
                <div
                  className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-300 max-w-3xl w-full p-6 sm:p-10 transition-all duration-200 relative my-auto"
                  style={{
                    transform: `scale(${pdfZoom / 100})`,
                    transformOrigin: "top center",
                  }}
                >
                  
                  {/* Top Letterhead / Institutional Watermark */}
                  <div className="border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                          C.
                        </div>
                        <div>
                          <div className="text-xs font-black tracking-tight text-slate-900 uppercase">
                            Careergize Learning Hub
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                            Official Verified Lecture Notes • Academic Division
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Authenticated Curriculum
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ID: CG-NOTEDL-{previewingNote.id.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Course Title Header */}
                    <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Curriculum: </span>
                        <span className="font-bold text-slate-800">{previewingNote.courseTitle}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Author: </span>
                        <span className="font-bold text-slate-800">{previewingNote.instructor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Module Title Banner */}
                  <div className="mb-6">
                    <span className="text-xs font-black uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-lg">
                      {previewingNote.moduleNumber} • {previewingNote.type}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
                      {previewingNote.title}
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                      {previewingNote.previewContent.summary}
                    </p>
                  </div>

                  {/* Active Section Content */}
                  {previewingNote.previewContent.sections[activeNoteSectionIndex] && (
                    <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-lg bg-brand-primary text-white flex items-center justify-center text-xs font-bold">
                          {activeNoteSectionIndex + 1}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-900">
                          {previewingNote.previewContent.sections[activeNoteSectionIndex].heading}
                        </h4>
                      </div>

                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                        {previewingNote.previewContent.sections[activeNoteSectionIndex].content}
                      </p>

                      {previewingNote.previewContent.sections[activeNoteSectionIndex].bulletPoints && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-slate-200/80">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Key Principles & Deep-Dive Mechanics:
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {previewingNote.previewContent.sections[activeNoteSectionIndex].bulletPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practical Code Implementation Snippet */}
                  {previewingNote.previewContent.codeSnippets && previewingNote.previewContent.codeSnippets.length > 0 && (
                    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
                      <div className="px-4 py-2.5 bg-slate-900 flex items-center justify-between border-b border-slate-800 text-xs">
                        <div className="flex items-center gap-2 font-mono font-bold text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          <span>{previewingNote.previewContent.codeSnippets[0].title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {previewingNote.previewContent.codeSnippets[0].language}
                          </span>
                          <button
                            onClick={() => handleCopyCode(previewingNote.previewContent.codeSnippets![0].code)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                            title="Copy code"
                          >
                            {isCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-400/90 bg-slate-950">
                        <code>{previewingNote.previewContent.codeSnippets[0].code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Takeaways Revision Box */}
                  <div className="my-6 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Exam & Interview Revision Milestones:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-950">
                      {previewingNote.previewContent.keyTakeaways.map((takeaway, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Simulated PDF Page Footer */}
                  <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Careergize Learning Hub • Academic Publishing</span>
                    <span className="font-mono font-semibold">
                      Section {activeNoteSectionIndex + 1} of {previewingNote.previewContent.sections.length}
                    </span>
                    <span>All Rights Reserved</span>
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom Modal Pagination Bar */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setActiveNoteSectionIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeNoteSectionIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Section</span>
              </button>

              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Section {activeNoteSectionIndex + 1} of {previewingNote.previewContent.sections.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadNote(previewingNote)}
                  className="sm:hidden px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => setActiveNoteSectionIndex((prev) => Math.min(previewingNote.previewContent.sections.length - 1, prev + 1))}
                  disabled={activeNoteSectionIndex === previewingNote.previewContent.sections.length - 1}
                  className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Next Section</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          TOAST FEEDBACK POPUP
      ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-semibold leading-snug">
            {toastMessage}
          </p>
        </div>
      )}

    </div>
  );
}
