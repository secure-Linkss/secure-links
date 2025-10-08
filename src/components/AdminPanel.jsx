<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
=======
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
>>>>>>> 00392b0 (Initial commit of unified Brain Link Tracker project with integrated admin panel fixes)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
<<<<<<< HEAD
} from '@/components/ui/table'
=======
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
>>>>>>> 00392b0 (Initial commit of unified Brain Link Tracker project with integrated admin panel fixes)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
                          <TableCell className="text-slate-300">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                {user.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => approveUser(user.id)} className="text-green-400">
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => suspendUser(user.id)} className="text-orange-400">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                                {user.role !== 'main_admin' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setDeleteDialogOpen(true)
                                    }}
                                    className="text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
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
                <CardTitle className="text-white">Campaign Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-300">ID</TableHead>
                        <TableHead className="text-slate-300">Name</TableHead>
                        <TableHead className="text-slate-300">Description</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map(campaign => (
                        <TableRow key={campaign.id}>
                          <TableCell className="text-slate-300">{campaign.id}</TableCell>
                          <TableCell className="text-white font-medium">{campaign.name}</TableCell>
                          <TableCell className="text-slate-300">{campaign.description}</TableCell>
                          <TableCell>
                            <Badge className={campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security & Threat Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Security monitoring features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Subscription Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Manual subscription verification interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Support ticketing system coming soon...</p>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-300">ID</TableHead>
                        <TableHead className="text-slate-300">Action</TableHead>
                        <TableHead className="text-slate-300">Actor</TableHead>
                        <TableHead className="text-slate-300">IP Address</TableHead>
                        <TableHead className="text-slate-300">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell className="text-slate-300">{log.id}</TableCell>
                          <TableCell className="text-white font-medium">{log.action}</TableCell>
                          <TableCell className="text-slate-300">{log.actor_id}</TableCell>
                          <TableCell className="text-slate-300">{log.ip_address}</TableCell>
                          <TableCell className="text-slate-300">
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Dangerous Actions</h3>
                  <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2">Delete All System Data</h4>
                        <p className="text-sm text-slate-400 mb-4">
                          This will permanently delete all users (except main admin), campaigns, links, tracking events, and audit logs. This action cannot be undone.
                        </p>
                        <Button
                          onClick={() => setSystemDeleteDialog(true)}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete All System Data
                        </Button>
                      </div>
                    </div>
=======
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart
} from 'recharts';
import {
  Users,
  Target,
  Shield,
  Settings,
  Eye,
  Ban,
  CheckCircle,
  Clock,
  MoreVertical,
  Search,
  Filter,
  Download,
  Plus,
  User,
  Calendar,
  Mail,
  Crown,
  UserCheck,
  UserX,
  RefreshCw,
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  FileText,
  Lock,
  Trash2,
  Edit,
  AlertTriangle,
  TrendingUp,
  Activity,
  Globe,
  MousePointer,
  BarChart3,
  CalendarDays,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

// Import the API service
import adminApi from '../services/adminApi';

const AdminPanelEnhanced = () => {
  // State Management
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityThreats, setSecurityThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    suspendedUsers: 0,
    activeCampaigns: 0,
    totalCampaigns: 0,
    securityThreats: 0,
    revenue: 0,
    totalClicks: 0,
    capturedEmails: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState([]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data for the admin panel
  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchCampaigns(),
        fetchDashboardStats(),
        fetchAuditLogs(),
        fetchSecurityData()
      ]);
      setLastUpdated(new Date());
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const data = await adminApi.user.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      throw error;
    }
  };

  // Fetch campaigns from API
  const fetchCampaigns = async () => {
    try {
      const data = await adminApi.campaign.getAll();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to fetch campaigns');
      throw error;
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const stats = await adminApi.analytics.getDashboardStats();
      setDashboardStats(stats);
      
      // Generate chart data (this should ideally come from the API)
      generateChartData(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
      throw error;
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      const data = await adminApi.audit.getAll();
      setAuditLogs(data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to fetch audit logs');
      throw error;
    }
  };

  // Fetch security data
  const fetchSecurityData = async () => {
    try {
      const data = await adminApi.security.getSettings();
      // Extract security threats from the response
      if (data.threats) {
        setSecurityThreats(data.threats);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to fetch security data');
      throw error;
    }
  };

  // Generate chart data for visualizations
  const generateChartData = (stats) => {
    // This is a placeholder - ideally this data should come from the API
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(stats.totalUsers * (0.8 + Math.random() * 0.2)),
        campaigns: Math.floor(stats.totalCampaigns * (0.7 + Math.random() * 0.3)),
        clicks: Math.floor(stats.totalClicks / 7 * (0.8 + Math.random() * 0.4)),
        revenue: Math.floor(stats.revenue / 7 * (0.8 + Math.random() * 0.4))
      });
    }
    
    setChartData(last7Days);
  };

  // User action handlers
  const handleUserAction = async (userId, action, additionalData = {}) => {
    try {
      let result;
      let successMessage = '';

      switch (action) {
        case 'approve':
          result = await adminApi.user.approve(userId);
          successMessage = 'User approved successfully';
          break;
        case 'suspend':
          result = await adminApi.user.suspend(userId);
          successMessage = 'User suspended successfully';
          break;
        case 'change-password':
          const newPassword = prompt('Enter new password for user:');
          if (!newPassword) return;
          result = await adminApi.user.changePassword(userId, newPassword);
          successMessage = 'Password changed successfully';
          break;
        case 'extend':
          const days = prompt('Enter number of days to extend subscription:');
          if (!days || isNaN(days)) return;
          result = await adminApi.user.extendSubscription(userId, parseInt(days));
          successMessage = `Subscription extended by ${days} days`;
          break;
        case 'delete':
          if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
          result = await adminApi.user.delete(userId);
          successMessage = 'User deleted successfully';
          break;
        case 'change-role':
          result = await adminApi.user.changeRole(userId, additionalData.role);
          successMessage = `User role changed to ${additionalData.role}`;
          break;
        default:
          throw new Error('Unknown action');
      }

      toast.success(successMessage);
      await fetchUsers();
      await fetchDashboardStats();
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      toast.error(`Failed to ${action} user: ` + error.message);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Utility functions for badges and formatting
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-600', text: 'Active', icon: CheckCircle },
      pending: { color: 'bg-yellow-600', text: 'Pending', icon: Clock },
      suspended: { color: 'bg-red-600', text: 'Suspended', icon: Ban },
      expired: { color: 'bg-gray-600', text: 'Expired', icon: AlertTriangle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      main_admin: { color: 'bg-purple-600', text: 'Main Admin', icon: Crown },
      admin: { color: 'bg-blue-600', text: 'Admin', icon: UserCheck },
      member: { color: 'bg-gray-600', text: 'Member', icon: User }
    };
    
    const config = roleConfig[role] || roleConfig.member;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateRemainingDays = (endDate) => {
    if (!endDate) return 'N/A';
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive system management and user administration
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Activity className="h-3 w-3" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 px-3 text-xs hover:bg-primary/10 transition-all" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" variant="outline" className="h-9 px-3 text-xs hover:bg-primary/10 transition-all">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="user-management" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="campaign-management" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <Target className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="security-threats" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Subscriptions</span>
          </TabsTrigger>
          <TabsTrigger value="support-tickets" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Support</span>
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Audit</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>


        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 animate-in fade-in duration-300">
          {/* Enhanced Metric Cards - 8 cards with modern design */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total Users</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      {dashboardStats.totalUsers}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +12%
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                    <Users className="h-5 w-5 text-blue-500" />
>>>>>>> 00392b0 (Initial commit of unified Brain Link Tracker project with integrated admin panel fixes)
                  </div>
                </div>
              </CardContent>
            </Card>
<<<<<<< HEAD
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
=======

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Active Users</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      {dashboardStats.activeUsers}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +8%
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
                    <UserCheck className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Campaigns</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      {dashboardStats.activeCampaigns}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +15%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                    <Target className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-red-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Threats</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      {dashboardStats.securityThreats || securityThreats.length}
                    </p>
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      Active
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-full group-hover:bg-red-500/20 transition-colors">
                    <Shield className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-emerald-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Revenue</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      ${dashboardStats.revenue || 0}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +22%
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total Clicks</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      {dashboardStats.totalClicks?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +18%
                    </p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-full group-hover:bg-orange-500/20 transition-colors">
                    <MousePointer className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-teal-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Emails</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      {dashboardStats.capturedEmails || 0}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +25%
                    </p>
                  </div>
                  <div className="p-3 bg-teal-500/10 rounded-full group-hover:bg-teal-500/20 transition-colors">
                    <Mail className="h-5 w-5 text-teal-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-indigo-500 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Conversion</p>
                    <p className="text-2xl font-bold group-hover:scale-110 transition-transform">
                      {dashboardStats.conversionRate || 0}%
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +5%
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart with Gradient */}
            <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      User Growth Trends
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      User registration and activity over the last 7 days
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart with Modern Bars */}
            <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-emerald-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      Revenue Analytics
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Daily revenue and growth metrics
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +22%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value) => `$${value}`}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Campaign Performance Chart */}
            <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      Campaign Performance
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Active campaigns and engagement metrics
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +15%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="campaigns" fill="#a855f7" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  System Health
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Real-time system status and metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">API Status</p>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Online</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-full">
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Active Sessions</p>
                        <p className="text-xs text-muted-foreground">{dashboardStats.activeUsers} users online</p>
                      </div>
                    </div>
                    <Badge variant="outline">{dashboardStats.activeUsers}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-full">
                        <Clock className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pending Approvals</p>
                        <p className="text-xs text-muted-foreground">Users awaiting review</p>
                      </div>
                    </div>
                    <Badge variant="outline">{dashboardStats.pendingUsers || 0}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 rounded-full">
                        <Shield className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Security Alerts</p>
                        <p className="text-xs text-muted-foreground">Active threats detected</p>
                      </div>
                    </div>
                    <Badge variant="destructive">{securityThreats.length}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-full">
                        <Target className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Active Campaigns</p>
                        <p className="text-xs text-muted-foreground">Running campaigns</p>
                      </div>
                    </div>
                    <Badge variant="outline">{dashboardStats.activeCampaigns}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Recent User Registrations
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest users who joined the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {users.slice(0, 5).map((user, index) => (
                    <div key={user.id || index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-full">
                          <User className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(user.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Audit Logs */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Recent Admin Actions
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest administrative activities
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log, index) => (
                    <div key={log.id || index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-full">
                          <Activity className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">by {log.actor || log.user}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(log.created_at || log.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="user-management" className="space-y-6 animate-in fade-in duration-300">
          {/* User Management Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="main_admin">Main Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* User Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.status === 'active' || u.is_active).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Suspended</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.status === 'suspended').length}
                    </p>
                  </div>
                  <Ban className="h-8 w-8 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management Table */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">User Management</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Showing {filteredUsers.length} of {users.length} users
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Subscription</TableHead>
                      <TableHead className="font-semibold">Last Login</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No users found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{user.username}</p>
                                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">{user.plan_type || user.subscription_plan || 'Free'}</p>
                              {user.subscription_expiry && (
                                <p className="text-xs text-muted-foreground">
                                  Expires: {formatDate(user.subscription_expiry)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{formatDateTime(user.last_login)}</p>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'approve')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'change-password')}>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Change Password
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'extend')}>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Extend Subscription
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleUserAction(user.id, 'delete')}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaign Management Tab */}
        <TabsContent value="campaign-management" className="space-y-6 animate-in fade-in duration-300">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Campaign Management
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Manage and monitor all marketing campaigns
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90 transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No campaigns found</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first campaign to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-semibold">{campaign.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="text-xs">{campaign.description || 'No description'}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Links:</span>
                            <span className="font-medium">{campaign.link_count || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Clicks:</span>
                            <span className="font-medium">{campaign.total_clicks || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="font-medium">{formatDate(campaign.created_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Threats Tab */}
        <TabsContent value="security-threats" className="space-y-6 animate-in fade-in duration-300">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Security & Threat Monitoring
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Monitor and manage security threats and suspicious activities
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {securityThreats.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                  <p className="text-green-600 font-medium">All Clear!</p>
                  <p className="text-xs text-muted-foreground mt-1">No security threats detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {securityThreats.map((threat, index) => (
                    <Alert key={threat.id || index} className="border-l-4 border-l-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>{threat.type}</span>
                        <Badge variant="destructive">{threat.severity}</Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-1 text-xs">
                          <p><strong>IP Address:</strong> {threat.ip_address}</p>
                          <p><strong>User:</strong> {threat.user || 'Unknown'}</p>
                          <p><strong>Time:</strong> {formatDateTime(threat.timestamp)}</p>
                          <p><strong>Status:</strong> {threat.status}</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Ban className="h-3 w-3 mr-1" />
                            Block IP
                          </Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Safe
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6 animate-in fade-in duration-300">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    Subscription Management
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Monitor and manage user subscriptions and payments
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Plan</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Start Date</TableHead>
                      <TableHead className="font-semibold">End Date</TableHead>
                      <TableHead className="font-semibold">Days Remaining</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.plan_type && u.plan_type !== 'free').map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/10 rounded-full">
                              <User className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.username}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500 text-white">
                            {user.plan_type || 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <p className="text-sm">{formatDate(user.subscription_start || user.created_at)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{formatDate(user.subscription_expiry)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {calculateRemainingDays(user.subscription_expiry)} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'extend')}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Extend Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="h-4 w-4 mr-2" />
                                Cancel Subscription
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

        {/* Support Tickets Tab */}
        <TabsContent value="support-tickets" className="space-y-6 animate-in fade-in duration-300">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Support Ticket System
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Manage and respond to user support requests
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tickets</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No support tickets found</p>
                <p className="text-xs text-muted-foreground mt-1">Support tickets will appear here when users submit requests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs" className="space-y-6 animate-in fade-in duration-300">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Audit Logs
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Track all administrative actions and system events
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No audit logs found</p>
                  <p className="text-xs text-muted-foreground mt-1">Administrative actions will be logged here</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Action</TableHead>
                        <TableHead className="font-semibold">Actor</TableHead>
                        <TableHead className="font-semibold">Target</TableHead>
                        <TableHead className="font-semibold">Timestamp</TableHead>
                        <TableHead className="font-semibold">IP Address</TableHead>
                        <TableHead className="font-semibold">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-purple-500/10 rounded-full">
                                <Activity className="h-4 w-4 text-purple-500" />
                              </div>
                              <span className="font-medium text-sm">{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{log.actor || log.user || 'System'}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{log.target_type || 'N/A'}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{formatDateTime(log.created_at || log.timestamp)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-mono">{log.ip_address || 'N/A'}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs text-muted-foreground">{log.details || 'No additional details'}</p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Settings */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  System Settings
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Enable system maintenance mode</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Manage email notification settings</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">API Configuration</p>
                    <p className="text-xs text-muted-foreground">Configure API keys and endpoints</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage security and access control settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">IP Whitelist</p>
                    <p className="text-xs text-muted-foreground">Manage allowed IP addresses</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Session Management</p>
                    <p className="text-xs text-muted-foreground">Configure session timeout and policies</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Backup & Recovery */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  Backup & Recovery
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage system backups and data recovery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Database Backup</p>
                    <p className="text-xs text-muted-foreground">Last backup: Never</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Backup Now
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Auto Backup Schedule</p>
                    <p className="text-xs text-muted-foreground">Configure automatic backups</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Integration Settings */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Integrations
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage third-party integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Telegram Integration</p>
                    <p className="text-xs text-muted-foreground">Configure Telegram bot settings</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Payment Gateway</p>
                    <p className="text-xs text-muted-foreground">Configure payment processing</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanelEnhanced;
>>>>>>> 00392b0 (Initial commit of unified Brain Link Tracker project with integrated admin panel fixes)
