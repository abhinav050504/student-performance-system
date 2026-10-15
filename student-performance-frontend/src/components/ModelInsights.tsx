import React from 'react';
import { 
  BrainCircuit, 
  CheckCircle, 
  AlertOctagon 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { mockClassStatistics } from '../data/mockData';

export const ModelInsights: React.FC = () => {
  const correlations = mockClassStatistics.featureCorrelations;

  const modelComparisons = [
    { name: 'Linear / Ridge Regression', mae: 1.28, rmse: 1.62, r2: 0.81, classificationAcc: '79.4%', status: 'Baseline' },
    { name: 'Random Forest Regressor', mae: 1.15, rmse: 1.48, r2: 0.85, classificationAcc: '84.8%', status: 'Selected Final' },
    { name: 'Support Vector Machine (SVR)', mae: 1.34, rmse: 1.71, r2: 0.78, classificationAcc: '78.2%', status: 'Compared' },
    { name: 'Gradient Boosting (XGBoost)', mae: 1.18, rmse: 1.51, r2: 0.84, classificationAcc: '83.5%', status: 'Compared' },
    { name: 'Decision Tree (CART)', mae: 1.54, rmse: 1.95, r2: 0.71, classificationAcc: '73.1%', status: 'Pruned' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <BrainCircuit className="w-6 h-6 text-indigo-600 mr-2.5" />
          Model Evaluation & Explainable Feature Analytics
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Comparative benchmarking of classical supervised learning algorithms and feature importance for leakage-aware prediction.
        </p>
      </div>

      {/* Models Comparison Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Algorithm Performance Comparison (Semester VIII Milestone)</h3>
            <p className="text-xs text-slate-500">Evaluated on held-out test split (80-20 Train-Test with 5-fold cross validation)</p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-100">
            No Deep Learning Black Boxes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-3">Algorithm</th>
                <th className="py-3 px-3">MAE</th>
                <th className="py-3 px-3">RMSE</th>
                <th className="py-3 px-3">R² Score</th>
                <th className="py-3 px-3">Risk Classification F1 / Acc</th>
                <th className="py-3 px-3">Selection Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modelComparisons.map((m, idx) => (
                <tr key={idx} className={m.status === 'Selected Final' ? 'bg-indigo-50/40 font-medium' : 'hover:bg-slate-50/50'}>
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center">
                    {m.status === 'Selected Final' && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    )}
                    {m.name}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{m.mae}</td>
                  <td className="py-3 px-3 text-slate-700">{m.rmse}</td>
                  <td className="py-3 px-3 font-semibold text-indigo-700">{m.r2}</td>
                  <td className="py-3 px-3 text-slate-700">{m.classificationAcc}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      m.status === 'Selected Final' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance & Data Leakage Avoidance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900">Feature Importance / Correlation with $G_3$</h3>
          <p className="text-xs text-slate-500 mb-4">Correlation strength of each academic and behavioural variable</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={correlations}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[-1, 1]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="correlation" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Correlation" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Methodological Principles Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <AlertOctagon className="w-5 h-5 text-amber-500 mr-2" />
            Leakage-Aware Methodology Principles
          </h3>
          
          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">1. Target Leakage Prevention ($G_1$, $G_2$ vs $G_3$):</div>
              <p>
                In the UCI dataset, end-term grade $G_3$ strongly correlates with earlier assessments ($r &gt; 0.85$). 
                Models trained with all grades are verified against early models utilizing only $G_1$ or pre-midterm metrics to evaluate early-warning viability.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">2. Interpretability Over Black Boxes:</div>
              <p>
                As emphasized in the project synopsis, decisions must be interpretable by course faculty. 
                Classical models (Random Forest, Logistic Regression, SHAP indicators) allow direct examination of why a student is flagged.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">3. Decision-Support Boundary:</div>
              <p>
                Model outputs are not automated academic judgements; they generate early advisories for faculty counselors and remedial tutors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
