import React, { useState } from 'react';
import { Search, Home, CheckCircle2, AlertCircle, Loader2, ArrowRight, LogOut, Building2, MapPin } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface Unit {
  id: string;
  unitNumber: string;
  rentAmount: number;
  status: 'Vacant' | 'Occupied';
}

interface Property {
  id: string;
  name: string;
  address: string;
  units: Unit[];
}

const PropertyLink: React.FC<{ onLinkSuccess: () => void }> = ({ onLinkSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Search, 2 = Select Unit
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundProperty, setFoundProperty] = useState<Property | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // --- Handle Logout / Back to Home ---
  const handleLogout = async () => {
    await signOut(auth);
    // The onAuthStateChanged listener in App.tsx will automatically redirect to Home
  };

  // --- Step 1: Find Property by Unique Code (Firebase) ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const propertiesRef = collection(db, "properties");
      // Search for code (case-insensitive usually handled by storing uppercase)
      const q = query(propertiesRef, where("propertyCode", "==", searchCode.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const propDoc = querySnapshot.docs[0];
        const propData = propDoc.data();
        
        // Fetch Units for this property
        const unitsRef = collection(db, "units");
        const unitsQuery = query(unitsRef, where("propertyId", "==", propDoc.id));
        const unitsSnapshot = await getDocs(unitsQuery);
        
        const loadedUnits = unitsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Unit[];

        setFoundProperty({
          id: propDoc.id,
          name: propData.name,
          address: propData.address,
          units: loadedUnits
        });
        
        setStep(2);
      } else {
        setError('Property not found. Please check the code provided by your landlord.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Claim a Vacant Unit (Firebase) ---
  const handleClaimUnit = async () => {
    if (!selectedUnitId || !auth.currentUser) return;
    setLoading(true);

    try {
      const user = auth.currentUser;

      // 1. Double check if unit is still vacant (Real-time check)
      const unitRef = doc(db, "units", selectedUnitId);
      const unitSnap = await getDoc(unitRef);
      
      if (unitSnap.exists() && unitSnap.data().status === 'Occupied') {
        setError('This unit has just been taken by someone else.');
        setLoading(false);
        return;
      }

      // 2. Link Unit to Tenant (Update Unit Doc)
      await updateDoc(unitRef, {
        status: 'Occupied',
        tenantId: user.uid,
        tenantName: user.displayName || 'Tenant',
        tenantEmail: user.email
      });

      // 3. Link Tenant to Unit (Update User Doc)
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        unitId: selectedUnitId,
        role: 'TENANT' // Ensure role is set
      });

      onLinkSuccess(); // Redirect to Dashboard
    } catch (err) {
      console.error(err);
      setError('Failed to claim unit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* --- ADDED NAVIGATION HEADER --- */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#E67E22] p-1.5 rounded-lg text-white">
            <Home size={20} />
          </div>
          <span className="text-xl font-bold text-[#1A1A1A]">GidaNa</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="text-gray-500 hover:text-[#E67E22] font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <LogOut size={18} />
          Sign Out & Return Home
        </button>
      </header>

      {/* --- MAIN CONTENT CENTERED --- */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#E67E22] mb-6">
                <Search size={32} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Find Your Home</h2>
              <p className="text-gray-500 mb-8">Enter the unique Property Code provided by your landlord to link your account.</p>
              
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Property Code</label>
                  <input 
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GIDA-882"
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#E67E22] rounded-2xl px-6 py-4 font-mono text-xl font-bold text-center outline-none transition-all placeholder:text-gray-300"
                    maxLength={10}
                  />
                </div>
                
                {error && (
                  <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl text-sm font-bold">
                    <AlertCircle size={18}/> {error}
                  </div>
                )}

                <button disabled={loading || !searchCode} className="w-full bg-[#141414] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <>Search Property <ArrowRight size={18}/></>}
                </button>
              </form>
            </div>
          )}

          {step === 2 && foundProperty && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-gray-900 mb-6 flex items-center gap-1">← Back to Search</button>
              
              <div className="flex items-center gap-4 mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#E67E22] shadow-sm"><Building2 size={20}/></div>
                <div>
                  <h3 className="font-black text-gray-900">{foundProperty.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {foundProperty.address}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Select Your Unit</h3>
              <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {foundProperty.units.filter(u => u.status === 'Vacant').length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl">
                    No vacant units available in this property.
                  </div>
                ) : (
                  foundProperty.units
                    .filter(u => u.status === 'Vacant')
                    .map(unit => (
                      <div 
                        key={unit.id}
                        onClick={() => setSelectedUnitId(unit.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                          selectedUnitId === unit.id 
                            ? 'border-[#E67E22] bg-orange-50/50' 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-gray-900">{unit.unitNumber}</p>
                          <p className="text-xs text-gray-500">₦{Number(unit.rentAmount).toLocaleString()}/yr</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedUnitId === unit.id ? 'border-[#E67E22] bg-[#E67E22] text-white' : 'border-gray-200'}`}>
                          {selectedUnitId === unit.id && <CheckCircle2 size={14}/>}
                        </div>
                      </div>
                    ))
                )}
              </div>

              <button 
                onClick={handleClaimUnit} 
                disabled={loading || !selectedUnitId}
                className="w-full bg-[#E67E22] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-[#D35400] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm & Move In'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PropertyLink;