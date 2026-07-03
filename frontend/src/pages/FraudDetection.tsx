import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Shield, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function FraudDetection() {
  const [formData, setFormData] = useState({
    Amount: 1500.0,
    Time: 3600.0,
    Lat: 34.05,
    Lon: -118.24,
    ...Object.fromEntries(Array.from({length: 28}, (_, i) => [`V${i+1}`, 0.0]))
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Mocking latency
      await new Promise(r => setTimeout(r, 800));
      const res = await apiClient.post('/predict/single', data);
      return res.data;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) || 0 }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Transaction Screening</h1>
        <p className="text-sm text-gray-400">Analyze single transactions or upload a batch CSV for bulk processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Form */}
        <div className="p-6 rounded-lg bg-[#111111] border border-[#222222] shadow-sm">
          <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Manual Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Amount ($)</label>
                <input 
                  type="number" 
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  step="0.01"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Time Offset (s)</label>
                <input 
                  type="number" 
                  name="Time"
                  value={formData.Time}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Latitude</label>
                <input 
                  type="number" 
                  name="Lat"
                  value={formData.Lat}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Longitude</label>
                <input 
                  type="number" 
                  name="Lon"
                  value={formData.Lon}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* PCA Features collapse */}
            <div className="pt-6 border-t border-[#222222]">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">V1 - V28 (PCA Anonymized Features)</p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({length: 28}, (_, i) => (
                  <div key={`V${i+1}`}>
                    <input 
                      type="number" 
                      name={`V${i+1}`}
                      placeholder={`V${i+1}`}
                      value={formData[`V${i+1}` as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-[#333333] rounded-md text-xs px-2 py-1.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={mutation.isPending}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {mutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>Screen Transaction <Shield className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
            {mutation.data ? (
              <div 
                className={`p-6 rounded-lg border shadow-sm ${
                  mutation.data.is_fraud 
                    ? 'bg-[#1a0f0f] border-[#4a1c1c]' 
                    : 'bg-[#0f1a14] border-[#1c4a2a]'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-md ${mutation.data.is_fraud ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {mutation.data.is_fraud ? <ShieldAlert className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {mutation.data.is_fraud ? 'High Risk - Fraud Detected' : 'Low Risk - Legitimate'}
                    </h2>
                    <p className="text-sm text-gray-400">Confidence: {(mutation.data.fraud_probability * 100).toFixed(2)}%</p>
                  </div>
                </div>

                {mutation.data.shap_explanation && (
                  <div className="mt-8 space-y-4">
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" /> Explainable AI (SHAP)
                    </h4>
                    
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 mb-2">Top factors driving the prediction towards FRAUD:</p>
                      {mutation.data.shap_explanation.top_positive.map((factor: any) => (
                        <div key={factor.feature} className="flex items-center justify-between bg-[#111111] rounded-md p-2 border border-[#222222]">
                          <span className="text-xs text-gray-300 font-mono">{factor.feature} ({factor.value.toFixed(2)})</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-[#222222] rounded-full overflow-hidden flex justify-end">
                              <div className="h-full bg-red-500" style={{ width: `${Math.min(factor.contribution * 10, 100)}%` }} />
                            </div>
                            <span className="text-xs font-medium text-red-400">+{factor.contribution.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}

                      <p className="text-xs text-gray-500 mb-2 mt-4">Top factors driving the prediction towards LEGITIMATE:</p>
                      {mutation.data.shap_explanation.top_negative.map((factor: any) => (
                        <div key={factor.feature} className="flex items-center justify-between bg-[#111111] rounded-md p-2 border border-[#222222]">
                          <span className="text-xs text-gray-300 font-mono">{factor.feature} ({factor.value.toFixed(2)})</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-emerald-400">{factor.contribution.toFixed(2)}</span>
                            <div className="w-24 h-1.5 bg-[#222222] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(Math.abs(factor.contribution) * 10, 100)}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="h-full flex flex-col items-center justify-center p-8 rounded-lg bg-[#111111] border border-dashed border-[#333333] text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4 text-gray-500">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 uppercase tracking-wider">Awaiting Transaction</h3>
                <p className="text-xs text-gray-400 max-w-sm">Enter transaction details on the left to view the AI prediction and SHAP interpretability analysis.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
