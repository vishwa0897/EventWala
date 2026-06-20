import React, { useState, useMemo, useEffect } from 'react';

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [maxPrice, setMaxPrice] = useState(3000);
  
  const [activeEvent, setActiveEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingStep, setBookingStep] = useState(0); 

  // 1. Backend Fetch: Load live database records on component mount
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error connecting to backend API:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. Backend Submission: Process transaction checkout routing
  const handleBookingConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: activeEvent.id,
          count: ticketCount
        })
      });
      
      const result = await response.json();
      if (result.success) {
        // Refresh structural records inside layout states instantly
        fetchEvents();
        setBookingStep(2);
      } else {
        alert(result.message || "Booking execution failed.");
      }
    } catch (error) {
      console.error("Error submitting booking transaction:", error);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = selectedLocation === "All" || event.location === selectedLocation;
      const matchesPrice = event.price <= maxPrice;
      return matchesCategory && matchesSearch && matchesLocation && matchesPrice;
    });
  }, [events, selectedCategory, searchQuery, selectedLocation, maxPrice]);

  return (
    <div className="min-h-screen bg-wala-light text-wala-dark font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-wala-dark text-wala-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-40 shadow-md">
        <div className="text-2xl font-black tracking-wider cursor-pointer">
          EVENT<span className="text-wala-primary">WALA</span>
        </div>
        <div className="hidden md:flex space-x-8 font-medium">
          <span className="cursor-pointer border-b-2 border-wala-primary pb-1">Home</span>
          <span className="cursor-pointer hover:text-wala-primary transition">Explore Events</span>
          <span className="cursor-pointer hover:text-wala-primary transition">Dashboard</span>
        </div>
        <button className="bg-wala-primary text-wala-white px-5 py-2 rounded-md font-semibold hover:bg-opacity-90 transition">Login</button>
      </nav>

      {/* Hero */}
      <header className="bg-wala-dark text-wala-white py-16 px-6 md:px-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <div className="max-w-2xl mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Discover & Book <span className="text-wala-primary">Live Events</span></h1>
          <p className="text-slate-400 text-lg mb-6">Your ticket gateway to the premium fests, workshops, and concerts.</p>
          <div className="inline-flex bg-wala-primary bg-opacity-20 border border-wala-primary px-4 py-2 rounded-md text-sm font-semibold text-wala-primary">⏳ Next Drop In: 02d : 14h : 45m</div>
        </div>
        
        <div className="w-full md:w-96 bg-wala-white text-wala-dark p-6 rounded-xl shadow-lg border border-slate-200">
          <h3 className="font-bold text-lg mb-3">Find Your Vibe</h3>
          <input 
            type="text" placeholder="Search keywords..." 
            className="w-full border border-slate-300 p-3 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-wala-primary"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <select className="border border-slate-300 p-2 rounded-md text-sm bg-wala-white" onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="All">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
            </select>
            <select className="border border-slate-300 p-2 rounded-md text-sm bg-wala-white" onChange={(e) => setMaxPrice(Number(e.target.value))}>
              <option value="3000">Any Price</option>
              <option value="0">Free</option>
              <option value="500">Under ₹500</option>
              <option value="1500">Under ₹1500</option>
            </select>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="bg-wala-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit space-y-6">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-xs text-slate-400 mb-3">Categories</h4>
            <div className="flex flex-col space-y-2">
              {["All", "Concerts", "Workshops", "Sports", "College Fests", "Conferences"].map((cat) => (
                <button
                  key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition ${selectedCategory === cat ? 'bg-wala-primary text-wala-white' : 'hover:bg-slate-100 text-wala-dark'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Active Listings ({filteredEvents.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-wala-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-wala-light text-wala-primary text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">{event.category}</span>
                    {event.seatsLeft <= 5 && <span className="text-xs text-red-600 bg-red-50 font-semibold px-2 py-1 rounded animate-pulse">⚠️ Only {event.seatsLeft} left!</span>}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-wala-primary transition duration-150 mb-2">{event.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{event.desc}</p>
                  <div className="text-xs text-slate-400 font-medium">📅 {event.date} | 📍 {event.location}</div>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-extrabold text-wala-dark">{event.price === 0 ? "FREE" : `₹${event.price}`}</span>
                  <button 
                    onClick={() => { setActiveEvent(event); setTicketCount(1); setBookingStep(1); }}
                    className="bg-wala-dark text-wala-white group-hover:bg-wala-primary text-sm font-bold px-4 py-2 rounded transition"
                  >
                    View & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Booking Funnel Modal */}
      {bookingStep > 0 && activeEvent && (
        <div className="fixed inset-0 bg-wala-dark bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-wala-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative p-8 border border-slate-100">
            <button onClick={() => setBookingStep(0)} className="absolute top-4 right-4 text-slate-400 hover:text-wala-dark font-bold text-xl">✕</button>

            {bookingStep === 1 && (
              <div>
                <h2 className="text-2xl font-black text-wala-dark mb-4">{activeEvent.title}</h2>
                <p className="text-slate-600 text-sm mb-6">{activeEvent.desc}</p>
                <div className="flex justify-between items-center border-t border-slate-100 pt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Quantity</label>
                    <select value={ticketCount} onChange={(e) => setTicketCount(Number(e.target.value))} className="border border-slate-300 rounded p-1 bg-wala-white">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-400 uppercase">Total</span>
                    <span className="text-2xl font-black text-wala-dark">₹{activeEvent.price * ticketCount}</span>
                  </div>
                </div>
                <button onClick={handleBookingConfirm} className="w-full bg-wala-primary text-wala-white mt-6 py-3 rounded-xl font-bold tracking-wide hover:bg-opacity-95 transition">
                  Confirm Ticket Booking
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">✓</div>
                <h2 className="text-2xl font-black text-wala-dark mb-1">Booking Confirmed!</h2>
                <p className="text-slate-400 text-sm mb-6">Your monochromatic entry passport is listed below.</p>
                
                <div className="bg-wala-dark text-wala-white p-6 rounded-2xl w-full max-w-sm mb-6 flex flex-col items-center">
                  <div className="text-xs tracking-widest font-bold text-wala-primary mb-4">EVENTWALA DIGITAL ENTRY PASS</div>
                  <div className="bg-wala-white p-3 rounded-xl mb-4">
                    <svg className="w-32 h-32 text-wala-dark" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm2 4h2v2h-2v-2zm-4-2h2v4h-2v-4z" />
                    </svg>
                  </div>
                  <div className="text-sm font-bold truncate w-full">{activeEvent.title}</div>
                  <div className="text-xs text-slate-400 mt-1">Passes: {ticketCount} Attendee(s)</div>
                </div>
                <button onClick={() => setBookingStep(0)} className="bg-slate-100 hover:bg-slate-200 text-wala-dark text-sm font-bold px-6 py-2.5 rounded-lg transition">Return to Dashboard</button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-wala-dark text-slate-500 py-6 text-center text-sm mt-auto border-t border-slate-800">
        © 2026 EventWala App Inc. All Rights Reserved.
      </footer>
    </div>
  );
}