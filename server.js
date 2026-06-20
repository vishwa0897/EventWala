import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS so your React app (running on port 5173) can communicate with the backend
app.use(cors());
app.use(express.json());

// In-memory data store mimicking a database database
let MOCK_EVENTS = [
  { id: 1, title: "Infinite Rhythms Concert", category: "Concerts", price: 799, date: "2026-07-15", location: "Mumbai", seatsLeft: 4, desc: "An evening of electrifying live music and indie rock performances." },
  { id: 2, title: "Full-Stack Web Dev Workshop", category: "Workshops", price: 1499, date: "2026-08-02", location: "Bangalore", seatsLeft: 2, desc: "Master React and Node.js in this intensive hands-on building accelerator." },
  { id: 3, title: "National Corporate Cricket Cup", category: "Sports", price: 299, date: "2026-07-20", location: "Delhi", seatsLeft: 45, desc: "Watch top corporate squads battle it out on the pitch." },
  { id: 4, title: "X機械 National Tech Fest", category: "College Fests", price: 0, date: "2026-09-10", location: "Pune", seatsLeft: 120, desc: "The ultimate convergence of innovative college tech exhibits and hackathons." },
  { id: 5, title: "Global AI & Dev Conference", category: "Conferences", price: 2499, date: "2026-07-11", location: "Hyderabad", seatsLeft: 5, desc: "A deep dive into the next decade of AI applications and neural networks." },
];

// GET API: Fetch all available events
app.get('/api/events', (req, res) => {
  res.json(MOCK_EVENTS);
});

// POST API: Handle ticket booking and decrement seats dynamically
app.post('/api/book', (req, res) => {
  const { eventId, count } = req.body;
  
  const eventIndex = MOCK_EVENTS.findIndex(e => e.id === Number(eventId));
  
  if (eventIndex === -1) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  if (MOCK_EVENTS[eventIndex].seatsLeft < count) {
    return res.status(400).json({ success: false, message: "Not enough tickets available!" });
  }

  // Deduct available seats
  MOCK_EVENTS[eventIndex].seatsLeft -= count;

  res.json({ 
    success: true, 
    message: "Booking recorded successfully!",
    updatedEvent: MOCK_EVENTS[eventIndex]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EventWala Backend running on http://localhost:${PORT}`);
});