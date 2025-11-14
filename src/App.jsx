import AppLayout from "./layout/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Tasks from "./pages/Tasks.jsx";
import Profile from "./pages/Profile.jsx";
import { useNavigation } from "./contexts/navigation_context/useNavigation.js";

export default function App() {
  const { activePage } = useNavigation();

  let page = <Dashboard />;
  if (activePage === "projects") page = <Projects />;
  if (activePage === "tasks") page = <Tasks />;
  if (activePage === "profile") page = <Profile />;

  return <AppLayout>{page}</AppLayout>;
}
