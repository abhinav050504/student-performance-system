import React, { useState } from 'react';
import { Database, Table, Code, Copy, Check } from 'lucide-react';

export const DataDictionaryView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const variables = [
    { name: 'student_id', type: 'VARCHAR(20)', description: 'Unique institutional student roll number (AKTU format)', source: 'Student Information System' },
    { name: 'attendance_rate', type: 'FLOAT (0.0 - 100.0)', description: 'Aggregate percentage of attended lectures/labs', source: 'ERP / Biometric logs' },
    { name: 'study_hours', type: 'INTEGER', description: 'Weekly self-study hours outside scheduled classes', source: 'LMS / Student Survey' },
    { name: 'past_failures', type: 'INTEGER', description: 'Number of past course backlogs / failed modules (0-4)', source: 'Transcript Records' },
    { name: 'midterm_1 (G1)', type: 'FLOAT (0 - 20)', description: 'First sessional exam / midterm period grade', source: 'Examination Cell' },
    { name: 'midterm_2 (G2)', type: 'FLOAT (0 - 20)', description: 'Second sessional exam period grade', source: 'Examination Cell' },
    { name: 'assignment_rate', type: 'FLOAT (0.0 - 100.0)', description: 'Timely assignment submissions on portal', source: 'LMS Submission Tracker' },
    { name: 'final_score (G3)', type: 'FLOAT (0 - 20)', description: 'Final end-semester academic grade (Prediction Target)', source: 'University Grade Sheet' },
    { name: 'risk_level', type: 'VARCHAR(15)', description: 'Computed risk tier: High Risk (<10), Medium Risk (10-12), Low (>=13)', source: 'ML Decision Classifier' }
  ];

  const sqlSchema = `-- Relational SQL Schema: Semester VII / VIII Project
-- Database: PostgreSQL / SQLite

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) DEFAULT 'Computer Science & Engineering',
    semester INTEGER DEFAULT 7,
    parental_education VARCHAR(30),
    internet_access BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE academic_records (
    record_id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES students(student_id) ON DELETE CASCADE,
    attendance_rate NUMERIC(5, 2) CHECK (attendance_rate BETWEEN 0 AND 100),
    study_hours_per_week INTEGER DEFAULT 0,
    past_failures INTEGER DEFAULT 0,
    midterm1_g1 NUMERIC(4, 2) CHECK (midterm1_g1 BETWEEN 0 AND 20),
    midterm2_g2 NUMERIC(4, 2) CHECK (midterm2_g2 BETWEEN 0 AND 20),
    assignment_rate NUMERIC(5, 2) CHECK (assignment_rate BETWEEN 0 AND 100),
    final_score_g3 NUMERIC(4, 2) CHECK (final_score_g3 BETWEEN 0 AND 20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prediction_logs (
    prediction_id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES students(student_id),
    model_version VARCHAR(50) NOT NULL,
    predicted_g3 NUMERIC(4, 2) NOT NULL,
    risk_category VARCHAR(20) NOT NULL,
    risk_probability NUMERIC(5, 2),
    primary_factors JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Database className="w-6 h-6 text-indigo-600 mr-2.5" />
          Data Dictionary & Relational SQL Schema
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Documentation of data engineering attributes, validation bounds, and relational database schema (Semester VII Deliverable).
        </p>
      </div>

      {/* Variables Dictionary Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center">
          <Table className="w-4 h-4 text-indigo-600 mr-2" />
          Attribute Data Dictionary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-3">Variable Name</th>
                <th className="py-3 px-3">Data Type</th>
                <th className="py-3 px-3">Description & Valid Range</th>
                <th className="py-3 px-3">Source Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {variables.map((v, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700">{v.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{v.type}</td>
                  <td className="py-3 px-3 text-slate-800">{v.description}</td>
                  <td className="py-3 px-3 text-slate-500">{v.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL DDL Schema */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">PostgreSQL Database Schema DDL (`schema.sql`)</h3>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-200 font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy DDL'}
          </button>
        </div>

        <pre className="font-mono text-xs overflow-x-auto p-4 bg-slate-950 rounded-xl text-indigo-200 leading-relaxed border border-slate-800">
          {sqlSchema}
        </pre>
      </div>
    </div>
  );
};
