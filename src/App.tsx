import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaCalendarAlt, FaTachometerAlt, FaRegBuilding, FaChartLine, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

// Define Company type
interface Company {
  name: string;
  location: string;
  linkedinProfile: string;
  email: string;
  phoneNumber: string;
  comments: string;
  periodicity: string;
  lastCommunication: string;
  nextSchedule: string;
  status: string;
}

interface CompaniesProps {
  addCompany: (company: Company) => void;
  companies: Company[];
  deleteCompany: (name: string) => void;
  editCompany: (company: Company) => void;
}

//User and Admin SignIn
const SignInPage = () => {
  const [stateUser, setStateUser] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [stateAdmin, setStateAdmin] = useState({
    adminname: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();

  const handleChangeUser = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setStateUser({
      ...stateUser,
      [evt.target.name]: value,
    });
  };

  const handleChangeAdmin = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setStateAdmin({
      ...stateAdmin,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmitUser = (evt: React.FormEvent) => {
    evt.preventDefault();
    const { username, password } = stateUser;

    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("userRole", "User"); // Save user role
    alert(`User ${username} is logging in`);
    navigate("/dashboard");
    setStateUser({ username: "", password: "", rememberMe: false });
  };

  const handleOnSubmitAdmin = (evt: React.FormEvent) => {
    evt.preventDefault();
    const { adminname, password } = stateAdmin;

    if (!adminname || !password) {
      alert("Please fill in both fields.");
      return;
    }

    localStorage.setItem("adminname", adminname);
    localStorage.setItem("userRole", "Admin"); // Save admin role
    alert(`Admin ${adminname} is logging in`);
    navigate("/companies");
    setStateAdmin({ adminname: "", password: "", rememberMe: false });
  };

  return (
    <div className="sign-in-page">
      <div className="form-container">
        <div className="sign-in-form">
          <form onSubmit={handleOnSubmitUser}>
            <h1>User Sign In</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={stateUser.username}
              onChange={handleChangeUser}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={stateUser.password}
              onChange={handleChangeUser}
              required
            />
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={stateUser.rememberMe}
                  onChange={handleChangeUser}
                />
                Remember me
              </label>
            </div>
            <button type="submit">User Sign In</button>
          </form>
        </div>

        <div className="sign-in-form">
          <form onSubmit={handleOnSubmitAdmin}>
            <h1>Admin Sign In</h1>
            <input
              type="text"
              placeholder="Adminname"
              name="adminname"
              value={stateAdmin.adminname}
              onChange={handleChangeAdmin}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={stateAdmin.password}
              onChange={handleChangeAdmin}
              required
            />
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={stateAdmin.rememberMe}
                  onChange={handleChangeAdmin}
                />
                Remember me
              </label>
            </div>
            <button type="submit">Admin Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

//profile
const ProfilePage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const adminname = localStorage.getItem("adminname");

  const userType = username ? "User" : adminname ? "Admin" : "Guest";

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          localStorage.setItem("profileImage", reader.result);
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("adminname");
    localStorage.removeItem("profileImage");

    navigate("/logout"); 
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Welcome to Your Profile!</h1>
        <p>{userType} Dashboard</p>
      </div>

      <div className="profile-info">
        {userType === "Guest" ? (
          <p>Please sign in to view your profile details.</p>
        ) : (
          <>
            <div className="profile-detail">
              <h2>{userType === "User" ? "User Information" : "Admin Information"}</h2>
              <ul>
                <li><strong>Name:</strong> {username || adminname}</li>
                <li><strong>Role:</strong> {userType}</li>
                <li><strong>Last Login:</strong> {new Date().toLocaleString()}</li>
              </ul>
            </div>

            <div className="profile-actions">
              <h3>Do you wish to log out now????</h3>
              <div className="action-buttons">
                
                <button className="action-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

//navbar
const Navbar = ({ notifications }: { notifications: string[] }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prevState) => !prevState);
  };

  const handleLogout = () => {
    
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("adminname");

    console.log("Logging out...");

    navigate("/logout");
  };

  const username = localStorage.getItem("username");
  const adminname = localStorage.getItem("adminname");

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <span className="project-name">LOGIXHUB</span>  
      </div>
      <Link to="/dashboard" className="link">
        <FaTachometerAlt /> Dashboard
      </Link>
      <Link to="/calendar" className="link">
        <FaCalendarAlt /> Calendar
      </Link>
      <Link to="/analytics" className="link">
        <FaChartLine /> Analytics
      </Link>
      <div className="notification-icon" onClick={toggleNotifications}>
        <FaBell />
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
        <div className="tooltip">
          {notifications.length > 0
            ? "You have new notifications"
            : "No new notifications"}
        </div>
      </div>
      {showNotifications && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      )}
      <div className="user-menu">
        <FaUserCircle onClick={toggleUserMenu} className="user-icon" />
        {showUserMenu && (
          <div className="user-dropdown">
            <ul>
              <li>{username ? `User: ${username}` : adminname ? `Admin: ${adminname}` : "Guest"}</li>
              <li>
                <Link to="/profile">
                  <FaUserCircle /> View Profile
                </Link>
              </li>
              <li onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

// Dashboard
const Dashboard = ({ companies }: { companies: Company[] }) => {
  const upcomingMeetings = companies.filter(
    (company) => new Date(company.nextSchedule) > new Date()
  );
  const overdueMeetings = companies.filter(
    (company) => new Date(company.nextSchedule) < new Date()
  );
  const todayMeetings = companies.filter(
    (company) =>
      new Date(company.nextSchedule).toDateString() === new Date().toDateString()
  );

  return (
    <div className="container dashboard">
      <h2>Dashboard</h2>
      <div className="meetingSection">
        <h3>Today's Meetings</h3>
        <div className="meetings">
          {todayMeetings.length > 0 ? (
            todayMeetings.map((company, index) => (
              <div key={index} className="meetingCard todayMeeting">
                <h4>{company.name}</h4>
                <p>Last Communication: {company.lastCommunication}</p>
                <p>Next Schedule: {company.nextSchedule}</p>
                <p>Status: {company.status}</p>
              </div>
            ))
          ) : (
            <p>No meetings scheduled for today.</p>
          )}
        </div>
        <h3>Upcoming Meetings</h3>
        <div className="meetings">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((company, index) => (
              <div key={index} className="meetingCard">
                <h4>{company.name}</h4>
                <p>Last Communication: {company.lastCommunication}</p>
                <p>Next Schedule: {company.nextSchedule}</p>
                <p>Status: {company.status}</p>
              </div>
            ))
          ) : (
            <p>No upcoming meetings.</p>
          )}
        </div>
        <h3>Overdue Meetings</h3>
        <div className="meetings">
          {overdueMeetings.length > 0 ? (
            overdueMeetings.map((company, index) => (
              <div key={index} className="meetingCard overdueMeeting">
                <h4>{company.name}</h4>
                <p>Last Communication: {company.lastCommunication}</p>
                <p>Next Schedule: {company.nextSchedule}</p>
                <p>Status: {company.status}</p>
              </div>
            ))
          ) : (
            <p>No overdue meetings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

//companies
const Companies = ({
  addCompany,
  companies,
  deleteCompany,
  editCompany,
}: CompaniesProps) => {
  const [newCompany, setNewCompany] = useState<Company>({
    name: '',
    location: '',
    linkedinProfile: '',
    email: '',
    phoneNumber: '',
    comments: '',
    periodicity: '',
    lastCommunication: '',
    nextSchedule: '',
    status: '',
  });

  const [editing, setEditing] = useState<boolean>(false);  
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCompany((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    
    if (!newCompany.name || !newCompany.location || !newCompany.email || !newCompany.phoneNumber) {
      setError('Please fill in all required fields.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editing) {
      
      editCompany(newCompany); 
    } else {
      addCompany(newCompany); 
    }

    setNewCompany({
      name: '',
      location: '',
      linkedinProfile: '',
      email: '',
      phoneNumber: '',
      comments: '',
      periodicity: '',
      lastCommunication: '',
      nextSchedule: '',
      status: '',
    });
    setEditing(false); 
  };

  const handleEdit = (company: Company) => {
    setNewCompany(company);  
    setEditing(true);  
  };

  const handleDelete = (companyName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${companyName}?`);
    if (confirmDelete) {
      deleteCompany(companyName); 
    }
  };

  return (
    <div className="container">
      <h2>Company Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          value={newCompany.name}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          name="location"
          value={newCompany.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          type="url"
          name="linkedinProfile"
          value={newCompany.linkedinProfile}
          onChange={handleChange}
          placeholder="LinkedIn Profile URL"
          required
        />
        <input
          type="email"
          name="email"
          value={newCompany.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          value={newCompany.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <textarea
          name="comments"
          value={newCompany.comments}
          onChange={handleChange}
          placeholder="Comments"
        />
        <select
          name="periodicity"
          value={newCompany.periodicity}
          onChange={handleChange}
          required
        >
          <option value="">Select Periodicity</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Half-Year">Half-Yearly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </select>

        <label htmlFor="lastCommunication">Last Communication:</label>
        <input
          type="datetime-local"
          name="lastCommunication"
          value={newCompany.lastCommunication}
          onChange={handleChange}
          required
        />

        <label htmlFor="nextSchedule">Next Schedule:</label>
        <input
          type="datetime-local"
          name="nextSchedule"
          value={newCompany.nextSchedule}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={newCompany.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Upcoming">Upcoming</option>
        </select>

        <button type="submit" className="button">{editing ? "Update Company" : "Add Company"}</button>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="companyList">
        <h3>Companies List</h3>
        {companies.map((company, index) => (
          <div key={index} className="companyCard">
            <p><strong>Company Name:</strong> {company.name}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>LinkedIn Profile:</strong> <a href={company.linkedinProfile} target="_blank" rel="noopener noreferrer">{company.linkedinProfile}</a></p>
            <p><strong>Email:</strong> {company.email}</p>
            <p><strong>Phone Number:</strong> {company.phoneNumber}</p>
            <p><strong>Comments:</strong> {company.comments}</p>
            <p><strong>Periodicity:</strong> {company.periodicity}</p>
            <p><strong>Last Communication:</strong> {company.lastCommunication}</p>
            <p><strong>Next Schedule:</strong> {company.nextSchedule}</p>
            <p><strong>Status:</strong> {company.status}</p>
            <div className="company-actions">
              <button onClick={() => handleEdit(company)}>Edit</button>
              <button onClick={() => handleDelete(company.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Calendar
const CalendarPage = ({ addAgenda }: { addAgenda: (agenda: any) => void }) => {
  const localizer = momentLocalizer(moment);

  const getSavedEvents = () => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  };

  const [events, setEvents] = useState<any[]>(getSavedEvents);

  const [agenda, setAgenda] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleAgendaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgenda((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAgendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      title: agenda.title || 'Company Management and Communication',
      start: new Date(agenda.startDate),
      end: new Date(agenda.endDate),
      description: agenda.description || 'Scheduled management and communication meeting.',
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

    setAgenda({ title: '', startDate: '', endDate: '', description: '' });

    addAgenda(newEvent);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setAgenda({
      ...agenda,
      startDate: start.toISOString().slice(0, 16), 
      endDate: end.toISOString().slice(0, 16), 
    });
  };

  useEffect(() => {
    
    if (events.length > 0) {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
  }, [events]);

  return (
    <div className="container">
      <h2>Calendar</h2>

      <Calendar
        localizer={localizer}
        events={events} 
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot} 
      />

      <form onSubmit={handleAgendaSubmit} className="agenda-form">
        <input
          type="text"
          name="title"
          value={agenda.title}
          onChange={handleAgendaChange}
          placeholder="Agenda Title"
          required
        />
        <input
          type="datetime-local"
          name="startDate"
          value={agenda.startDate}
          onChange={handleAgendaChange}
          required
        />
        <input
          type="datetime-local"
          name="endDate"
          value={agenda.endDate}
          onChange={handleAgendaChange}
          required
        />
        <textarea
          name="description"
          value={agenda.description}
          onChange={handleAgendaChange}
          placeholder="Agenda Description"
          required
        />
        <button type="submit" className="button">Add Agenda</button>
      </form>
    </div>
  );
};

// Analytics 
const Analytics = ({ companies }: { companies: Company[] }) => {
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(company => company.status === 'Active').length;
  const inactiveCompanies = companies.filter(company => company.status === 'Inactive').length;
  const upcomingCompanies = companies.filter(company => company.status === 'Upcoming').length;

  const data = {
    labels: ['Active', 'Inactive', 'Upcoming'],
    datasets: [
      {
        data: [activeCompanies, inactiveCompanies, upcomingCompanies],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
        hoverBackgroundColor: ['#388e3c', '#d32f2f', '#f57c00'],
      },
    ],
  };

  return (
    <div className="container">
      <h2>Analytics</h2>
      <div className="analytics">
        <div className="pieChartCard">
          <h3>Company Status Distribution</h3>
          <Pie data={data} />
        </div>
        <div className="analytics-card">
          <h3>Total Companies</h3>
          <p>{totalCompanies}</p>
        </div>
        <div className="analytics-card">
          <h3>Active Companies</h3>
          <p>{activeCompanies}</p>
        </div>
        <div className="analytics-card">
          <h3>Inactive Companies</h3>
          <p>{inactiveCompanies}</p>
        </div>
        <div className="analytics-card">
          <h3>Upcoming Companies</h3>
          <p>{upcomingCompanies}</p>
        </div>
      </div>
    </div>
  );
};

//logout
const LogoutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="logout-page">
      <h1>You have successfully logged out!</h1>
      <p>To sign in, click the button below.</p>
      <button onClick={() => navigate("/signin")}>Click here to sign in</button>
    </div>
  );
};

// Main App component
interface Company {
  name: string;
  nextSchedule: string; 
  [key: string]: any; 
}

const App = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const projectName = "LOGIXHUB"; 

  const fetchCompanies = async () => {
    try {
      const response = await fetch('https://api.example.com/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data: Company[] = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const addCompany = (company: Company) => setCompanies([...companies, company]);
  const deleteCompany = (name: string) => setCompanies(companies.filter(company => company.name !== name));
  const editCompany = (updatedCompany: Company) => {
    setCompanies(
      companies.map(company =>
        company.name === updatedCompany.name ? updatedCompany : company
      )
    );
  };

  const addAgenda = (agenda: any) => {
   
  };

  
  useEffect(() => {
    const todayMeetings = companies.filter(
      company => new Date(company.nextSchedule).toDateString() === new Date().toDateString()
    );
    const upcomingMeetings = companies.filter(
      company => new Date(company.nextSchedule) > new Date()
    );
    const overdueMeetings = companies.filter(
      company => new Date(company.nextSchedule) < new Date()
    );

    const notificationsList: string[] = [];
    if (todayMeetings.length) notificationsList.push('You have a meeting today.');
    if (upcomingMeetings.length) notificationsList.push('There is an upcoming meeting on your schedule.');
    if (overdueMeetings.length) notificationsList.push('The meeting is overdue.');
    setNotifications(notificationsList);
  }, [companies]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />  
        <Route path="/dashboard" element={<><Navbar notifications={notifications} /><Dashboard companies={companies} /></>} />  
        <Route path="/companies" element={<><Navbar notifications={notifications} /><Companies addCompany={addCompany} companies={companies} deleteCompany={deleteCompany} editCompany={editCompany} /></>} />  
        <Route path="/calendar" element={<><Navbar notifications={notifications} /><CalendarPage addAgenda={addAgenda} /></>} />  
        <Route path="/analytics" element={<><Navbar notifications={notifications} /><Analytics companies={companies} /></>} />  
        <Route path="/profile" element={<><Navbar notifications={notifications} /><ProfilePage /></>} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
};

export default App;