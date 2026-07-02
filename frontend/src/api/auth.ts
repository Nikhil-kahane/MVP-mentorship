import api from './config';
import { simulationDB, UserProfile, Course, Booking, Enrollment, Certificate } from './simulation';

// Helper to determine if we fall back to mock simulation (e.g. if we are in development environment with backend offline)
let useSimulationMode = true;

const handleAPICall = async <T>(apiCall: () => Promise<{ data: T }>, simulationCall: () => T): Promise<{ data: T }> => {
  if (useSimulationMode) {
    try {
      const res = await apiCall();
      if (res && res.data && typeof res.data === 'string' && (res.data as string).trim().startsWith('<!DOCTYPE')) {
        throw new Error("Local Vite fallback HTML received instead of JSON.");
      }
      return res;
    } catch (e) {
      console.warn("Backend API request failed, falling back to local simulation:", e);
      return { data: simulationCall() };
    }
  } else {
    try {
      const res = await apiCall();
      if (res && res.data && typeof res.data === 'string' && (res.data as string).trim().startsWith('<!DOCTYPE')) {
        throw new Error("Local Vite fallback HTML received instead of JSON.");
      }
      return res;
    } catch (e) {
      console.warn("API request failed, executing fallback simulation:", e);
      return { data: simulationCall() };
    }
  }
};

export const authAPI = {
  login: async (username: string, password: string) => {
    return handleAPICall(
      () => api.post('/accounts/login/', { username, password }),
      () => {
        const users = simulationDB.getUsers();
        // Just find any user or create one
        let found = users.find(u => u.username === username);
        if (!found) {
          // Fallback allow any login
          found = {
            id: 99,
            username,
            email: `${username}@mentorship.com`,
            role: username.includes('mentor') ? 'mentor' : (username.includes('admin') ? 'admin' : 'student'),
            first_name: username.charAt(0).toUpperCase() + username.slice(1),
            last_name: 'Demo',
            phone_number: '+1 (555) 0192',
            is_approved: true
          };
          simulationDB.setUsers([...users, found]);
        }
        simulationDB.setCurrentUser(found);
        return {
          access: 'mock-access-token',
          refresh: 'mock-refresh-token',
          user: found
        };
      }
    );
  },

  register: async (data: any) => {
    return handleAPICall(
      () => api.post('/accounts/register/', data),
      () => {
        const users = simulationDB.getUsers();
        const newUser: UserProfile = {
          id: Date.now(),
          username: data.username,
          email: data.email,
          role: data.role || 'student',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone_number: data.phone_number || '',
          bio: data.bio || '',
          education: data.education || '',
          expertise: data.expertise || '',
          experience_years: parseInt(data.experience_years || '0'),
          linkedin_url: data.linkedin_url || '',
          is_approved: data.role === 'mentor' ? false : true // Mentors start unapproved
        };
        simulationDB.setUsers([...users, newUser]);
        simulationDB.setCurrentUser(newUser);
        return {
          access: 'mock-access-token',
          refresh: 'mock-refresh-token',
          user: newUser
        };
      }
    );
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await api.post('/accounts/logout/', { refresh: refreshToken });
    } catch {}
    simulationDB.setCurrentUser(null);
    return { data: { success: true } };
  },

  getProfile: async () => {
    return handleAPICall(
      () => api.get('/accounts/profile/'),
      () => {
        const current = simulationDB.getCurrentUser();
        if (!current) throw new Error("Unauthorized");
        return current;
      }
    );
  },

  updateProfile: async (data: any) => {
    return handleAPICall(
      () => api.patch('/accounts/profile/', data),
      () => {
        const current = simulationDB.getCurrentUser();
        if (!current) throw new Error("Unauthorized");
        const updated = { ...current, ...data };
        simulationDB.setCurrentUser(updated);
        return updated;
      }
    );
  },

  changePassword: async (data: any) => {
    return handleAPICall(
      () => api.post('/accounts/change-password/', data),
      () => ({ success: true, message: "Password updated successfully." })
    );
  },

  forgotPassword: async (email: string) => {
    return handleAPICall(
      () => api.post('/accounts/forgot-password/', { email }),
      () => ({ success: true, message: `A password reset link was logged / simulated to ${email}` })
    );
  }
};

export const coursesAPI = {
  getHome: async () => {
    return handleAPICall(
      () => api.get('/courses/home/'),
      () => ({
        featured_courses: simulationDB.getCourses().slice(0, 3)
      })
    );
  },

  getAll: async (params?: { category?: string; search?: string }) => {
    return handleAPICall(
      () => api.get('/courses/', { params }),
      () => {
        let list = simulationDB.getCourses();
        if (params?.category) {
          list = list.filter(c => c.category === params.category);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
        }
        return list;
      }
    );
  },

  getBySlug: async (slug: string) => {
    return handleAPICall(
      () => api.get(`/courses/${slug}/`),
      () => {
        const found = simulationDB.getCourses().find(c => c.slug === slug);
        if (!found) throw new Error("Course not found");
        return found;
      }
    );
  },

  getCategories: async () => {
    return handleAPICall(
      () => api.get('/courses/categories/'),
      () => [
        { value: 'programming', label: 'Programming' },
        { value: 'data_science', label: 'Data Science' },
        { value: 'design', label: 'Design' },
        { value: 'business', label: 'Business' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'other', label: 'Other' }
      ]
    );
  },

  enrollAndComplete: {
    getEnrollments: async () => {
      return handleAPICall(
        () => api.get('/courses/enrollments/'),
        () => simulationDB.getEnrollments()
      );
    },
    saveCourse: async (courseId: number, saved: boolean) => {
      return handleAPICall(
        () => api.post(`/courses/enrollments/${courseId}/save/`, { saved }),
        () => {
          const list = simulationDB.getEnrollments();
          const found = list.find(e => e.course_id === courseId);
          if (found) {
            found.saved = saved;
          } else {
            list.push({ id: Date.now(), course_id: courseId, completed: false, progress: 0, saved });
          }
          simulationDB.setEnrollments(list);
          return { success: true, saved };
        }
      );
    },
    updateProgress: async (courseId: number, progress: number) => {
      return handleAPICall(
        () => api.post(`/courses/enrollments/${courseId}/progress/`, { progress }),
        () => {
          const list = simulationDB.getEnrollments();
          const found = list.find(e => e.course_id === courseId);
          const completed = progress >= 100;
          if (found) {
            found.progress = progress;
            found.completed = completed;
            if (completed) found.completed_at = new Date().toISOString();
          } else {
            list.push({
              id: Date.now(),
              course_id: courseId,
              completed,
              progress,
              saved: false,
              completed_at: completed ? new Date().toISOString() : undefined
            });
          }
          simulationDB.setEnrollments(list);
          return { success: true, progress, completed };
        }
      );
    }
  }
};

export const bookingsAPI = {
  getAll: async () => {
    return handleAPICall(
      () => api.get('/bookings/'),
      () => {
        const current = simulationDB.getCurrentUser();
        const list = simulationDB.getBookings();
        if (!current) return [];
        if (current.role === 'student') {
          return list.filter(b => b.student_id === current.id);
        } else {
          return list.filter(b => b.mentor_id === current.id);
        }
      }
    );
  },

  create: async (data: { course_slug: string; session_date: string }) => {
    return handleAPICall(
      () => api.post('/bookings/create/', data),
      () => {
        const current = simulationDB.getCurrentUser();
        if (!current) throw new Error("Unauthorized");
        const course = simulationDB.getCourses().find(c => c.slug === data.course_slug);
        if (!course) throw new Error("Course not found");

        const newBooking: Booking = {
          id: Date.now(),
          student_id: current.id,
          student_name: `${current.first_name} ${current.last_name}`,
          mentor_id: course.mentor_id,
          mentor_name: course.mentor_name,
          course_id: course.id,
          course_title: course.title,
          course,
          session_date: data.session_date,
          status: 'pending',
          created_at: new Date().toISOString()
        };

        const bookings = simulationDB.getBookings();
        simulationDB.setBookings([newBooking, ...bookings]);
        return newBooking;
      }
    );
  },

  getById: async (id: number) => {
    return handleAPICall(
      () => api.get(`/bookings/${id}/`),
      () => {
        const found = simulationDB.getBookings().find(b => b.id === id);
        if (!found) throw new Error("Booking not found");
        return found;
      }
    );
  },

  cancel: async (id: number) => {
    return handleAPICall(
      () => api.post(`/bookings/${id}/cancel/`),
      () => {
        const bookings = simulationDB.getBookings();
        const idx = bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
          bookings[idx].status = 'cancelled';
          simulationDB.setBookings(bookings);
        }
        return { success: true };
      }
    );
  },

  completeSession: async (id: number) => {
    return handleAPICall(
      () => api.post(`/bookings/${id}/complete/`),
      () => {
        const bookings = simulationDB.getBookings();
        const idx = bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
          bookings[idx].status = 'completed';
          simulationDB.setBookings(bookings);

          // Auto trigger complete enrollment progress!
          const booking = bookings[idx];
          const enrollments = simulationDB.getEnrollments();
          const found = enrollments.find(e => e.course_id === booking.course_id);
          if (found) {
            found.progress = 100;
            found.completed = true;
            found.completed_at = new Date().toISOString();
          } else {
            enrollments.push({
              id: Date.now(),
              course_id: booking.course_id,
              completed: true,
              progress: 100,
              saved: false,
              completed_at: new Date().toISOString()
            });
          }
          simulationDB.setEnrollments(enrollments);
        }
        return { success: true };
      }
    );
  },

  getMentorAvailabilities: async (mentorId: number) => {
    return handleAPICall(
      () => api.get(`/bookings/availabilities/${mentorId}/`),
      () => {
        return simulationDB.getAvailabilities().filter(a => a.mentor_id === mentorId);
      }
    );
  },

  manageMentorSlots: {
    addSlot: async (time: string) => {
      return handleAPICall(
        () => api.post('/bookings/availabilities/add/', { time }),
        () => {
          const current = simulationDB.getCurrentUser();
          if (!current || current.role !== 'mentor') throw new Error("Unauthorized");
          const slots = simulationDB.getAvailabilities();
          const newSlot = {
            id: Date.now(),
            mentor_id: current.id,
            time,
            is_booked: false
          };
          simulationDB.setAvailabilities([...slots, newSlot]);
          return newSlot;
        }
      );
    },
    removeSlot: async (slotId: number) => {
      return handleAPICall(
        () => api.delete(`/bookings/availabilities/${slotId}/`),
        () => {
          const slots = simulationDB.getAvailabilities();
          simulationDB.setAvailabilities(slots.filter(s => s.id !== slotId));
          return { success: true };
        }
      );
    }
  }
};

export const paymentsAPI = {
  create: async (data: { booking_id: number; amount: number; payment_reference: string }) => {
    return handleAPICall(
      () => api.post('/payments/create/', data),
      () => {
        const bookings = simulationDB.getBookings();
        const idx = bookings.findIndex(b => b.id === data.booking_id);
        if (idx !== -1) {
          bookings[idx].status = 'booked';
          simulationDB.setBookings(bookings);
        }
        return { success: true, reference: data.payment_reference };
      }
    );
  },

  getByBooking: async (bookingId: number) => {
    return handleAPICall(
      () => api.get(`/payments/booking/${bookingId}/`),
      () => ({
        booking_id: bookingId,
        amount: 99.99,
        payment_status: 'success',
        payment_reference: `PAY-MOCK-${bookingId}-${Date.now()}`
      })
    );
  }
};

export const dashboardAPI = {
  getRedirect: async () => {
    return handleAPICall(
      () => api.get('/dashboards/'),
      () => {
        const current = simulationDB.getCurrentUser();
        return { redirect_to: current?.role === 'mentor' ? '/dashboard' : '/dashboard' };
      }
    );
  },

  getStudent: async () => {
    return handleAPICall(
      () => api.get('/dashboards/student/'),
      () => {
        const current = simulationDB.getCurrentUser();
        const bookings = simulationDB.getBookings().filter(b => b.student_id === current?.id);
        const now = new Date();

        return {
          total_bookings: bookings.length,
          upcoming_sessions: bookings.filter(b => b.status === 'booked' && new Date(b.session_date) > now),
          recent_bookings: bookings.filter(b => b.status !== 'booked' || new Date(b.session_date) <= now)
        };
      }
    );
  },

  getMentor: async () => {
    return handleAPICall(
      () => api.get('/dashboards/mentor/'),
      () => {
        const current = simulationDB.getCurrentUser();
        const bookings = simulationDB.getBookings().filter(b => b.mentor_id === current?.id);
        const myCourses = simulationDB.getCourses().filter(c => c.mentor_id === current?.id);
        const now = new Date();

        return {
          total_bookings: bookings.length,
          courses: myCourses,
          upcoming_sessions: bookings.filter(b => b.status === 'booked' && new Date(b.session_date) > now),
          recent_bookings: bookings.filter(b => b.status !== 'booked' || new Date(b.session_date) <= now)
        };
      }
    );
  }
};

export const certificatesAPI = {
  getGallery: async () => {
    return handleAPICall(
      () => api.get('/accounts/certificates/'),
      () => {
        const current = simulationDB.getCurrentUser();
        if (!current) return [];
        return simulationDB.getCertificates().filter(c => c.mentor_id === current.id);
      }
    );
  },
  uploadCertificate: async (title: string, fileName: string) => {
    return handleAPICall(
      () => api.post('/accounts/certificates/upload/', { title, fileName }),
      () => {
        const current = simulationDB.getCurrentUser();
        if (!current || current.role !== 'mentor') throw new Error("Unauthorized");
        const list = simulationDB.getCertificates();
        const newCert: Certificate = {
          id: Date.now(),
          mentor_id: current.id,
          title,
          fileName,
          uploaded_at: new Date().toISOString()
        };
        simulationDB.setCertificates([...list, newCert]);
        return newCert;
      }
    );
  },
  removeCertificate: async (id: number) => {
    return handleAPICall(
      () => api.delete(`/accounts/certificates/${id}/`),
      () => {
        const list = simulationDB.getCertificates();
        simulationDB.setCertificates(list.filter(c => c.id !== id));
        return { success: true };
      }
    );
  }
};

export const adminAPI = {
  getApprovalList: async () => {
    return handleAPICall(
      () => api.get('/admin-workflow/mentors/'),
      () => {
        const users = simulationDB.getUsers();
        return users.filter(u => u.role === 'mentor');
      }
    );
  },
  approveMentor: async (id: number, approved: boolean) => {
    return handleAPICall(
      () => api.post(`/admin-workflow/mentors/${id}/approve/`, { approved }),
      () => {
        const users = simulationDB.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
          users[index].is_approved = approved;
          simulationDB.setUsers(users);

          // update currently logged in if same
          const cur = simulationDB.getCurrentUser();
          if (cur && cur.id === id) {
            cur.is_approved = approved;
            simulationDB.setCurrentUser(cur);
          }
        }
        return { success: true, id, is_approved: approved };
      }
    );
  },
  getAllFiles: async () => {
    return handleAPICall(
      () => api.get('/admin-workflow/documents/'),
      () => {
        const users = simulationDB.getUsers();
        const docs: any[] = [];
        users.forEach(u => {
          if (u.resume_name) {
            docs.push({
              id: `resume-${u.id}`,
              owner: `${u.first_name} ${u.last_name}`,
              role: u.role,
              doc_type: 'resume',
              fileName: u.resume_name,
              uploaded_at: new Date(Date.now() - 86400000).toLocaleString()
            });
          }
        });
        simulationDB.getCertificates().forEach(c => {
          const mentor = users.find(u => u.id === c.mentor_id);
          docs.push({
            id: `cert-${c.id}`,
            owner: mentor ? `${mentor.first_name} ${mentor.last_name}` : 'Unknown Mentor',
            role: 'mentor',
            doc_type: 'qualification_certificate',
            fileName: c.fileName,
            uploaded_at: new Date(c.uploaded_at).toLocaleString()
          });
        });
        return docs;
      }
    );
  }
};
