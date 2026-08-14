import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PrivateRoute from '../PrivateRoute';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      username: 'testuser',
    },
    loading: false,
  }),
}));

describe('PrivateRoute', () => {
  it('renders children when user is authenticated', () => {
    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
