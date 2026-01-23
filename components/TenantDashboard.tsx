import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CreditCard, Wrench, Settings as SettingsIcon, 
  LogOut, Menu, X, Bell, User, Calendar, CheckCircle2, 
  AlertCircle, Clock, ChevronRight, FileText, Download, Plus,
  Home, MapPin, Phone, Mail, Check, Loader2, ArrowLeft
} from 'lucide-react';
import { db, auth } from '../firebase';
import { 
  collection, query, where, getDocs, addDoc, 
  orderBy, doc, getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { usePaystackPayment } from 'react-paystack';

// --- Types ---
interface TenantProfile {
  id: string;
  name: string;
  email: string;
  unitId: string;
  unitNumber: string;
  propertyName: string;
  propertyAddress: string;
  landlordId: string;
  rentAmount: number;
  leaseEnd: string;
  balance: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  reference: string;
  status: string;
  type: string;
}

interface MaintenanceRequest {
  id: string;
  title: string;
  date: string;
  status: string;
  priority: string;
}

// --- Reusable UI Components ---
const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void 
}> = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 cursor-pointer transition-all rounded-xl mb-1 px-4 py-3.5 ${
      active 
        ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-900/20 font-bold' 
        : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
    }`}
  >
    <div className="shrink-0">{icon}</div>
    <span className="text-sm whitespace-nowrap">{label}</span>
  </div>
);

const StatCard: React.FC<{
  title: string; value: string; subText?: string; icon: React.ReactNode; color: string;
}> = ({ title, value, subText, icon, color }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <p className="text-gray-400 text-[13px] font-bold uppercase tracking-wider">{title}</p>
      <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
    </div>
    <h3 className="text-3xl font-black text-gray-900 mb-2">{value}</h3>
    <div className="mt-auto">
      <span className="text-[12px] text-gray-400 font-medium">{subText}</span>
    </div>
  </div>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-[900] text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-gray-500 text-sm font-medium">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3">{actions}</div>
  </div>
);

const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: any = {
    Success: 'bg-green-100 text-green-600',
    Resolved: 'bg-green-100 text-green-600',
    Pending: 'bg-yellow-100 text-yellow-600',
    'In Progress': 'bg-blue-100 text-blue-600',
    Failed: 'bg-red-100 text-red-600',
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-orange-100 text-orange-600',
    Low: 'bg-gray-100 text-gray-600',
  };
  const style = styles[status] || 'bg-gray-100 text-gray-600';
  return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${style}`}>{status}</span>;
};

// --- Main Component ---
const TenantDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // Data State
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [tenant, setTenant] = useState<TenantProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  
  // Modals
  const [showPayModal, setShowPayModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // --- PAYSTACK CONFIG ---
  const config = {
    reference: (new Date()).getTime().toString(),
    email: tenant?.email || "",
    amount: (tenant?.rentAmount || 0) * 100, 
    publicKey: 'pk_test_361743acb45172e313d9f2d9c82f1488809a6d55',
  };

  const initializePayment = usePaystackPayment(config);

  const onPaystackSuccess = async (reference: any) => {
    if (!tenant) return;
    setFormLoading(true);
    
    try {
      await addDoc(collection(db, "payments"), {
        unitId: tenant.unitId,
        landlordId: tenant.landlordId,
        amount: tenant.rentAmount,
        paidAt: new Date().toISOString(),
        reference: reference.reference,
        status: 'Success',
        method: 'Paystack',
        unit: {
          unitNumber: tenant.unitNumber,
          tenantName: tenant.name,
          property: { name: tenant.propertyName }
        }
      });

      await loadData();
      setShowPayModal(false);
      alert(`Payment Successful! Ref: ${reference.reference}`);
    } catch (err) {
      console.error(err);
      alert("Payment verified but failed to save record.");
    } finally {
      setFormLoading(false);
    }
  };

  const onPaystackClose = () => {
    console.log("Payment closed");
  };

  // --- Load Data ---
  const loadData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (!userData?.unitId) {
        setLoading(false);
        return;
      }

      const unitDocRef = doc(db, "units", userData.unitId);
      const unitDoc = await getDoc(unitDocRef);
      const unitData = unitDoc.data();

      const propDocRef = doc(db, "properties", unitData?.propertyId);
      const propDoc = await getDoc(propDocRef);
      const propData = propDoc.data();

      const moveInDate = unitData?.createdAt ? new Date(unitData.createdAt) : new Date();
      const leaseEndDate = new Date(moveInDate);
      leaseEndDate.setFullYear(leaseEndDate.getFullYear() + 1);

      setTenant({
        id: user.uid,
        name: userData.name || 'Tenant',
        email: user.email || '',
        unitId: userData.unitId,
        unitNumber: unitData?.unitNumber || 'N/A',
        propertyName: propData?.name || 'Unknown Property',
        propertyAddress: propData?.address || 'Lagos, Nigeria',
        landlordId: propData?.landlordId, 
        rentAmount: Number(unitData?.rentAmount || 0),
        leaseEnd: leaseEndDate.toISOString(),
        balance: 0 
      });

      const payQuery = query(collection(db, "payments"), where("unitId", "==", userData.unitId), orderBy("paidAt", "desc"));
      const paySnap = await getDocs(payQuery);
      setPayments(paySnap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          date: new Date(d.paidAt).toLocaleDateString(),
          amount: d.amount,
          reference: d.reference,
          status: d.status,
          type: 'Rent'
        };
      }));

      const maintQuery = query(collection(db, "maintenance"), where("unitId", "==", userData.unitId));
      const maintSnap = await getDocs(maintQuery);
      setMaintenance(maintSnap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title,
          date: new Date(d.date).toLocaleDateString(),
          status: d.status,
          priority: d.priority
        };
      }));

    } catch (error) {
      console.error("Error loading tenant data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) loadData();
    });
    return () => unsubscribe();
  }, []);

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setFormLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await addDoc(collection(db, "maintenance"), {
        unitId: tenant.unitId,
        propertyId: tenant.landlordId,
        landlordId: tenant.landlordId,
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        status: 'Pending',
        date: new Date().toISOString(),
        unit: { unitNumber: tenant.unitNumber },
        property: { name: tenant.propertyName }
      });
      
      await loadData();
      setShowMaintenanceModal(false);
      alert("Request submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    } finally {
      setFormLoading(false);
    }
  };

  // --- Render Functions ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title={`Hello, ${tenant?.name.split(' ')[0] || 'Tenant'}!`} 
        subtitle={`Welcome home to ${tenant?.unitNumber}, ${tenant?.propertyName}`}
        actions={
          <button onClick={() => setShowPayModal(true)} className="bg-[#E67E22] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-100 hover:bg-[#D35400] transition-all">
            <CreditCard size={20}/> Pay Rent
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Rent Amount" 
          value={`₦${tenant?.rentAmount.toLocaleString()}`} 
          subText="Per annum"
          icon={<CheckCircle2 size={22}/>} 
          color="bg-green-50 text-green-500" 
        />
        <StatCard 
          title="Lease Ends" 
          value={tenant?.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString() : 'N/A'} 
          subText="Active Lease"
          icon={<Calendar size={22}/>} 
          color="bg-blue-50 text-blue-500" 
        />
        <StatCard 
          title="Open Requests" 
          value={maintenance.filter(m => m.status !== 'Resolved').length.toString()} 
          subText="Maintenance issues"
          icon={<Wrench size={22}/>} 
          color="bg-orange-50 text-[#E67E22]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-900">Recent Payments</h3>
            <button onClick={() => setActiveTab('Payments')} className="text-sm font-bold text-[#E67E22] hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {payments.length === 0 ? <p className="text-gray-400 text-sm">No payments yet.</p> : payments.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={18}/></div>
                  <div><p className="font-bold text-gray-900">{p.type}</p><p className="text-xs text-gray-500">{p.date}</p></div>
                </div>
                <p className="font-black text-gray-900">₦{p.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -mr-8 -mt-8 z-0"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-black text-gray-900 mb-6">My Unit Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Home size={16}/></div>
                <div><p className="font-bold text-gray-900">Unit {tenant?.unitNumber}</p><p className="text-xs">{tenant?.propertyName}</p></div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><MapPin size={16}/></div>
                <div><p className="font-bold text-gray-900">Location</p><p className="text-xs">{tenant?.propertyAddress}</p></div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Phone size={16}/></div>
                <div><p className="font-bold text-gray-900">Landlord Contact</p><p className="text-xs">Contact via App</p></div>
              </div>
            </div>
            <button className="mt-8 w-full py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:border-[#E67E22] hover:text-[#E67E22] transition-all flex items-center justify-center gap-2">
              <Download size={18}/> Download Lease Agreement
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader title="Payments" subtitle="Track your rent history" actions={<button onClick={() => setShowPayModal(true)} className="bg-[#E67E22] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-100"><Plus size={20}/> Make Payment</button>} />
      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Reference</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/30 transition-all">
                <td className="px-8 py-6 text-sm font-bold text-gray-900">{p.date}</td>
                <td className="px-8 py-6 text-xs font-mono text-gray-500">{p.reference}</td>
                <td className="px-8 py-6 text-sm text-gray-600">{p.type}</td>
                <td className="px-8 py-6 font-black text-[#E67E22]">₦{p.amount.toLocaleString()}</td>
                <td className="px-8 py-6"><Badge status={p.status} /></td>
                <td className="px-8 py-6 text-right"><button className="text-gray-400 hover:text-[#E67E22]"><Download size={18}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <div className="p-10 text-center text-gray-400">No payment history found</div>}
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader title="Maintenance" subtitle="Report and track issues" actions={<button onClick={() => setShowMaintenanceModal(true)} className="bg-[#E67E22] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-100"><Plus size={20}/> New Request</button>} />
      <div className="grid grid-cols-1 gap-4">
        {maintenance.length === 0 ? <div className="p-10 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">No maintenance requests found</div> : maintenance.map(m => (
          <div key={m.id} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                <Wrench size={24}/>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">{m.title}</h4>
                <p className="text-xs text-gray-400">Reported on {m.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge status={m.priority} />
              <Badge status={m.status} />
              <button className="p-2 text-gray-300 hover:text-gray-900"><ChevronRight size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <SectionHeader title="Settings" subtitle="Manage your account" />
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
        <h3 className="text-xl font-black text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
            <input defaultValue={tenant?.name} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 outline-none"/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
            <input defaultValue={tenant?.email} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-500 cursor-not-allowed"/>
          </div>
        </div>
        <p className="text-xs text-gray-400">To change your details, please contact your landlord.</p>
      </div>
    </div>
  );

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-[#E67E22]"><Loader2 className="animate-spin" size={40}/></div>;
  }

  // --- SAFETY NAV FOR NO UNIT STATE ---
  if (!tenant) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500 space-y-4">
        <p>No property linked. Please search for your unit code.</p>
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 bg-[#E67E22] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#D35400] transition-all"
        >
          <ArrowLeft size={20}/> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#141414] text-white flex flex-col p-5 transition-all duration-300 ${isMobileSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-72'}`}>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-[#E67E22] p-2 rounded-xl"><Home size={24}/></div>
            <h2 className="text-xl font-black">GidaNa</h2>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-gray-500"><X size={24}/></button>
        </div>
        
        <nav className="space-y-1 flex-1">
          {/* Added Home Navigation that triggers Logout/Return */}
          <SidebarItem 
            icon={<Home size={20}/>} 
            label="Back to Website" 
            onClick={onLogout} 
          />
          <div className="my-4 border-t border-white/10"></div>
          
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'Overview'} onClick={() => {setActiveTab('Overview'); setIsMobileSidebarOpen(false);}} />
          <SidebarItem icon={<CreditCard size={20}/>} label="Payments" active={activeTab === 'Payments'} onClick={() => {setActiveTab('Payments'); setIsMobileSidebarOpen(false);}} />
          <SidebarItem icon={<Wrench size={20}/>} label="Maintenance" active={activeTab === 'Maintenance'} onClick={() => {setActiveTab('Maintenance'); setIsMobileSidebarOpen(false);}} />
          <SidebarItem icon={<SettingsIcon size={20}/>} label="Settings" active={activeTab === 'Settings'} onClick={() => {setActiveTab('Settings'); setIsMobileSidebarOpen(false);}} />
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <button onClick={onLogout} className="flex items-center gap-3 text-red-400 font-bold px-4 py-3 hover:bg-white/5 rounded-xl w-full transition-all">
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:ml-72 overflow-hidden relative">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-40">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 bg-gray-50 rounded-xl text-gray-600"><Menu size={24}/></button>
          <div className="ml-auto flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-[#E67E22] transition-colors">
              <Bell size={24}/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100 relative">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900">{tenant.name}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tenant</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#E67E22] flex items-center justify-center font-black border-2 border-white shadow-sm">
                  {tenant.name.charAt(0)}
                </div>
              </div>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16}/> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 pb-24">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Payments' && renderPayments()}
          {activeTab === 'Maintenance' && renderMaintenance()}
          {activeTab === 'Settings' && renderSettings()}
        </div>
      </main>

      {/* --- PAYMENT MODAL --- */}
      {showPayModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">Pay Rent</h3>
              <button onClick={() => setShowPayModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"><X size={20}/></button>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl mb-6 text-center border border-orange-100">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Amount Due</p>
              <p className="text-3xl font-black text-[#E67E22]">₦{tenant.rentAmount.toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-6 text-center">
              You will be redirected to Paystack to complete your secure payment.
            </p>
            <button 
              onClick={() => initializePayment({ onSuccess: onPaystackSuccess, onClose: onPaystackClose })}
              disabled={formLoading}
              className="w-full bg-[#E67E22] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-[#D35400] transition-all flex items-center justify-center gap-2"
            >
              {formLoading ? <Loader2 className="animate-spin" /> : 'Proceed to Paystack'}
            </button>
          </div>
        </div>
      )}

      {/* --- MAINTENANCE MODAL --- */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">New Request</h3>
              <button onClick={() => setShowMaintenanceModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"><X size={20}/></button>
            </div>
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Issue Title</label>
                <input name="title" required placeholder="e.g. Broken Window" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-100"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
                <select name="priority" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-900 outline-none">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea name="description" placeholder="Describe the issue..." className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 outline-none h-32 resize-none"></textarea>
              </div>
              <button type="submit" disabled={formLoading} className="w-full bg-[#E67E22] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-[#D35400] transition-all mt-4 flex justify-center gap-2">
                {formLoading ? <Loader2 className="animate-spin" /> : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;