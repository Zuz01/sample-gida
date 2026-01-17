
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Building2, Layers, Users, FileText, 
  Wallet, Wrench, BarChart3, Settings as SettingsIcon, Search, Bell, 
  ChevronDown, Plus, Home, TrendingUp, AlertCircle, Clock,
  ChevronLeft, ChevronRight, Grid, List, X,
  MapPin, Bed, Bath, MoreVertical, CheckCircle2, Calendar,
  Trash2, Edit3, Download, Info, DollarSign, PieChart,
  User, Shield, CreditCard, Briefcase, MessageSquare, Smartphone,
  Mail, Eye, EyeOff, Lock, LogOut
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  totalUnits: number;
  units: Unit[];
}

interface Unit {
  id: string;
  number: string;
  type: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  status: 'Vacant' | 'Occupied' | 'Under Maintenance';
  propertyId: string;
}

interface Tenant {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface Lease {
  id: string;
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Terminated';
}

interface Payment {
  id: string;
  tenantId: string;
  unitId: string;
  referenceCode: string;
  date: string;
  dueDate: string;
  amount: number;
  type: 'Rent' | 'Security Deposit' | 'Other';
  status: 'Confirmed' | 'Pending' | 'Needs Review';
  reviewReason?: string;
}

interface MaintenanceRequest {
  id: string;
  unitId: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, isCollapsed, onClick }) => (
  <div 
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={`flex items-center gap-3 cursor-pointer transition-all rounded-xl mb-1 ${
      active 
        ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-900/20 font-bold' 
        : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
    } ${isCollapsed ? 'justify-center py-3.5 px-0' : 'px-4 py-3'}`}
  >
    <div className="shrink-0">{icon}</div>
    {!isCollapsed && <span className="text-sm whitespace-nowrap overflow-hidden">{label}</span>}
  </div>
);

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string | React.ReactNode;
  trend?: string;
  icon?: React.ReactNode;
  colorClass: string;
  iconColorClass?: string;
  statusIcon?: React.ReactNode;
  valueColorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, icon, colorClass, iconColorClass, statusIcon, valueColorClass = 'text-gray-900' }) => (
  <div className={`p-6 rounded-3xl border border-gray-100 ${colorClass} flex justify-between items-start flex-1 min-w-[200px]`}>
    <div>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-gray-500 text-sm font-semibold">{title}</p>
        {statusIcon}
      </div>
      <h3 className={`text-2xl font-bold ${valueColorClass} mb-1`}>{value}</h3>
      {subValue && <div className="text-xs text-gray-400 font-medium">{subValue}</div>}
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          <TrendingUp size={14} className="text-green-500" />
          <span className="text-xs font-bold text-green-500">{trend} <span className="text-gray-400 font-normal">vs last month</span></span>
        </div>
      )}
    </div>
    {icon && (
      <div className={`p-3 rounded-2xl ${iconColorClass}`}>
        {icon}
      </div>
    )}
  </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={(e) => { e.preventDefault(); onChange(); }}
    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out outline-none ${checked ? 'bg-[#E67E22]' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [reportRange, setReportRange] = useState('Last 6 Months');
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'Profile' | 'Notifications' | 'Business' | 'Billing' | 'Security'>('Profile');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isTrialBannerVisible, setIsTrialBannerVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Notification State
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    whatsapp: true,
    sms: false,
    paymentReceived: true,
    paymentNeedsReview: true,
    leaseExpiring: true,
    maintenanceRequest: true,
    maintenanceCompleted: false,
    reportsReady: true
  });

  const togglePref = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // App state
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

  // UI state
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isAddMaintenanceModalOpen, setIsAddMaintenanceModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'Properties', label: 'Properties', icon: <Building2 size={20} /> },
    { id: 'Units', label: 'Units', icon: <Layers size={20} /> },
    { id: 'Tenants', label: 'Tenants', icon: <Users size={20} /> },
    { id: 'Leases', label: 'Leases', icon: <FileText size={20} /> },
    { id: 'Payments', label: 'Payments', icon: <Wallet size={20} /> },
    { id: 'Maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
    { id: 'Reports', label: 'Reports', icon: <BarChart3 size={20} /> },
  ];

  // Derived state
  const allUnits = useMemo(() => {
    return properties.flatMap(p => p.units.map(u => ({ ...u, propertyName: p.name })));
  }, [properties]);

  const occupiedUnitsCount = allUnits.filter(u => u.status === 'Occupied').length;
  const occupancyRate = allUnits.length > 0 ? Math.round((occupiedUnitsCount / allUnits.length) * 100) : 0;
  const totalCollected = useMemo(() => payments.filter(p => p.status === 'Confirmed').reduce((acc, p) => acc + p.amount, 0), [payments]);
  const maintenanceStats = useMemo(() => ({
    total: maintenanceRequests.length,
    pending: maintenanceRequests.filter(r => r.status === 'Pending').length,
    inProgress: maintenanceRequests.filter(r => r.status === 'In Progress').length,
    highPriority: maintenanceRequests.filter(r => r.priority === 'High').length,
  }), [maintenanceRequests]);

  // CRUD Handlers
  const handleAddProperty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const unitCount = parseInt(formData.get('totalUnits') as string || '0');
    const propertyId = Date.now().toString();
    const autoUnits: Unit[] = [];
    for(let i = 1; i <= unitCount; i++) {
        autoUnits.push({ id: `${propertyId}-unit-${i}`, number: `${i}`, type: 'Apartment', rent: 150000, bedrooms: 1, bathrooms: 1, status: 'Vacant', propertyId: propertyId });
    }
    const newProperty: Property = { id: propertyId, name: formData.get('name') as string, address: formData.get('address') as string, city: formData.get('city') as string, state: 'Lagos', type: 'Residential', totalUnits: unitCount, units: autoUnits };
    setProperties([...properties, newProperty]);
    setIsAddPropertyModalOpen(false);
    setToast(`${newProperty.name} created`);
  };

  const handleAddMaintenance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      unitId: formData.get('unitId') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: (formData.get('priority') as any) || 'Medium',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };
    setMaintenanceRequests([...maintenanceRequests, newRequest]);
    setIsAddMaintenanceModalOpen(false);
    setToast('Maintenance request created');
  };

  // VIEWS
  const renderDashboardOverview = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div><h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-1">Dashboard</h1><p className="text-gray-500 text-sm font-medium">Overview of your rental portfolio.</p></div>
        <button onClick={() => setIsAddPropertyModalOpen(true)} className="bg-[#E67E22] hover:bg-[#D35400] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-[0.98] w-full sm:w-auto"><Plus size={20} />Add Property</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Properties" value={properties.length.toString()} subValue={`${allUnits.length} total units`} icon={<Building2 size={24} />} colorClass="bg-[#FFF8F6]" iconColorClass="bg-[#FFEBE5] text-[#E67E22]" />
        <StatCard title="Occupancy" value={`${occupancyRate}%`} trend="+2%" icon={<Layers size={24} />} colorClass="bg-[#F6FFFA]" iconColorClass="bg-[#E5FFF1] text-[#27AE60]" />
        <StatCard title="Total Revenue" value={`₦ ${totalCollected.toLocaleString()}`} trend="+5%" icon={<Wallet size={24} />} colorClass="bg-[#F6FBFF]" iconColorClass="bg-[#E5F3FF] text-[#2980B9]" />
        <StatCard title="Total Tenants" value={tenants.length.toString()} subValue="Active records" icon={<Users size={24} />} colorClass="bg-white" iconColorClass="bg-gray-100 text-gray-600" />
      </div>
    </>
  );

  const renderSettingsView = () => {
    const renderProfileSettings = () => (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Information</h2>
          <p className="text-gray-400 text-sm font-medium mb-8">Update your personal details and contact information</p>
          
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 bg-orange-100 text-[#E67E22] rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow-sm">AB</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">akolo bulus</h3>
              <p className="text-gray-400 font-medium">bak@gmail.com</p>
            </div>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <input type="text" defaultValue="akolo bulus" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                <input type="email" defaultValue="bak@gmail.com" disabled className="w-full bg-gray-100/50 border border-gray-100 rounded-2xl py-4 px-6 outline-none font-medium text-gray-400 cursor-not-allowed" />
                <p className="text-[10px] text-gray-400 ml-1 font-bold italic">Email cannot be changed</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
              <input type="text" placeholder="+234 7XX XXX XXX" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" className="bg-[#E67E22] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-[#D35400] transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    );

    const renderNotificationSettings = () => (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
          <p className="text-gray-400 text-sm font-medium mb-10">Choose how you want to receive notifications</p>

          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="bg-orange-50 p-3 rounded-2xl text-[#E67E22]"><Mail size={24}/></div>
                <div><h4 className="font-bold text-gray-900">Email Notifications</h4><p className="text-sm text-gray-400 font-medium">Receive updates via email</p></div>
              </div>
              <ToggleSwitch checked={notificationPrefs.email} onChange={() => togglePref('email')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="bg-green-50 p-3 rounded-2xl text-green-500"><MessageSquare size={24}/></div>
                <div><h4 className="font-bold text-gray-900">WhatsApp Notifications</h4><p className="text-sm text-gray-400 font-medium">Get alerts on WhatsApp</p></div>
              </div>
              <ToggleSwitch checked={notificationPrefs.whatsapp} onChange={() => togglePref('whatsapp')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-500"><Smartphone size={24}/></div>
                <div><h4 className="font-bold text-gray-900">SMS Notifications</h4><p className="text-sm text-gray-400 font-medium">Receive SMS for urgent alerts</p></div>
              </div>
              <ToggleSwitch checked={notificationPrefs.sms} onChange={() => togglePref('sms')} />
            </div>

            <div className="pt-10 border-t border-gray-50">
              <h3 className="font-bold text-gray-900 mb-8">Notify me about:</h3>
              <div className="space-y-6">
                {[
                  { label: "New payment received", key: "paymentReceived" as const },
                  { label: "Payment needs review", key: "paymentNeedsReview" as const },
                  { label: "Lease expiring soon", key: "leaseExpiring" as const },
                  { label: "New maintenance request", key: "maintenanceRequest" as const },
                  { label: "Maintenance completed", key: "maintenanceCompleted" as const },
                  { label: "Monthly reports ready", key: "reportsReady" as const },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    <ToggleSwitch checked={notificationPrefs[item.key]} onChange={() => togglePref(item.key)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderBusinessSettings = () => (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Business Information</h2>
          <p className="text-gray-400 text-sm font-medium mb-10">Your business details for invoices and communications</p>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Business / Company Name</label>
                <input type="text" placeholder="e.g., Njeri Properties Ltd" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Tax ID / TIN</label>
                <input type="text" placeholder="e.g., 12345678-0001" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Business Address</label>
              <input type="text" placeholder="e.g., 123 Herbert Macaulay Way, Lagos" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Payment Reference (M-Pesa/Bank/Paystack)</label>
                <input type="text" placeholder="Enter bank or payment code" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Bank Account Details</label>
                <input type="text" placeholder="e.g., Access Bank - 0123456789" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" className="bg-[#E67E22] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-[#D35400] transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    );

    const renderBillingSettings = () => (
      <div className="space-y-10 animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Current Plan</h2>
          <div className="bg-[#E67E22] rounded-[32px] p-8 text-white relative overflow-hidden mb-6">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-lg">Current Plan</span>
                  <span className="text-xs font-black uppercase tracking-widest bg-white text-[#E67E22] px-3 py-1 rounded-lg">Trial</span>
                </div>
                <h3 className="text-4xl font-black mb-2">Starter</h3>
                <p className="text-orange-50 font-bold">Up to 10 units • 2 properties</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black">₦ 1,500</p>
                <p className="text-orange-50 text-sm font-bold">/month</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-sky-500 p-2 rounded-xl text-white"><Clock size={18}/></div>
              <div><p className="text-sm font-bold text-sky-900">Trial Period</p><p className="text-xs text-sky-700 font-medium">13 days remaining</p></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-gray-50">
             <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Trial ends</p>
                <p className="font-bold text-gray-900">February 16, 2025</p>
             </div>
             <button className="bg-white border border-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
                <CreditCard size={18} className="text-gray-400" /> Manage Billing
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Usage Overview</h2>
          <p className="text-gray-400 text-sm font-medium mb-10">Track your resource usage against plan limits</p>

          <div className="space-y-10">
            {[
              { label: "Properties", current: 1, limit: 2, icon: <Building2 size={16}/> },
              { label: "Units", current: 1, limit: 10, icon: <Layers size={16}/> },
              { label: "WhatsApp Messages", current: 0, limit: 50, icon: <MessageSquare size={16}/> },
            ].map((usage, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <div className="flex items-center gap-2 text-gray-600">{usage.icon} {usage.label}</div>
                  <div className="text-gray-900">{usage.current} / {usage.limit}</div>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#E67E22] h-full transition-all duration-1000" 
                    style={{ width: `${(usage.current / usage.limit) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const renderSecuritySettings = () => (
      <div className="space-y-10 animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
          <p className="text-gray-400 text-sm font-medium mb-10">Update your password to keep your account secure</p>

          <form className="space-y-8 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
              <div className="relative">
                <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
                <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={20}/></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                <div className="relative">
                  <input type="password" placeholder="Enter new password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
                  <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={20}/></button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                <div className="relative">
                  <input type="password" placeholder="Confirm new password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium text-gray-900" />
                  <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={20}/></button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="bg-[#E67E22] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-[#D35400] transition-all flex items-center gap-2">
                <Shield size={18}/> Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    );

    return (
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-1">Settings</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your account and preferences</p>
        </div>

        <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-2">
          {[
            { id: 'Profile', icon: <User size={18}/> },
            { id: 'Notifications', icon: <Bell size={18}/> },
            { id: 'Business', icon: <Briefcase size={18}/> },
            { id: 'Billing', icon: <CreditCard size={18}/> },
            { id: 'Security', icon: <Shield size={18}/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id as any)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all relative ${
                activeSettingsTab === tab.id 
                  ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-100' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.id}
            </button>
          ))}
        </div>

        {activeSettingsTab === 'Profile' && renderProfileSettings()}
        {activeSettingsTab === 'Notifications' && renderNotificationSettings()}
        {activeSettingsTab === 'Business' && renderBusinessSettings()}
        {activeSettingsTab === 'Billing' && renderBillingSettings()}
        {activeSettingsTab === 'Security' && renderSecuritySettings()}
      </div>
    );
  };

  const renderReportsView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-1">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm font-medium">Financial insights and property performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₦ ${totalCollected.toLocaleString()}`} subValue={<span className="text-green-500 font-bold flex items-center gap-1"><TrendingUp size={12}/> +5.2%</span>} icon={<DollarSign size={20}/>} iconColorClass="bg-orange-50 text-[#E67E22]" colorClass="bg-white shadow-sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
             <BarChart3 size={20} className="text-[#E67E22]" />
             <h2 className="text-xl font-bold text-gray-900">Revenue vs Collection</h2>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4 pb-8 relative border-l border-b border-gray-50">
            {[
              { month: 'Aug', expected: 80, collected: 65 },
              { month: 'Sep', expected: 85, collected: 70 },
              { month: 'Oct', expected: 90, collected: 82 },
              { month: 'Nov', expected: 95, collected: 88 },
              { month: 'Dec', expected: 98, collected: 92 },
              { month: 'Jan', expected: 100, collected: 90 },
            ].map((d, i) => (
              <div key={i} className="flex-grow flex flex-col items-center gap-2 h-full justify-end">
                <div className="flex gap-1 items-end h-full w-full">
                  <div className="bg-orange-500/80 rounded-t-md w-full" style={{ height: `${d.expected}%` }}></div>
                  <div className="bg-teal-500/80 rounded-t-md w-full" style={{ height: `${d.collected}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceView = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div><h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-1">Maintenance</h1><p className="text-gray-500 text-sm font-medium">Track and manage maintenance requests</p></div>
        <button onClick={() => setIsAddMaintenanceModalOpen(true)} className="bg-[#E67E22] hover:bg-[#D35400] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-[0.98] w-full sm:w-auto"><Plus size={20} />New Request</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Requests" value={maintenanceStats.total.toString()} colorClass="bg-white shadow-sm" />
        <StatCard title="Pending" value={maintenanceStats.pending.toString()} valueColorClass="text-[#E67E22]" colorClass="bg-white shadow-sm" />
        <StatCard title="In Progress" value={maintenanceStats.inProgress.toString()} valueColorClass="text-blue-500" colorClass="bg-white shadow-sm" />
        <StatCard title="High Priority" value={maintenanceStats.highPriority.toString()} valueColorClass="text-red-500" colorClass="bg-white shadow-sm" />
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 p-12 shadow-sm min-h-[400px] flex items-center justify-center">
        {maintenanceRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-sm">
            <div className="bg-gray-50 p-6 rounded-3xl text-gray-300 mb-6"><Wrench size={64} strokeWidth={1.2} /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No maintenance requests found</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">No maintenance requests yet. Tenants can report issues or you can manually create requests here.</p>
            <button onClick={() => setIsAddMaintenanceModalOpen(true)} className="bg-[#E67E22] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-100 hover:bg-[#D35400] transition-all"><Plus size={20} />New Request</button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
             <table className="w-full text-left">
                  <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Issue</th>
                          <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Unit</th>
                          <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Priority</th>
                          <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-right"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {maintenanceRequests.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-gray-900">{r.title}</td>
                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">Unit {allUnits.find(u => u.id === r.unitId)?.number}</td>
                        <td className="px-8 py-5 font-bold text-xs uppercase">{r.priority}</td>
                        <td className="px-8 py-5"><span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-50 text-yellow-500">{r.status}</span></td>
                        <td className="px-8 py-5 text-right"><button className="text-gray-300 hover:text-gray-900"><MoreVertical size={20}/></button></td>
                      </tr>
                    ))}
                  </tbody>
              </table>
          </div>
        )}
      </div>
    </>
  );

  const renderPropertiesView = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div><h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-1">Properties</h1><p className="text-gray-500 text-sm font-medium">Manage your real estate portfolio</p></div>
        <button onClick={() => setIsAddPropertyModalOpen(true)} className="bg-[#E67E22] hover:bg-[#D35400] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-100 transition-all w-full sm:w-auto"><Plus size={20} />Add Property</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-[32px] p-6 hover:shadow-xl transition-all group">
            <div className="bg-[#FFF5ED] p-4 rounded-2xl text-[#E67E22] w-fit mb-6"><Building2 size={28} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#E67E22] transition-colors">{p.name}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-6"><MapPin size={14} /> {p.address}, {p.city}</div>
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
              <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Units</p><p className="font-bold text-gray-900">{p.totalUnits}</p></div>
              <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p><p className="font-bold text-green-500 text-sm flex items-center gap-1"><CheckCircle2 size={12}/> Active</p></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderUnitsView = () => (
    <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr><th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase">Unit #</th><th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase">Property</th><th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">{allUnits.map(u => (<tr key={u.id} className="hover:bg-gray-50/30 transition-colors"><td className="px-8 py-5 font-bold text-gray-900">Unit {u.number}</td><td className="px-8 py-5 text-sm text-gray-500">{(u as any).propertyName}</td><td className="px-8 py-5"><span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-500">{u.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans">
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#141414] text-white flex flex-col p-4 shrink-0 transition-all duration-300 relative z-40`}>
        <div className="flex items-center px-1 mb-10 justify-between">
          <div className="flex items-center gap-3"><div className="bg-[#E67E22] p-2 rounded-xl text-white shrink-0"><Home size={24} /></div>{!isSidebarCollapsed && <h2 className="text-lg font-bold">GidaNa</h2>}</div>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-white transition-colors p-1">{isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button>
        </div>
        <nav className="flex-grow">{menuItems.map(i => <SidebarItem key={i.id} icon={i.icon} label={i.label} active={activeTab === i.id} isCollapsed={isSidebarCollapsed} onClick={() => { setActiveTab(i.id); }} />)}</nav>
        <div className="mt-auto pt-4 border-t border-white/5"><SidebarItem icon={<SettingsIcon size={20} />} label="Settings" active={activeTab === 'Settings'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveTab('Settings')} /><button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white transition-all text-sm font-medium">{!isSidebarCollapsed && <span>Logout</span>}</button></div>
      </aside>

      <main className="flex-grow flex flex-col overflow-hidden">
        {isTrialBannerVisible && (
          <div className="bg-[#0EA5E9] text-white py-3 px-8 flex items-center justify-between z-30 animate-in slide-in-from-top duration-300">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Clock size={18} />
                Free trial: 13 days remaining. Upgrade anytime for more features.
              </div>
              <div className="flex items-center gap-4">
                <button className="bg-white text-[#0EA5E9] px-4 py-1.5 rounded-xl text-sm font-bold shadow-sm hover:bg-sky-50 transition-all">View Plans</button>
                <button 
                  onClick={() => setIsTrialBannerVisible(false)}
                  className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                >
                  <X size={18}/>
                </button>
              </div>
          </div>
        )}

        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-20 shadow-sm relative">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search properties, tenants, units..." className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-orange-200 outline-none transition-all" />
          </div>
          
          <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-[#E67E22] transition-colors relative"><Bell size={22} /><span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
              
              {/* User Dropdown Area */}
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 pl-6 border-l border-gray-100 group cursor-pointer select-none"
                >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-[#E67E22] font-bold text-sm border-2 border-white shadow-sm group-hover:border-orange-200 transition-all">AB</div>
                    <div className="hidden sm:block text-right">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#E67E22] transition-colors">akolo bulus</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Landlord</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu - Refined to match screenshot exactly */}
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-gray-800">My Account</p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => { setActiveTab('Settings'); setActiveSettingsTab('Profile'); setIsUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        <User size={18} className="text-gray-400" />
                        Profile
                      </button>
                      <button 
                        onClick={() => { setActiveTab('Settings'); setIsUserDropdownOpen(false); }}
                        className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-50 py-1">
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                      >
                        <LogOut size={18} className="text-red-500" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-8 space-y-8 pb-12">
          {activeTab === 'Dashboard' && renderDashboardOverview()}
          {activeTab === 'Properties' && renderPropertiesView()}
          {activeTab === 'Units' && renderUnitsView()}
          {activeTab === 'Maintenance' && renderMaintenanceView()}
          {activeTab === 'Reports' && renderReportsView()}
          {activeTab === 'Settings' && renderSettingsView()}
          {!['Dashboard', 'Properties', 'Units', 'Maintenance', 'Reports', 'Settings'].includes(activeTab) && (
              <div className="py-20 text-center flex flex-col items-center">
                  <div className="bg-gray-50 p-6 rounded-3xl text-gray-300 mb-6">{menuItems.find(i => i.id === activeTab)?.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab} Feature</h2>
                  <p className="text-gray-500 font-medium">This feature is coming soon.</p>
              </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      {isAddPropertyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddPropertyModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-8">Add New Property</h2>
            <form onSubmit={handleAddProperty} className="space-y-5">
              <input name="name" placeholder="Property Name (e.g., Riverside Gardens) *" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium" />
              <input name="address" placeholder="Address *" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium" />
              <input name="totalUnits" type="number" placeholder="Total Units *" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium" />
              <div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsAddPropertyModalOpen(false)} className="flex-1 py-4 rounded-2xl border font-bold text-gray-500">Cancel</button><button type="submit" className="flex-1 bg-[#E67E22] text-white py-4 rounded-2xl font-bold">Add Property</button></div>
            </form>
          </div>
        </div>
      )}

      {isAddMaintenanceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddMaintenanceModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-8">Record Maintenance Request</h2>
            <form onSubmit={handleAddMaintenance} className="space-y-5">
              <select name="unitId" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none appearance-none cursor-pointer font-medium">
                  <option value="">Select Unit *</option>
                  {allUnits.map(u => <option key={u.id} value={u.id}>{u.number} — {u.propertyName}</option>)}
              </select>
              <input name="title" placeholder="Issue Title *" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium" />
              <textarea name="description" placeholder="Description..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium h-32"></textarea>
              <button type="submit" className="w-full bg-[#E67E22] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100">Create Request</button>
            </form>
          </div>
        </div>
      )}
      
      {toast && (
        <div className="fixed bottom-8 right-8 bg-[#141414] text-white rounded-2xl shadow-2xl py-4 px-6 flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 z-[1000]">
          <div className="text-green-500"><CheckCircle2 size={24} /></div>
          <span className="font-bold">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
