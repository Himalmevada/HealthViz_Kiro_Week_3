import { Activity } from 'lucide-react';
import Dashboard from './components/Dashboard/Dashboard';
import ErrorBoundary from './components/Common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900">
        <Dashboard />
      </div>
    </ErrorBoundary>
  );
}

export default App;
