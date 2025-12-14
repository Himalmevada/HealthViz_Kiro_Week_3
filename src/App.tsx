import { Authenticator, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import { Activity } from 'lucide-react';
import Dashboard from './components/Dashboard/Dashboard';
import ErrorBoundary from './components/Common/ErrorBoundary';
import '@aws-amplify/ui-react/styles.css';

const theme: Theme = {
  name: 'healthviz-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#eff6ff' },
          20: { value: '#dbeafe' },
          40: { value: '#93c5fd' },
          60: { value: '#3b82f6' },
          80: { value: '#2563eb' },
          90: { value: '#1d4ed8' },
          100: { value: '#1e40af' },
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: { value: '0' },
          boxShadow: { value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
        },
      },
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80}' },
          _hover: {
            backgroundColor: { value: '{colors.brand.primary.90}' },
          },
        },
      },
      fieldcontrol: {
        borderRadius: { value: '8px' },
      },
      tabs: {
        item: {
          _active: {
            color: { value: '{colors.brand.primary.80}' },
            borderColor: { value: '{colors.brand.primary.80}' },
          },
        },
      },
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Email',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your password',
      label: 'Password',
      isRequired: true,
    },
  },
  signUp: {
    email: {
      placeholder: 'Enter your email',
      label: 'Email',
      isRequired: true,
      order: 1,
    },
    password: {
      placeholder: 'Create a password',
      label: 'Password',
      isRequired: true,
      order: 2,
    },
    confirm_password: {
      placeholder: 'Confirm your password',
      label: 'Confirm Password',
      isRequired: true,
      order: 3,
    },
  },
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Authenticator
          formFields={formFields}
          components={{
            Header() {
              return (
                <div className="text-center pb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Activity className="h-10 w-10 text-blue-600" />
                    <span className="text-2xl font-bold text-white">HealthViz</span>
                  </div>
                  <p className='text-white'>Health & Environment Analytics Dashboard</p>
                </div>
              );
            },
            Footer() {
              return (
                <div className="text-center pt-4">
                  <p className="text-white">
                    Made with KIRO
                  </p>
                </div>
              );
            },
          }}
        >
          <Dashboard />
        </Authenticator>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
