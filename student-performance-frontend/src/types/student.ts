export type RiskLevel = 'High Risk' | 'Medium Risk' | 'Low Risk';

export interface AssessmentRecord {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  date: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  attendanceRate: number; // Percentage 0 - 100
  studyHoursPerWeek: number;
  pastFailures: number;
  parentalEducation: 'Higher' | 'Secondary' | 'Primary';
  internetAccess: boolean;
  assignmentCompletionRate: number; // Percentage 0 - 100
  midterm1Score: number; // G1 out of 20
  midterm2Score: number; // G2 out of 20
  predictedFinalScore: number; // G3 out of 20
  riskLevel: RiskLevel;
  riskProbability: number; // 0 - 100%
  topRiskFactors: string[];
  recommendations: string[];
  recentAssessments: AssessmentRecord[];
  notes?: string;
}

export interface ClassStatistics {
  totalStudents: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageAttendance: number;
  averagePredictedScore: number;
  gradeDistribution: {
    range: string;
    count: number;
  }[];
  riskTrends: {
    week: string;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  }[];
  featureCorrelations: {
    feature: string;
    correlation: number;
  }[];
}
