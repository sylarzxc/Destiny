import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, MoreVertical, Shield, Ban, CheckCircle, Plus, DollarSign, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../../lib/supabase';
import type { Profile, Wallet } from '../../../../lib/database.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addFundsData, setAddFundsData] = useState({
    currency: 'USDT',
    amount: '',
    note: ''
  });
  const [addingFunds, setAddingFunds] = useState(false);

  const currencies = ['ETH', 'BTC', 'USDT', 'BNB', 'MATIC'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('admin_list_users', {
        p_limit: 100,
        p_offset: 0,
        p_search: searchTerm || null
      });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleViewUser = async (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleAddFunds = (user: any) => {
    setSelectedUser(user);
    setAddFundsData({
      currency: 'USDT',
      amount: '',
      note: ''
    });
    setShowAddFunds(true);
  };

  const handleSubmitAddFunds = async () => {
    if (!addFundsData.amount || parseFloat(addFundsData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setAddingFunds(true);
      
      // Use admin function to credit wallet
      const { error } = await supabase.rpc('admin_credit_wallet', {
        p_user_id: selectedUser.id,
        p_currency: addFundsData.currency,
        p_amount: parseFloat(addFundsData.amount),
        p_note: addFundsData.note || 'Admin credit'
      });

      if (error) throw error;

      toast.success(`Successfully added ${addFundsData.amount} ${addFundsData.currency} to user's wallet`);
      setShowAddFunds(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error('Failed to add funds');
    } finally {
      setAddingFunds(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase.rpc('admin_set_role', {
        p_user_id: userId,
        p_role: newRole
      });

      if (error) throw error;
      
      toast.success(`User role updated to ${newRole}`);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const stats = [
    { 
      label: 'Total Users', 
      value: users.length.toString(), 
      color: 'text-blue-400' 
    },
    { 
      label: 'Total Balance', 
      value: `$${users.reduce((sum, user) => sum + parseFloat(user.total_available || 0), 0).toLocaleString()}`, 
      color: 'text-green-400' 
    },
    { 
      label: 'Active Stakes', 
      value: users.reduce((sum, user) => sum + (user.active_stakes || 0), 0).toString(), 
      color: 'text-purple-400' 
    },
    { 
      label: 'Total Referrals', 
      value: users.reduce((sum, user) => sum + (user.total_referrals || 0), 0).toString(), 
      color: 'text-orange-400' 
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-purple-400">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Users Management</h1>
        <p className="text-purple-400">Manage and monitor all platform users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
              <div className="p-6">
                <div className="text-purple-400 mb-1">{stat.label}</div>
                <div className={`${stat.color} text-lg font-semibold`}>{stat.value}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
              <Input
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-purple-900/30 border-purple-700 text-white"
              />
            </div>
            <Button 
              onClick={handleSearch}
              variant="outline" 
              className="border-purple-700 text-purple-300 hover:bg-purple-800/50"
            >
              <Search size={18} className="mr-2" />
              Search
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-700/30">
                  <th className="text-left text-purple-400 pb-3 px-4">User</th>
                  <th className="text-left text-purple-400 pb-3">Email</th>
                  <th className="text-left text-purple-400 pb-3">Balance</th>
                  <th className="text-left text-purple-400 pb-3">Stakes</th>
                  <th className="text-left text-purple-400 pb-3">Role</th>
                  <th className="text-left text-purple-400 pb-3">Joined</th>
                  <th className="text-left text-purple-400 pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr 
                    key={user.id} 
                    className="border-b border-purple-800/30 hover:bg-purple-800/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {user.display_name || user.email?.split('@')[0] || 'User'}
                        </span>
                        {user.role === 'admin' && (
                          <CheckCircle size={14} className="text-blue-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-purple-300">{user.email}</td>
                    <td className="py-4 text-green-400">
                      ${parseFloat(user.total_available || 0).toLocaleString()}
                    </td>
                    <td className="py-4 text-purple-300">{user.active_stakes || 0}</td>
                    <td className="py-4">
                      <Badge className={
                        user.role === 'admin' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/50'
                          : 'bg-green-500/10 text-green-400 border-green-500/50'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 text-purple-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-purple-400">
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-purple-900 border-purple-700">
                          <DropdownMenuItem 
                            onClick={() => handleViewUser(user)}
                            className="text-white hover:bg-purple-800"
                          >
                            <Eye size={14} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAddFunds(user)}
                            className="text-green-400 hover:bg-purple-800"
                          >
                            <DollarSign size={14} className="mr-2" />
                            Add Funds
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleUserStatus(user.id, user.role)}
                            className="text-blue-400 hover:bg-purple-800"
                          >
                            <Shield size={14} className="mr-2" />
                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="bg-purple-900 border-purple-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Email</Label>
                  <div className="text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <Label className="text-purple-300">Display Name</Label>
                  <div className="text-white">{selectedUser.display_name || 'Not set'}</div>
                </div>
                <div>
                  <Label className="text-purple-300">Role</Label>
                  <div className="text-white">{selectedUser.role}</div>
                </div>
                <div>
                  <Label className="text-purple-300">Referral Code</Label>
                  <div className="text-white">{selectedUser.referral_code || 'Not generated'}</div>
                </div>
                <div>
                  <Label className="text-purple-300">Total Available</Label>
                  <div className="text-green-400">${parseFloat(selectedUser.total_available || 0).toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-purple-300">Total Locked</Label>
                  <div className="text-orange-400">${parseFloat(selectedUser.total_locked || 0).toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-purple-300">Active Stakes</Label>
                  <div className="text-purple-400">{selectedUser.active_stakes || 0}</div>
                </div>
                <div>
                  <Label className="text-purple-300">Joined</Label>
                  <div className="text-purple-400">{new Date(selectedUser.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Funds Dialog */}
      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent className="bg-purple-900 border-purple-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Funds to User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-purple-300">User</Label>
                <div className="text-white">{selectedUser.email}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">Currency</Label>
                  <Select 
                    value={addFundsData.currency} 
                    onValueChange={(value) => setAddFundsData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-purple-800 border-purple-700 text-white">
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
                  <Label className="text-purple-300">Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={addFundsData.amount}
                    onChange={(e) => setAddFundsData(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-purple-800 border-purple-700 text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-300">Note (Optional)</Label>
                <Input
                  value={addFundsData.note}
                  onChange={(e) => setAddFundsData(prev => ({ ...prev, note: e.target.value }))}
                  className="bg-purple-800 border-purple-700 text-white"
                  placeholder="Reason for adding funds..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmitAddFunds}
                  disabled={addingFunds}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {addingFunds ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Add Funds
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddFunds(false)}
                  className="border-purple-700 text-purple-300 hover:bg-purple-800/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
