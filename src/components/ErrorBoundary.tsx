import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-parchment-50 flex items-center justify-center px-6">
          <div className="text-center space-y-4 max-w-sm">
            <h2 className="font-serif text-2xl text-olive-800">Something went wrong</h2>
            <p className="font-sans text-sm text-olive-500">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-olive-700 text-white rounded-xl font-sans text-sm hover:bg-olive-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
