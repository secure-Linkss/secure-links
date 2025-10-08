import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FolderKanban,
  Shield,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  LayoutDashboard,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardStats, setDashboardStats] = useState(null)
  const [users, setUsers] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [systemDeleteDialog, setSystemDeleteDialog] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'campaigns') {
      loadCampaigns()
    } else if (activeTab === 'audit') {
      loadAuditLogs()
    }
  }, [activeTab])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/campaigns', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      }
    } catch (error) {
      setError('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const loadAuditLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/audit-logs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data.logs)
      }
    } catch (error) {
      setError('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  const approveUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        setSuccess('User approved successfully')
        loadUsers()
      } else {
        setError('Failed to approve user')
      }
    } catch (error) {
      setError('Error approving user')
    }
  }

  const suspendUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        setSuccess('User suspended successfully')
        loadUsers()
      } else {
        setError('Failed to suspend user')
      }
    } catch (error) {
      setError('Error suspending user')
    }
  }

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        setSuccess('User deleted successfully')
        setDeleteDialogOpen(false)
        loadUsers()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete user')
      }
    } catch (error) {
      setError('Error deleting user')
    }
  }

  const deleteAllSystemData = async () => {
    if (confirmText !== 'DELETE_ALL_DATA') {
      setError('Please type DELETE_ALL_DATA to confirm')
      return
    }

    try {
      const response = await fetch('/api/admin/system/delete-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ confirm: 'DELETE_ALL_DATA' })
      })

      if (response.ok) {
        setSuccess('All system data deleted successfully')
        setSystemDeleteDialog(false)
        setConfirmText('')
        loadDashboardStats()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete system data')
      }
    } catch (error) {
      setError('Error deleting system data')
    }
  }

  const exportAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'audit_logs.csv'
        a.click()
        setSuccess('Audit logs exported successfully')
      }
    } catch (error) {
      setError('Failed to export audit logs')
    }
  }

  const getRoleBadge = (role) => {
    const colors = {
      'main_admin': 'bg-purple-500',
      'assistant_admin': 'bg-blue-500',
      'admin': 'bg-blue-400',
      'member': 'bg-gray-500'
    }
    return <Badge className={colors[role] || 'bg-gray-500'}>{role}</Badge>
  }

  const getStatusBadge = (status) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'active': 'bg-green-500',
      'suspended': 'bg-red-500',
      'expired': 'bg-orange-500'
    }
    return <Badge className={colors[status] || 'bg-gray-500'}>{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Enterprise-grade administration dashboard</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-4 border-red-500 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500 bg-green-500/10">
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 p-1 grid grid-cols-8 gap-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-slate-700">
              <FolderKanban className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-slate-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-slate-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {dashboardStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{dashboardStats.users.total}</div>
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-slate-400">
                          Active: <span className="text-green-400">{dashboardStats.users.active}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Pending: <span className="text-yellow-400">{dashboardStats.users.pending}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Suspended: <span className="text-red-400">{dashboardStats.users.suspended}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm font-medium">Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{dashboardStats.campaigns.total}</div>
                      <div className="mt-2">
                        <div className="text-xs text-slate-400">
                          Active: <span className="text-green-400">{dashboardStats.campaigns.active}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm font-medium">Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{dashboardStats.links.total}</div>
                      <div className="mt-2">
                        <div className="text-xs text-slate-400">
                          Active: <span className="text-green-400">{dashboardStats.links.active}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm font-medium">Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{dashboardStats.events.total}</div>
                      <div className="mt-2">
                        <div className="text-xs text-slate-400">
                          Today: <span className="text-blue-400">{dashboardStats.events.today}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-slate-300">Recent Users</h3>
                      <div className="space-y-2">
                        {dashboardStats.recent_users.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                            <div>
                              <span className="text-white font-medium">{user.username}</span>
                              <span className="text-slate-400 text-sm ml-2">{user.email}</span>
                            </div>
                            {getRoleBadge(user.role)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">User Management</CardTitle>
                  <Button onClick={loadUsers} size="sm" variant="outline" className="border-slate-600">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-300">ID</TableHead>
                        <TableHead className="text-slate-300">Username</TableHead>
                        <TableHead className="text-slate-300">Email</TableHead>
                        <TableHead className="text-slate-300">Role</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Plan</TableHead>
                        <TableHead className="text-slate-300">Created</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="text-slate-300">{user.id}</TableCell>
                          <TableCell className="text-white font-medium">{user.username}</TableCell>
                          <TableCell className="text-slate-300">{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status || 'active')}</TableCell>
                          <TableCell className="text-slate-300">{user.plan_type}</TableCell>
                          <TableCell className="text-slate-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                                <DropdownMenuItem onClick={() => approveUser(user.id)} className="hover:bg-slate-700">
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => suspendUser(user.id)} className="hover:bg-slate-700">
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setDeleteDialogOpen(true)
                                  }}
                                  className="text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">ID</TableHead>
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">User ID</TableHead>
                      <TableHead className="text-slate-300">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map(campaign => (
                      <TableRow key={campaign.id}>
                        <TableCell className="text-slate-300">{campaign.id}</TableCell>
                        <TableCell className="text-white">{campaign.name}</TableCell>
                        <TableCell className="text-slate-300">{campaign.user_id}</TableCell>
                        <TableCell className="text-slate-300">{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Audit Logs</CardTitle>
                  <Button onClick={exportAuditLogs} size="sm" variant="outline" className="border-slate-600">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">ID</TableHead>
                      <TableHead className="text-slate-300">User ID</TableHead>
                      <TableHead className="text-slate-300">Action</TableHead>
                      <TableHead className="text-slate-300">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="text-slate-300">{log.id}</TableCell>
                        <TableCell className="text-slate-300">{log.user_id}</TableCell>
                        <TableCell className="text-white">{log.action}</TableCell>
                        <TableCell className="text-slate-300">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Delete All System Data</h3>
                      <p className="text-slate-400 text-sm">This will permanently delete all data. This action cannot be undone.</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setSystemDeleteDialog(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All System Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete User Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to delete user {selectedUser?.username}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-slate-600">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedUser && deleteUser(selectedUser.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* System Delete Dialog */}
        <Dialog open={systemDeleteDialog} onOpenChange={setSystemDeleteDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm System Data Deletion</DialogTitle>
              <DialogDescription className="text-slate-400">
                This will permanently delete ALL system data except the main admin account. This action CANNOT be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-white">
                  Type <span className="font-mono text-red-400">DELETE_ALL_DATA</span> to confirm
                </Label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE_ALL_DATA"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSystemDeleteDialog(false)
                setConfirmText('')
              }} className="border-slate-600">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteAllSystemData}
                disabled={confirmText !== 'DELETE_ALL_DATA'}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete All Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminPanel
