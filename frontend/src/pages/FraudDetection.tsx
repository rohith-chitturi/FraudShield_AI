import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Shield, ShieldAlert, Upload, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Transaction Screening</h1>
        <p className="text-muted-foreground">Analyze single transactions or upload a batch CSV for bulk processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6">Manual Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Amount ($)</label>
                <input 
                  type="number" 
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  step="0.01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Time Offset (s)</label>
                <input 
                  type="number" 
                  name="Time"
                  value={formData.Time}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                <input 
                  type="number" 
                  name="Lat"
                  value={formData.Lat}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                <input 
                  type="number" 
                  name="Lon"
                  value={formData.Lon}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* PCA Features collapse */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground mb-4">V1 - V28 (PCA Anonymized Features)</p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({length: 28}, (_, i) => (
                  <div key={`V${i+1}`}>
                    <input 
                      type="number" 
                      name={`V${i+1}`}
                      placeholder={`V${i+1}`}
                      value={formData[`V${i+1}` as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded text-xs px-2 py-1.5 text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={mutation.isPending}
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:opacity-50 flex justify-center items-center gap-2"
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
          <AnimatePresence mode="wait">
            {mutation.data ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-8 rounded-2xl border backdrop-blur-xl shadow-lg relative overflow-hidden ${
                  mutation.data.is_fraud 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-full ${mutation.data.is_fraud ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {mutation.data.is_fraud ? <ShieldAlert className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {mutation.data.is_fraud ? 'High Risk - Fraud Detected' : 'Low Risk - Legitimate'}
                    </h2>
                    <p className="text-muted-foreground">Confidence: {(mutation.data.fraud_probability * 100).toFixed(2)}%</p>
                  </div>
                </div>

                {mutation.data.shap_explanation && (
                  <div className="mt-8 space-y-4">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" /> Explainable AI (SHAP)
                    </h4>
                    
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground mb-2">Top factors driving the prediction towards FRAUD:</p>
                      {mutation.data.shap_explanation.top_positive.map((factor: any) => (
                        <div key={factor.feature} className="flex items-center justify-between bg-black/40 rounded p-2 border border-red-500/10">
                          <span className="text-sm text-gray-300 font-mono">{factor.feature} ({factor.value.toFixed(2)})</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden flex justify-end">
                              <div className="h-full bg-red-500" style={{ width: `${Math.min(factor.contribution * 10, 100)}%` }} />
                            </div>
                            <span className="text-xs text-red-400">+{factor.contribution.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}

                      <p className="text-xs text-muted-foreground mb-2 mt-4">Top factors driving the prediction towards LEGITIMATE:</p>
                      {mutation.data.shap_explanation.top_negative.map((factor: any) => (
                        <div key={factor.feature} className="flex items-center justify-between bg-black/40 rounded p-2 border border-emerald-500/10">
                          <span className="text-sm text-gray-300 font-mono">{factor.feature} ({factor.value.toFixed(2)})</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-400">{factor.contribution.toFixed(2)}</span>
                            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(Math.abs(factor.contribution) * 10, 100)}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-card/20 border border-dashed border-white/10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-muted-foreground">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Awaiting Transaction</h3>
                <p className="text-muted-foreground max-w-sm">Enter transaction details on the left to view the AI prediction and SHAP interpretability analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
