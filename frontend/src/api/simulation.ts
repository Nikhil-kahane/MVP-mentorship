// High-Fidelity Local State Simulation Engine for local preview
// Prevents network errors from blocking the review of new features

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image?: string;
  bio?: string;
  education?: string;
  expertise?: string;
  experience_years?: number;
  linkedin_url?: string;
  resume_name?: string;
  portfolio_url?: string;
  is_approved?: boolean;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  duration: string;
  thumbnail?: string;
  mentor_id: number;
  mentor_name: string;
  created_at: string;
}

export interface Booking {
  id: number;
  student_id: number;
  student_name: string;
  mentor_id: number;
  mentor_name: string;
  course_id: number;
  course_title: string;
  course: Course;
  session_date: string;
  status: 'pending' | 'booked' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Enrollment {
  id: number;
  course_id: number;
  completed: boolean;
  progress: number; // 0 to 100
  saved: boolean;
  completed_at?: string;
}

export interface Certificate {
  id: number;
  mentor_id: number;
  title: string;
  fileName: string;
  uploaded_at: string;
}

// Initial Mock Datasets
const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    title: 'Full Stack React & Django',
    slug: 'full-stack-react-django',
    description: 'Learn to build highly scalable 3-tier production applications using modern React/Vite frontend and Django REST Framework backend.',
    category: 'programming',
    duration: '8 weeks',
    mentor_id: 1,
    mentor_name: 'Dr. Sarah Jenkins',
    created_at: '2026-01-10T12:00:00Z'
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning Bootcamp',
    slug: 'data-science-ml-bootcamp',
    description: 'Master data analysis, statistical modeling, supervised/unsupervised algorithms, and neural networks with pandas, scikit-learn, and TensorFlow.',
    category: 'data_science',
    duration: '10 weeks',
    mentor_id: 2,
    mentor_name: 'Prof. Alan Turing',
    created_at: '2026-01-15T12:00:00Z'
  },
  {
    id: 3,
    title: 'Figma to Code: UI/UX Masterclass',
    slug: 'figma-to-code-uiux',
    description: 'A comprehensive guide to modern user experience research, interactive prototyping, and responsive design systems using Figma and Tailwind CSS.',
    category: 'design',
    duration: '6 weeks',
    mentor_id: 3,
    mentor_name: 'Elena Rostova',
    created_at: '2026-02-01T12:00:00Z'
  },
  {
    id: 4,
    title: 'Startup Scaling: Business Operations',
    slug: 'startup-scaling-biz',
    description: 'Practical tactics and strategies for early-stage startup founders on structuring teams, managing cashflow, marketing, and navigating VC funding rounds.',
    category: 'business',
    duration: '4 weeks',
    mentor_id: 4,
    mentor_name: 'Marcus Sterling',
    created_at: '2026-02-10T12:00:00Z'
  },
  {
    id: 5,
    title: 'Digital Marketing & Growth Hacking',
    slug: 'digital-marketing-growth',
    description: 'Examine key methodologies of performance marketing: SEO engines, high-conversion email funnels, paid advertising, and viral marketing loops.',
    category: 'marketing',
    duration: '5 weeks',
    mentor_id: 5,
    mentor_name: 'Diana Prince',
    created_at: '2026-02-12T12:00:00Z'
  }
];

const INITIAL_MENTORS: UserProfile[] = [
  {
    id: 1,
    username: 'sarah_m',
    email: 'sarah@mentorship.com',
    role: 'mentor',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    phone_number: '+1 (555) 0192',
    bio: 'Ex-Google Staff Engineer. Specialized in full-stack clean architecture, scalable databases, and cloud engineering deployments.',
    education: 'Ph.D. in Computer Science',
    expertise: 'React, Django, PostgreSQL, AWS, Clean Architecture',
    experience_years: 12,
    linkedin_url: 'https://linkedin.com/in/sarahjenkins',
    is_approved: true
  },
  {
    id: 2,
    username: 'alan_t',
    email: 'alan@mentorship.com',
    role: 'mentor',
    first_name: 'Alan',
    last_name: 'Turing',
    phone_number: '+1 (555) 0193',
    bio: 'Staff Data Scientist with a deep interest in artificial intelligence, mathematical optimization models, and predictive logistics.',
    education: 'M.S. in Applied Mathematics',
    expertise: 'Python, Pandas, TensorFlow, Deep Learning',
    experience_years: 8,
    linkedin_url: 'https://linkedin.com/in/alanturing',
    is_approved: true
  },
  {
    id: 3,
    username: 'elena_r',
    email: 'elena@mentorship.com',
    role: 'mentor',
    first_name: 'Elena',
    last_name: 'Rostova',
    phone_number: '+1 (555) 0194',
    bio: 'Lead UX Designer at multi-billion dollar scale-ups. Focused on building intuitive design languages and highly usable layouts.',
    education: 'B.F.A. in Interactive Design',
    expertise: 'Figma, User Research, Accessibility, Design Systems',
    experience_years: 10,
    linkedin_url: 'https://linkedin.com/in/elenarostova',
    is_approved: false // Pending approval
  }
];

// Helper to initialize LocalStorage storage
const getStorageItem = <T>(key: string, initial: T): T => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(item);
};

const setStorageItem = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const simulationDB = {
  getUsers: () => getStorageItem<UserProfile[]>('sim_users', [
    {
      id: 99,
      username: 'student_demo',
      email: 'demo@student.com',
      role: 'student',
      first_name: 'Alex',
      last_name: 'Walker',
      phone_number: '+1-555-4321',
      bio: 'Enthusiastic software learner wishing to upgrade skills in cloud systems and API structure.',
      education: 'B.S. Information Systems',
      is_approved: true
    },
    ...INITIAL_MENTORS
  ]),
  setUsers: (users: UserProfile[]) => setStorageItem('sim_users', users),

  getCourses: () => getStorageItem<Course[]>('sim_courses', INITIAL_COURSES),
  setCourses: (courses: Course[]) => setStorageItem('sim_courses', courses),

  getBookings: () => {
    const list = getStorageItem<Booking[]>('sim_bookings', []);
    if (list.length === 0) {
      // Create some default bookings
      const defaultBookings: Booking[] = [
        {
          id: 1,
          student_id: 99,
          student_name: 'Alex Walker',
          mentor_id: 1,
          mentor_name: 'Sarah Jenkins',
          course_id: 1,
          course_title: 'Full Stack React & Django',
          course: INITIAL_COURSES[0],
          session_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days in future
          status: 'booked',
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 2,
          student_id: 99,
          student_name: 'Alex Walker',
          mentor_id: 2,
          mentor_name: 'Alan Turing',
          course_id: 2,
          course_title: 'Data Science & Machine Learning Bootcamp',
          course: INITIAL_COURSES[1],
          session_date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days in past
          status: 'completed',
          created_at: new Date(Date.now() - 86400000 * 10).toISOString()
        }
      ];
      localStorage.setItem('sim_bookings', JSON.stringify(defaultBookings));
      return defaultBookings;
    }
    return list;
  },
  setBookings: (bookings: Booking[]) => setStorageItem('sim_bookings', bookings),

  getEnrollments: () => getStorageItem<Enrollment[]>('sim_enrollments', [
    { id: 1, course_id: 1, completed: false, progress: 45, saved: false },
    { id: 2, course_id: 2, completed: true, progress: 100, saved: false }
  ]),
  setEnrollments: (enrollments: Enrollment[]) => setStorageItem('sim_enrollments', enrollments),

  getCertificates: () => getStorageItem<Certificate[]>('sim_cert_gallery', []),
  setCertificates: (certs: Certificate[]) => setStorageItem('sim_cert_gallery', certs),

  getAvailabilities: () => getStorageItem<{id: number, mentor_id: number, time: string, is_booked: boolean}[]>('sim_availabilities', [
    { id: 1, mentor_id: 1, time: new Date(Date.now() + 86400000 * 3).toISOString(), is_booked: false },
    { id: 2, mentor_id: 1, time: new Date(Date.now() + 86400000 * 4).toISOString(), is_booked: false },
    { id: 3, mentor_id: 2, time: new Date(Date.now() + 86400000 * 2).toISOString(), is_booked: false }
  ]),
  setAvailabilities: (avails: any[]) => setStorageItem('sim_availabilities', avails),

  // Session user storage
  getCurrentUser: (): UserProfile | null => {
    const userStr = localStorage.getItem('sim_current_user');
    if (!userStr) {
      // Default to Alexander student
      const users = simulationDB.getUsers();
      const demoStu = users.find(u => u.id === 99);
      if (demoStu) {
        localStorage.setItem('sim_current_user', JSON.stringify(demoStu));
        return demoStu;
      }
    }
    return userStr ? JSON.parse(userStr) : null;
  },
  setCurrentUser: (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem('sim_current_user', JSON.stringify(user));
      const users = simulationDB.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        simulationDB.setUsers(users);
      }
    } else {
      localStorage.removeItem('sim_current_user');
    }
  }
};
