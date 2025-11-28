import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import './App.css';

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <Editor />
    </div>
  );
}

export default App;
