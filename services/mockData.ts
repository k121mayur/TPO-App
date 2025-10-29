
import { Job, Company, User, UserRole, WorkType, JobSector } from '../types';

export const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'EcoSolutions Inc.',
    logo: 'https://picsum.photos/seed/comp1/100',
    description: 'Pioneering sustainable solutions for a greener planet. We focus on renewable energy and waste reduction technologies.',
    website: 'https://ecosolutions.example.com',
    isVerified: true,
  },
  {
    id: 'comp2',
    name: 'GreenScape Foundation',
    logo: 'https://picsum.photos/seed/comp2/100',
    description: 'A non-profit dedicated to reforestation and biodiversity conservation projects worldwide.',
    website: 'https://greenscape.example.org',
    isVerified: true,
  },
  {
    id: 'comp3',
    name: 'SustainaConsult',
    logo: 'https://picsum.photos/seed/comp3/100',
    description: 'Expert ESG and sustainability consulting for forward-thinking corporations.',
    website: 'https://sustainaconsult.example.com',
    isVerified: false,
  },
];

export const mockJobs: Job[] = [
  {
    id: 'job1',
    title: 'Solar Panel Technician',
    company: mockCompanies[0],
    location: 'Austin, TX',
    sector: JobSector.RENEWABLE_ENERGY,
    workType: WorkType.ON_SITE,
    salaryRange: [60000, 80000],
    postedDate: '2024-07-20',
    description: 'Install and maintain solar panels for residential and commercial clients. Join a team dedicated to expanding clean energy access.',
    responsibilities: [
      'Assemble and install solar modules on rooftops and other structures.',
      'Perform maintenance and troubleshooting of solar energy systems.',
      'Ensure compliance with safety standards and building codes.',
    ],
    qualifications: [
      'Previous experience in solar installation or a related trade.',
      'NABCEP certification is a plus.',
      'Comfortable working at heights.',
    ],
  },
  {
    id: 'job2',
    title: 'Conservation Project Manager',
    company: mockCompanies[1],
    location: 'Portland, OR',
    sector: JobSector.CONSERVATION,
    workType: WorkType.HYBRID,
    salaryRange: [75000, 95000],
    postedDate: '2024-07-18',
    description: 'Lead and manage large-scale conservation projects, coordinating with local communities and stakeholders to protect vital ecosystems.',
    responsibilities: [
        'Develop project plans and budgets.',
        'Manage a team of field researchers and volunteers.',
        'Write grant proposals and report to funders.'
    ],
    qualifications: [
        'Master\'s degree in Environmental Science or related field.',
        '5+ years of project management experience.',
        'Strong communication and leadership skills.'
    ]
  },
  {
    id: 'job3',
    title: 'ESG Analyst',
    company: mockCompanies[2],
    location: 'New York, NY',
    sector: JobSector.ESG,
    workType: WorkType.REMOTE,
    salaryRange: [80000, 110000],
    postedDate: '2024-07-15',
    description: 'Analyze company data to assess their environmental, social, and governance (ESG) performance. Provide insights to investors and corporate clients.',
     responsibilities: [
        'Conduct research on corporate ESG practices.',
        'Develop and maintain ESG rating models.',
        'Prepare detailed reports and presentations.'
    ],
    qualifications: [
        'Bachelor\'s degree in Finance, Economics, or Sustainability.',
        'Strong analytical and quantitative skills.',
        'Familiarity with ESG frameworks (GRI, SASB).'
    ]
  },
  {
    id: 'job4',
    title: 'Lead Frontend Engineer (Green Tech)',
    company: mockCompanies[0],
    location: 'Remote',
    sector: JobSector.GREEN_TECH,
    workType: WorkType.REMOTE,
    salaryRange: [120000, 150000],
    postedDate: '2024-07-21',
    description: 'Build beautiful and impactful user interfaces for our clean energy monitoring platform. Lead a team of talented developers to create a world-class product.',
     responsibilities: [
        'Architect and develop scalable frontend systems using React and TypeScript.',
        'Mentor junior engineers and lead code reviews.',
        'Collaborate with product and design teams.'
    ],
    qualifications: [
        '7+ years of frontend development experience.',
        'Expertise in React, TypeScript, and modern web technologies.',
        'Passion for sustainability and clean technology.'
    ]
  },
    {
    id: 'job5',
    title: 'Third-Party Renewable Energy Analyst',
    company: { id: 'comp4', name: 'Global Energy Watch', logo: 'https://picsum.photos/seed/comp4/100', description: '', website: '', isVerified: true },
    location: 'Global',
    sector: JobSector.RENEWABLE_ENERGY,
    workType: WorkType.REMOTE,
    salaryRange: [90000, 120000],
    postedDate: '2024-07-19',
    description: 'This is an external job posting. You will be redirected to apply on the company\'s website. Analyze global trends in renewable energy markets.',
    responsibilities: [],
    qualifications: [],
    isThirdParty: true,
    redirectUrl: 'https://google.com/search?q=jobs',
  },
];

interface MockUsers {
  [key: string]: any;
}

export const mockUsers: MockUsers = {
  employee: {
    id: 'user1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    role: UserRole.EMPLOYEE,
    profilePicture: 'https://picsum.photos/seed/user1/100',
    profile: {
      summary: 'Passionate environmental scientist with 5 years of experience in conservation research and project management. Seeking to apply my skills to a mission-driven organization.',
      skills: ['Data Analysis', 'Project Management', 'GIS', 'Grant Writing', 'Public Speaking'],
      experience: [
        { id: 'exp1', title: 'Research Scientist', company: 'Nature Conservancy', startDate: '2019', endDate: 'Present', description: 'Led research on biodiversity impacts.' },
        { id: 'exp2', title: 'Field Technician', company: 'National Park Service', startDate: '2017', endDate: '2019', description: 'Conducted ecological surveys.' },
      ],
      education: [
        { id: 'edu1', institution: 'University of Colorado Boulder', degree: 'M.S. in Environmental Science', fieldOfStudy: 'Ecology', gradYear: '2017' }
      ],
      resumeUrl: '/path/to/mock-resume.pdf',
    }
  },
  employer: {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@ecosolutions.example.com',
    role: UserRole.EMPLOYER,
    profilePicture: 'https://picsum.photos/seed/user2/100',
    companyId: 'comp1'
  },
  admin: {
    id: 'user3',
    name: 'Admin User',
    email: 'admin@greenjobs.example.com',
    role: UserRole.ADMIN,
    profilePicture: 'https://picsum.photos/seed/user3/100',
  }
};

export let mockAdminStats = {
    totalJobs: mockJobs.length,
    totalCompanies: mockCompanies.length,
    totalUsers: Object.keys(mockUsers).length,
    redirects: [
        { jobId: 'job5', jobTitle: 'Third-Party Renewable Energy Analyst', clicks: 42 },
    ]
};
