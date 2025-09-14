import { User, School, Course, Material, Class, Enrollment, BulkStudentData, BulkUploadResult } from '../types';

export const schools: School[] = [
  {
    id: 1,
    name: "Kampala Primary School",
    address: "Plot 123, Kampala Road, Central Division, Kampala",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    name: "Makerere College School",
    address: "Makerere Hill, Kawempe Division, Kampala",
    created_at: "2024-02-20"
  },
  {
    id: 3,
    name: "Buddo Junior School",
    address: "Buddo, Wakiso District, Central Region",
    created_at: "2024-03-10"
  },
  {
    id: 4,
    name: "Jinja Primary School",
    address: "Jinja Main Street, Jinja Municipality, Eastern Region",
    created_at: "2023-08-15"
  },
  {
    id: 5,
    name: "Mbale Secondary School",
    address: "Republic Street, Mbale Municipality, Eastern Region",
    created_at: "2023-09-01"
  },
  {
    id: 6,
    name: "Mbarara High School",
    address: "High Street, Mbarara Municipality, Western Region",
    created_at: "2023-07-20"
  },
  {
    id: 7,
    name: "Entebbe Junior School",
    address: "Church Road, Entebbe Municipality, Central Region",
    created_at: "2023-10-05"
  },
  {
    id: 8,
    name: "Nakasero Primary School",
    address: "Nakasero Hill, Central Division, Kampala",
    created_at: "2024-01-08"
  },
  {
    id: 9,
    name: "Gulu Secondary School",
    address: "Coronation Road, Gulu Municipality, Northern Region",
    created_at: "2023-11-12"
  },
  {
    id: 10,
    name: "Masaka College School",
    address: "Circular Road, Masaka Municipality, Central Region",
    created_at: "2023-12-03"
  }
];

export const classes: Class[] = [
  // Kampala Primary School (ID: 1)
  { id: 1, name: "Primary 1 Red", school_id: 1, grade_level: "Primary 1", created_at: "2024-01-20" },
  { id: 2, name: "Primary 1 Blue", school_id: 1, grade_level: "Primary 1", created_at: "2024-01-20" },
  { id: 3, name: "Primary 2 Green", school_id: 1, grade_level: "Primary 2", created_at: "2024-01-20" },
  { id: 4, name: "Primary 3 Yellow", school_id: 1, grade_level: "Primary 3", created_at: "2024-01-20" },
  { id: 5, name: "Primary 4 Orange", school_id: 1, grade_level: "Primary 4", created_at: "2024-01-20" },

  // Makerere College School (ID: 2)
  { id: 6, name: "Senior 1 Alpha", school_id: 2, grade_level: "Senior 1", created_at: "2024-02-15" },
  { id: 7, name: "Senior 1 Beta", school_id: 2, grade_level: "Senior 1", created_at: "2024-02-15" },
  { id: 8, name: "Senior 2 Alpha", school_id: 2, grade_level: "Senior 2", created_at: "2024-02-15" },
  { id: 9, name: "Senior 3 Alpha", school_id: 2, grade_level: "Senior 3", created_at: "2024-02-15" },
  { id: 10, name: "Senior 4 Alpha", school_id: 2, grade_level: "Senior 4", created_at: "2024-02-15" },

  // Buddo Junior School (ID: 3)
  { id: 11, name: "Senior 5 Arts", school_id: 3, grade_level: "Senior 5", created_at: "2024-03-12" },
  { id: 12, name: "Senior 5 Sciences", school_id: 3, grade_level: "Senior 5", created_at: "2024-03-12" },
  { id: 13, name: "Senior 6 Arts", school_id: 3, grade_level: "Senior 6", created_at: "2024-03-12" },
  { id: 14, name: "Senior 6 Sciences", school_id: 3, grade_level: "Senior 6", created_at: "2024-03-12" },
  { id: 15, name: "Senior 4 Science", school_id: 3, grade_level: "Senior 4", created_at: "2024-03-12" },

  // Jinja Primary School (ID: 4)
  { id: 16, name: "Baby Class A", school_id: 4, grade_level: "Baby Class", created_at: "2024-01-10" },
  { id: 17, name: "Baby Class B", school_id: 4, grade_level: "Baby Class", created_at: "2024-01-10" },
  { id: 18, name: "Primary 1 Eagles", school_id: 4, grade_level: "Primary 1", created_at: "2024-01-10" },
  { id: 19, name: "Primary 2 Lions", school_id: 4, grade_level: "Primary 2", created_at: "2024-01-10" },

  // Mbale Secondary School (ID: 5)
  { id: 20, name: "Senior 1 A", school_id: 5, grade_level: "Senior 1", created_at: "2024-02-01" },
  { id: 21, name: "Senior 1 B", school_id: 5, grade_level: "Senior 1", created_at: "2024-02-01" },
  { id: 22, name: "Senior 2 A", school_id: 5, grade_level: "Senior 2", created_at: "2024-02-01" },
  { id: 23, name: "Senior 3 A", school_id: 5, grade_level: "Senior 3", created_at: "2024-02-01" },
];

export let users: User[] = [
  // Super Admin
  {
    id: 1,
    name: "Edmond Tutu",
    email: "edmond@system.com",
    username: "edmond",
    password: "admin123",
    role: "super_admin"
  },

  // School Admins
  {
    id: 2,
    name: "Sarah Nalwanga",
    email: "sarah@kampala.primary.ug",
    username: "sarah.nalwanga",
    password: "password123",
    role: "school_admin",
    school_ids: [1],
    current_school_id: 1
  },
  {
    id: 3,
    name: "James Kirunda",
    email: "james@makerere.college.ug",
    username: "james.k",
    password: "admin789",
    role: "school_admin",
    school_ids: [2, 3],
    current_school_id: 2
  },
  {
    id: 4,
    name: "Grace Namukasa",
    email: "grace@jinja.primary.ug",
    username: "grace.namukasa",
    password: "admin456",
    role: "school_admin",
    school_ids: [4],
    current_school_id: 4
  },
  {
    id: 5,
    name: "David Wanyama",
    email: "david@mbale.secondary.ug",
    username: "david.wanyama",
    password: "admin654",
    role: "school_admin",
    school_ids: [5],
    current_school_id: 5
  },

  // Teachers
  {
    id: 10,
    name: "Mary Nakato",
    email: "mary@kampala.primary.ug",
    username: "mary.n",
    password: "teacher123",
    role: "teacher",
    school_ids: [1, 2],
    current_school_id: 1,
    class_ids: [1, 2, 6]
  },
  {
    id: 11,
    name: "Peter Ssebugwawo",
    email: "peter@makerere.college.ug",
    username: "peter.ssebugwawo",
    password: "teacher456",
    role: "teacher",
    school_ids: [2],
    current_school_id: 2,
    class_ids: [7, 8]
  },
  {
    id: 12,
    name: "Rebecca Atukunda",
    email: "rebecca@kampala.primary.ug",
    username: "rebecca.atukunda",
    password: "teacher789",
    role: "teacher",
    school_ids: [1],
    current_school_id: 1,
    class_ids: [3, 4, 5]
  },
  {
    id: 13,
    name: "Moses Okello",
    email: "moses@buddo.junior.ug",
    username: "moses.okello",
    password: "teacher321",
    role: "teacher",
    school_ids: [3],
    current_school_id: 3,
    class_ids: [11, 12]
  },
  {
    id: 14,
    name: "Agnes Nambi",
    email: "agnes@jinja.primary.ug",
    username: "agnes.nambi",
    password: "teacher654",
    role: "teacher",
    school_ids: [4],
    current_school_id: 4,
    class_ids: [16, 17]
  },
  {
    id: 15,
    name: "Francis Lubega",
    email: "francis@mbale.secondary.ug",
    username: "francis.lubega",
    password: "teacher987",
    role: "teacher",
    school_ids: [5],
    current_school_id: 5,
    class_ids: [20, 21]
  },

  // Students
  {
    id: 31,
    name: "John Mukasa",
    email: "john@kampala.primary.ug",
    username: "john.m",
    password: "student123",
    role: "student",
    school_ids: [1],
    current_school_id: 1,
    class_ids: [1],
    enrolled_courses: [1],
    enrolled_at: { 1: "2024-01-25" }
  },
  {
    id: 32,
    name: "Esther Nakimuli",
    email: "esther@makerere.college.ug",
    username: "esther.nakimuli",
    password: "student456",
    role: "student",
    school_ids: [2],
    current_school_id: 2,
    class_ids: [6],
    enrolled_courses: [5],
    enrolled_at: { 5: "2024-02-20" }
  },
  {
    id: 33,
    name: "Andrew Kato",
    email: "andrew@kampala.primary.ug",
    username: "andrew.kato",
    password: "student789",
    role: "student",
    school_ids: [1],
    current_school_id: 1,
    class_ids: [2],
    enrolled_courses: [1],
    enrolled_at: { 1: "2024-01-25" }
  },
  {
    id: 34,
    name: "Patricia Namutebi",
    email: "patricia@makerere.college.ug",
    username: "patricia.namutebi",
    password: "student321",
    role: "student",
    school_ids: [2],
    current_school_id: 2,
    class_ids: [7],
    enrolled_courses: [5, 7],
    enrolled_at: { 5: "2024-02-20", 7: "2024-02-25" }
  },
  {
    id: 35,
    name: "Samuel Obwoya",
    email: "samuel@buddo.junior.ug",
    username: "samuel.obwoya",
    password: "student654",
    role: "student",
    school_ids: [3],
    current_school_id: 3,
    class_ids: [11],
    enrolled_courses: [9],
    enrolled_at: { 9: "2024-03-20" }
  },
  {
    id: 36,
    name: "Charity Akello",
    email: "charity@jinja.primary.ug",
    username: "charity.akello",
    password: "student987",
    role: "student",
    school_ids: [4],
    current_school_id: 4,
    class_ids: [16],
    enrolled_courses: [10],
    enrolled_at: { 10: "2024-01-15" }
  },
  {
    id: 37,
    name: "Michael Tusiime",
    email: "michael@mbale.secondary.ug",
    username: "michael.tusiime",
    password: "student147",
    role: "student",
    school_ids: [5],
    current_school_id: 5,
    class_ids: [20],
    enrolled_courses: [13],
    enrolled_at: { 13: "2024-02-05" }
  },
  {
    id: 38,
    name: "Joan Namugga",
    email: "joan@kampala.primary.ug",
    username: "joan.namugga",
    password: "student258",
    role: "student",
    school_ids: [1],
    current_school_id: 1,
    class_ids: [3],
    enrolled_courses: [2, 3],
    enrolled_at: { 2: "2024-03-05", 3: "2024-01-30" }
  },
  {
    id: 39,
    name: "Simon Nsubuga",
    email: "simon@makerere.college.ug",
    username: "simon.nsubuga",
    password: "student369",
    role: "student",
    school_ids: [2],
    current_school_id: 2,
    class_ids: [8],
    enrolled_courses: [6],
    enrolled_at: { 6: "2024-03-20" }
  },
  {
    id: 40,
    name: "Immaculate Nakabuye",
    email: "immaculate@buddo.junior.ug",
    username: "immaculate.nakabuye",
    password: "student741",
    role: "student",
    school_ids: [3],
    current_school_id: 3,
    class_ids: [12],
    enrolled_courses: [9],
    enrolled_at: { 9: "2024-03-20" }
  },
  {
    id: 41,
    name: "Joseph Wamala",
    email: "joseph@jinja.primary.ug",
    username: "joseph.wamala",
    password: "student852",
    role: "student",
    school_ids: [4],
    current_school_id: 4,
    class_ids: [17],
    enrolled_courses: [11],
    enrolled_at: { 11: "2024-01-20" }
  },
  {
    id: 42,
    name: "Winnie Namukwaya",
    email: "winnie@mbale.secondary.ug",
    username: "winnie.namukwaya",
    password: "student963",
    role: "student",
    school_ids: [5],
    current_school_id: 5,
    class_ids: [21],
    enrolled_courses: [13],
    enrolled_at: { 13: "2024-02-05" }
  },
  {
    id: 43,
    name: "Fred Kiprotich",
    email: "fred@kampala.primary.ug",
    username: "fred.kiprotich",
    password: "student159",
    role: "student",
    school_ids: [1],
    current_school_id: 1,
    class_ids: [4],
    enrolled_courses: [3, 4],
    enrolled_at: { 3: "2024-01-30", 4: "2024-02-15" }
  },
  {
    id: 44,
    name: "Christine Nalule",
    email: "christine@makerere.college.ug",
    username: "christine.nalule",
    password: "student357",
    role: "student",
    school_ids: [2],
    current_school_id: 2,
    class_ids: [9],
    enrolled_courses: [7],
    enrolled_at: { 7: "2024-02-25" }
  },
  {
    id: 45,
    name: "Ronald Byamugisha",
    email: "ronald@buddo.junior.ug",
    username: "ronald.byamugisha",
    password: "student468",
    role: "student",
    school_ids: [3],
    current_school_id: 3,
    class_ids: [13],
    enrolled_courses: [8],
    enrolled_at: { 8: "2024-03-15" }
  }
];

export let courses: Course[] = [
  // Kampala Primary School (ID: 1)
  {
    id: 1,
    name: "Mathematics",
    description: "Introduction to numeracy concepts including counting, addition, subtraction, multiplication, and division. Foundation for PLE mathematics preparation.",
    school_id: 1,
    teacher_id: 10,
    class_ids: [1, 2],
    created_at: "2024-01-20",
    self_enrollment: true,
    enrolled_students: [31, 33],
    max_students: 30
  },
  {
    id: 2,
    name: "English Language",
    description: "Reading, writing, speaking, and listening skills development. Grammar, vocabulary, and comprehension for effective communication in English.",
    school_id: 1,
    teacher_id: 10,
    class_ids: [3, 4],
    created_at: "2024-03-01",
    self_enrollment: false,
    enrolled_students: [38],
    max_students: 25
  },
  {
    id: 3,
    name: "Social Studies",
    description: "Study of Ugandan history, geography, civics, and culture. Understanding of national identity, government structures, and social responsibilities.",
    school_id: 1,
    teacher_id: 12,
    class_ids: [4, 5],
    created_at: "2024-01-25",
    self_enrollment: true,
    enrolled_students: [38, 43],
    max_students: 28
  },
  {
    id: 4,
    name: "Integrated Science",
    description: "Basic science concepts covering plants, animals, human body, and environmental science. Hands-on experiments and observations.",
    school_id: 1,
    teacher_id: 12,
    class_ids: [5],
    created_at: "2024-02-10",
    self_enrollment: false,
    enrolled_students: [43],
    max_students: 20
  },

  // Makerere College School (ID: 2)
  {
    id: 5,
    name: "Biology",
    description: "Study of living organisms, cell structure, genetics, ecology, and human biology. Laboratory practicals and field work included.",
    school_id: 2,
    teacher_id: 11,
    class_ids: [6, 7],
    created_at: "2024-02-15",
    self_enrollment: true,
    enrolled_students: [32, 34],
    max_students: 24
  },
  {
    id: 6,
    name: "Chemistry",
    description: "Introduction to chemical principles, atomic structure, chemical bonding, and reactions. Laboratory experiments and safety protocols.",
    school_id: 2,
    teacher_id: 10,
    class_ids: [8, 9],
    created_at: "2024-03-15",
    self_enrollment: false,
    enrolled_students: [39],
    max_students: 22
  },
  {
    id: 7,
    name: "Advanced Mathematics",
    description: "Algebra, geometry, trigonometry, and calculus basics. Preparation for UACE mathematics and university entrance requirements.",
    school_id: 2,
    teacher_id: 11,
    class_ids: [9, 10],
    created_at: "2024-02-20",
    self_enrollment: true,
    enrolled_students: [34, 44],
    max_students: 26
  },
  // Buddo Junior School (ID: 3)
  {
    id: 8,
    name: "Advanced Level Mathematics",
    description: "Pure mathematics and applied mathematics for UACE. Covers calculus, statistics, and mechanics for university preparation.",
    school_id: 3,
    teacher_id: 13,
    class_ids: [14, 15],
    created_at: "2024-03-12",
    self_enrollment: false,
    enrolled_students: [45],
    max_students: 18
  },
  {
    id: 9,
    name: "Literature in English",
    description: "Study of poetry, drama, and prose from African, European, and American authors. Critical analysis and creative writing skills.",
    school_id: 3,
    teacher_id: 13,
    class_ids: [11, 12, 13],
    created_at: "2024-03-18",
    self_enrollment: true,
    enrolled_students: [35, 40],
    max_students: 30
  },

  // Jinja Primary School (ID: 4)
  {
    id: 10,
    name: "Primary Mathematics",
    description: "Basic numeracy skills for young learners. Numbers, shapes, measurements, and simple problem solving using local contexts.",
    school_id: 4,
    teacher_id: 14,
    class_ids: [16, 17, 18],
    created_at: "2024-01-10",
    self_enrollment: false,
    enrolled_students: [36],
    max_students: 25
  },
  {
    id: 11,
    name: "Luganda Language",
    description: "Local language instruction in Luganda. Reading, writing, speaking, and cultural appreciation of Buganda traditions.",
    school_id: 4,
    teacher_id: 14,
    class_ids: [18, 19],
    created_at: "2024-01-12",
    self_enrollment: false,
    enrolled_students: [41],
    max_students: 22
  },

  // Mbale Secondary School (ID: 5)
  {
    id: 12,
    name: "Ordinary Level Mathematics",
    description: "Comprehensive mathematics covering algebra, geometry, trigonometry, and statistics. Preparation for UCE examination.",
    school_id: 5,
    teacher_id: 15,
    class_ids: [22, 23],
    created_at: "2024-02-01",
    self_enrollment: true,
    enrolled_students: [],
    max_students: 28
  },
  {
    id: 13,
    name: "Geography",
    description: "Physical and human geography of Uganda, East Africa, and the world. Map reading, climate, population, and economic activities.",
    school_id: 5,
    teacher_id: 15,
    class_ids: [20, 21],
    created_at: "2024-02-03",
    self_enrollment: true,
    enrolled_students: [37, 42],
    max_students: 26
  }
];

export const materials: Material[] = [
  // Materials for Kampala Primary School courses
  {
    id: 1,
    title: "Primary Mathematics Workbook",
    description: "Complete guide to primary mathematics with local examples and PLE preparation exercises",
    file_type: "pdf",
    file_url: "/materials/primary-math-workbook.pdf",
    course_id: 1,
    uploaded_by: 10,
    created_at: "2024-01-25"
  },
  {
    id: 2,
    title: "Number Games and Activities",
    description: "Fun mathematical activities using Ugandan coins, fruits, and everyday objects",
    file_type: "pdf",
    file_url: "/materials/number-games.pdf",
    course_id: 1,
    uploaded_by: 10,
    created_at: "2024-02-01"
  },
  {
    id: 3,
    title: "Mathematics Teaching Videos",
    description: "Video lessons in English and Luganda for primary mathematics concepts",
    file_type: "video",
    file_url: "/materials/math-videos.mp4",
    course_id: 1,
    uploaded_by: 10,
    created_at: "2024-02-05"
  },
  {
    id: 4,
    title: "English Grammar Guide",
    description: "Comprehensive English grammar with Ugandan context examples and exercises",
    file_type: "document",
    file_url: "/materials/english-grammar.docx",
    course_id: 2,
    uploaded_by: 10,
    created_at: "2024-03-05"
  },
  {
    id: 5,
    title: "Reading Comprehension Passages",
    description: "Reading passages about Ugandan culture, history, and daily life for comprehension practice",
    file_type: "pdf",
    file_url: "/materials/reading-passages.pdf",
    course_id: 2,
    uploaded_by: 10,
    created_at: "2024-03-10"
  },
  {
    id: 6,
    title: "History of Uganda",
    description: "Comprehensive guide to Ugandan history from pre-colonial times to independence",
    file_type: "pdf",
    file_url: "/materials/uganda-history.pdf",
    course_id: 3,
    uploaded_by: 12,
    created_at: "2024-02-01"
  },
  {
    id: 7,
    title: "Uganda's Independence Documentary",
    description: "Educational video about Uganda's journey to independence and key historical figures",
    file_type: "video",
    file_url: "/materials/independence-documentary.mp4",
    course_id: 3,
    uploaded_by: 12,
    created_at: "2024-02-15"
  },
  {
    id: 8,
    title: "Science Experiments Manual",
    description: "Simple science experiments using locally available materials and resources",
    file_type: "pdf",
    file_url: "/materials/science-experiments.pdf",
    course_id: 4,
    uploaded_by: 12,
    created_at: "2024-02-20"
  },

  // Materials for Makerere College School courses
  {
    id: 9,
    title: "Biology Diagrams and Charts",
    description: "Detailed biological diagrams with labels in English and local language explanations",
    file_type: "pdf",
    file_url: "/materials/biology-diagrams.pdf",
    course_id: 5,
    uploaded_by: 11,
    created_at: "2024-02-20"
  },
  {
    id: 10,
    title: "Biology Practical Videos",
    description: "Laboratory practical demonstrations for UCE biology syllabus",
    file_type: "video",
    file_url: "/materials/biology-practicals.mp4",
    course_id: 5,
    uploaded_by: 11,
    created_at: "2024-02-25"
  },
  {
    id: 11,
    title: "Chemistry Equations Workbook",
    description: "Chemical equations and reactions workbook with step-by-step solutions",
    file_type: "pdf",
    file_url: "/materials/chemistry-equations.pdf",
    course_id: 6,
    uploaded_by: 10,
    created_at: "2024-03-20"
  },
  {
    id: 12,
    title: "Mathematics Formula Sheet",
    description: "Essential mathematical formulas and identities for secondary school mathematics",
    file_type: "pdf",
    file_url: "/materials/math-formulas.pdf",
    course_id: 7,
    uploaded_by: 11,
    created_at: "2024-03-01"
  },

  // Materials for Buddo Junior School courses
  {
    id: 13,
    title: "Advanced Mathematics Past Papers",
    description: "UACE mathematics past papers with detailed solutions and marking schemes",
    file_type: "pdf",
    file_url: "/materials/uace-math-papers.pdf",
    course_id: 8,
    uploaded_by: 13,
    created_at: "2024-03-15"
  },
  {
    id: 14,
    title: "African Literature Collection",
    description: "Collection of African poetry, novels, and plays for literature studies",
    file_type: "pdf",
    file_url: "/materials/african-literature.pdf",
    course_id: 9,
    uploaded_by: 13,
    created_at: "2024-03-20"
  },

  // Materials for Jinja Primary School courses
  {
    id: 15,
    title: "Counting with Ugandan Objects",
    description: "Learning to count using bananas, mangoes, and other familiar Ugandan items",
    file_type: "pdf",
    file_url: "/materials/counting-objects.pdf",
    course_id: 10,
    uploaded_by: 14,
    created_at: "2024-01-15"
  },
  {
    id: 16,
    title: "Luganda Stories and Songs",
    description: "Traditional Luganda stories and songs for language learning and cultural appreciation",
    file_type: "video",
    file_url: "/materials/luganda-stories.mp4",
    course_id: 11,
    uploaded_by: 14,
    created_at: "2024-01-20"
  },


  // Materials for Mountain View Middle School courses
  {
    id: 17,
    title: "Pre-Algebra Study Guide",
    description: "Comprehensive guide to pre-algebra concepts and problem solving",
    file_type: "pdf",
    file_url: "/materials/pre-algebra-guide.pdf",
    course_id: 12,
    uploaded_by: 15,
    created_at: "2024-02-05"
  },
  {
    id: 18,
    title: "Earth Science Lab Activities",
    description: "Hands-on activities for exploring Earth's systems and processes",
    file_type: "document",
    file_url: "/materials/earth-science-labs.docx",
    course_id: 13,
    uploaded_by: 15,
    created_at: "2024-02-10"
  }
];

export let enrollments: Enrollment[] = [
  { id: 1, student_id: 31, course_id: 1, enrolled_by: 10, enrolled_at: "2024-01-25", status: "active" },
  { id: 2, student_id: 33, course_id: 1, enrolled_by: 10, enrolled_at: "2024-01-25", status: "active" },
  { id: 3, student_id: 32, course_id: 5, enrolled_by: 11, enrolled_at: "2024-02-20", status: "active" },
  { id: 4, student_id: 34, course_id: 5, enrolled_by: 11, enrolled_at: "2024-02-20", status: "active" },
  { id: 5, student_id: 34, course_id: 7, enrolled_by: 11, enrolled_at: "2024-02-25", status: "active" },
  { id: 6, student_id: 35, course_id: 9, enrolled_by: 13, enrolled_at: "2024-03-20", status: "active" },
  { id: 7, student_id: 36, course_id: 10, enrolled_by: 14, enrolled_at: "2024-01-15", status: "active" },
  { id: 8, student_id: 37, course_id: 13, enrolled_by: 15, enrolled_at: "2024-02-05", status: "active" },
  { id: 9, student_id: 38, course_id: 2, enrolled_by: 10, enrolled_at: "2024-03-05", status: "active" },
  { id: 10, student_id: 38, course_id: 3, enrolled_by: 12, enrolled_at: "2024-01-30", status: "active" },
  { id: 11, student_id: 39, course_id: 6, enrolled_by: 10, enrolled_at: "2024-03-20", status: "active" },
  { id: 12, student_id: 40, course_id: 9, enrolled_by: 13, enrolled_at: "2024-03-20", status: "active" },
  { id: 13, student_id: 41, course_id: 11, enrolled_by: 14, enrolled_at: "2024-01-20", status: "active" },
  { id: 14, student_id: 42, course_id: 13, enrolled_by: 15, enrolled_at: "2024-02-05", status: "active" },
  { id: 15, student_id: 43, course_id: 3, enrolled_by: 12, enrolled_at: "2024-01-30", status: "active" },
  { id: 16, student_id: 43, course_id: 4, enrolled_by: 12, enrolled_at: "2024-02-15", status: "active" },
  { id: 17, student_id: 44, course_id: 7, enrolled_by: 11, enrolled_at: "2024-02-25", status: "active" },
  { id: 18, student_id: 45, course_id: 8, enrolled_by: 13, enrolled_at: "2024-03-15", status: "active" },
];

// Helper functions for data manipulation
export const getNextUserId = (): number => {
  return Math.max(...users.map(u => u.id)) + 1;
};

export const getNextEnrollmentId = (): number => {
  return Math.max(...enrollments.map(e => e.id)) + 1;
};

// Student admission functions
export const admitStudent = (studentData: {
  name: string;
  email: string;
  username: string;
  password: string;
  class_id: number;
  school_id: number;
}): User => {
  const newStudent: User = {
    id: getNextUserId(),
    name: studentData.name,
    email: studentData.email,
    username: studentData.username,
    password: studentData.password,
    role: 'student',
    school_ids: [studentData.school_id],
    current_school_id: studentData.school_id,
    class_ids: [studentData.class_id],
    enrolled_courses: [],
    enrolled_at: {},
    status: 'active',
    created_at: new Date().toISOString().split('T')[0]
  };

  users.push(newStudent);
  return newStudent;
};

export const bulkAdmitStudents = (studentsData: BulkStudentData[], schoolId: number): BulkUploadResult => {
  const result: BulkUploadResult = {
    success: [],
    errors: []
  };

  studentsData.forEach((studentData, index) => {
    try {
      // Find class by name and school
      const targetClass = classes.find(c =>
        c.name.toLowerCase() === studentData.class_name.toLowerCase() &&
        c.school_id === schoolId
      );

      if (!targetClass) {
        result.errors.push({
          row: index + 1,
          data: studentData,
          error: `Class "${studentData.class_name}" not found in school`
        });
        return;
      }

      // Check for duplicate email or username
      const existingUser = users.find(u =>
        u.email === studentData.email || u.username === studentData.username
      );

      if (existingUser) {
        result.errors.push({
          row: index + 1,
          data: studentData,
          error: `User with email "${studentData.email}" or username "${studentData.username}" already exists`
        });
        return;
      }

      // Generate password if not provided
      const password = `student${Math.random().toString(36).slice(-6)}`;

      const newStudent = admitStudent({
        name: studentData.name,
        email: studentData.email,
        username: studentData.username,
        password: password,
        class_id: targetClass.id,
        school_id: schoolId
      });

      result.success.push(studentData);
    } catch (error) {
      result.errors.push({
        row: index + 1,
        data: studentData,
        error: `Failed to create student: ${error}`
      });
    }
  });

  return result;
};

// Course enrollment functions
export const enrollStudentInCourse = (studentId: number, courseId: number, enrolledBy: number): boolean => {
  try {
    const student = users.find(u => u.id === studentId);
    const course = courses.find(c => c.id === courseId);

    if (!student || !course) {
      return false;
    }

    // Check if already enrolled
    if (student.enrolled_courses?.includes(courseId)) {
      return false;
    }

    // Check course capacity
    if (course.enrolled_students && course.max_students &&
      course.enrolled_students.length >= course.max_students) {
      return false;
    }

    // Update student enrollment
    if (!student.enrolled_courses) student.enrolled_courses = [];
    if (!student.enrolled_at) student.enrolled_at = {};

    student.enrolled_courses.push(courseId);
    student.enrolled_at[courseId] = new Date().toISOString().split('T')[0];

    // Update course enrollment
    if (!course.enrolled_students) course.enrolled_students = [];
    course.enrolled_students.push(studentId);

    // Add enrollment record
    const newEnrollment: Enrollment = {
      id: getNextEnrollmentId(),
      student_id: studentId,
      course_id: courseId,
      enrolled_by: enrolledBy,
      enrolled_at: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    enrollments.push(newEnrollment);
    return true;
  } catch (error) {
    console.error('Error enrolling student:', error);
    return false;
  }
};

export const unenrollStudentFromCourse = (studentId: number, courseId: number): boolean => {
  try {
    const student = users.find(u => u.id === studentId);
    const course = courses.find(c => c.id === courseId);

    if (!student || !course) {
      return false;
    }

    // Update student enrollment
    if (student.enrolled_courses) {
      student.enrolled_courses = student.enrolled_courses.filter(id => id !== courseId);
    }
    if (student.enrolled_at) {
      delete student.enrolled_at[courseId];
    }

    // Update course enrollment
    if (course.enrolled_students) {
      course.enrolled_students = course.enrolled_students.filter(id => id !== studentId);
    }

    // Update enrollment record
    const enrollment = enrollments.find(e =>
      e.student_id === studentId && e.course_id === courseId && e.status === 'active'
    );
    if (enrollment) {
      enrollment.status = 'dropped';
    }

    return true;
  } catch (error) {
    console.error('Error unenrolling student:', error);
    return false;
  }
};

export const toggleCourseSelfEnrollment = (courseId: number, enabled: boolean): boolean => {
  try {
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    course.self_enrollment = enabled;
    return true;
  } catch (error) {
    console.error('Error toggling self enrollment:', error);
    return false;
  }
};

export const studentSelfEnroll = (studentId: number, courseId: number): boolean => {
  try {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.self_enrollment) {
      return false;
    }

    return enrollStudentInCourse(studentId, courseId, studentId);
  } catch (error) {
    console.error('Error in self enrollment:', error);
    return false;
  }
};