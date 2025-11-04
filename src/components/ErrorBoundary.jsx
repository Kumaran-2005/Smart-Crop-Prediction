import React from 'react';

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, message: '' };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, message: error?.message || 'Unexpected error' };
	}

	componentDidCatch(error, info) {
		// Log for diagnostics
		// You can forward this to an external logging service if desired
		// eslint-disable-next-line no-console
		console.error('Unhandled error in app:', error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: 24 }}>
					<h1 style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</h1>
					<p style={{ color: '#b91c1c' }}>{this.state.message}</p>
				</div>
			);
		}
		return this.props.children;
	}
}
