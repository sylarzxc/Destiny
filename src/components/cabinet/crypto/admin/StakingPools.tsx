import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Pause, Play, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../../lib/supabase';
import type { Plan } from '../../../../lib/database.types';

export function StakingPools() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    days: '',
    apr: '',
    type: 'locked' as 'locked' | 'flexible',
    currency: 'USDT'
  });

  const currencies = ['ETH', 'BTC', 'USDT', 'BNB', 'MATIC'];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('currency', { ascending: true })
        .order('days', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch staking plans');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      days: '',
      apr: '',
      type: 'locked',
      currency: 'USDT'
    });
    setEditingPlan(null);
    setIsCreating(false);
  };

  const handleEdit = (plan: Plan) => {
    setFormData({
      name: plan.name,
      days: plan.days.toString(),
      apr: (plan.apr * 100).toString(), // Convert to percentage
      type: plan.type,
      currency: plan.currency
    });
    setEditingPlan(plan);
    setIsCreating(false);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.days || !formData.apr) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const planData = {
        name: formData.name,
        days: parseInt(formData.days),
        apr: parseFloat(formData.apr) / 100, // Convert percentage to decimal
        type: formData.type,
        currency: formData.currency
      };

      if (editingPlan) {
        // Update existing plan
        const { error } = await supabase
          .from('plans')
          .update(planData)
          .eq('id', editingPlan.id);

        if (error) throw error;
        toast.success('Staking plan updated successfully');
      } else {
        // Create new plan
        const { error } = await supabase
          .from('plans')
          .insert(planData);

        if (error) throw error;
        toast.success('Staking plan created successfully');
      }

      await fetchPlans();
      resetForm();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save staking plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this staking plan?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      toast.success('Staking plan deleted successfully');
      await fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete staking plan');
    }
  };

  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.currency]) {
      acc[plan.currency] = [];
    }
    acc[plan.currency].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-purple-400">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading staking plans...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">Staking Plans Management</h1>
          <p className="text-purple-400">Configure and manage staking plans for different cryptocurrencies</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus size={18} className="mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Plans by Currency */}
      {Object.entries(groupedPlans).map(([currency, currencyPlans]) => (
        <motion.div
          key={currency}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white">{currency} Staking Plans</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currencyPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{plan.name}</h3>
                        <Badge className={
                          plan.type === 'locked' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/50'
                            : 'bg-green-500/10 text-green-400 border-green-500/50'
                        }>
                          {plan.type === 'locked' ? 'Locked' : 'Flexible'}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(plan)}
                          className="text-purple-400 hover:text-white"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">APR:</span>
                        <span className="text-green-400 font-medium">{(plan.apr * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Duration:</span>
                        <span className="text-white">{plan.days} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Currency:</span>
                        <span className="text-white">{plan.currency}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || editingPlan) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-lg font-semibold">
                    {editingPlan ? 'Edit Staking Plan' : 'Create New Staking Plan'}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetForm}
                    className="text-purple-400 hover:text-white"
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Plan Name</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-purple-900/30 border-purple-700 text-white" 
                      placeholder="e.g. ETH Locked 30" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300">Currency</Label>
                    <Select 
                      value={formData.currency} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="bg-purple-900/30 border-purple-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300">Duration (days)</Label>
                    <Input 
                      type="number"
                      value={formData.days}
                      onChange={(e) => setFormData(prev => ({ ...prev, days: e.target.value }))}
                      className="bg-purple-900/30 border-purple-700 text-white" 
                      placeholder="30" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300">APR (%)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={formData.apr}
                      onChange={(e) => setFormData(prev => ({ ...prev, apr: e.target.value }))}
                      className="bg-purple-900/30 border-purple-700 text-white" 
                      placeholder="12.5" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300">Plan Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: 'locked' | 'flexible') => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-purple-900/30 border-purple-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="locked">Locked</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="border-purple-700 text-purple-300 hover:bg-purple-800/50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
