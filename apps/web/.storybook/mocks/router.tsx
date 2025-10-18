import React from 'react';

// Mock Link component that just renders an anchor tag
export const Link = ({ children, to, ...props }: any) => (
  <a href={to} onClick={(e) => e.preventDefault()} {...props}>
    {children}
  </a>
);

// Mock router hooks
export const useNavigate = () => () => {};
export const useParams = () => ({});
export const useRouter = () => ({});
export const useRouterState = () => ({
  location: {
    pathname: '/',
    search: '',
    hash: '',
  },
  matches: [],
});

// Mock other router exports that might be used
export const createFileRoute = () => ({});
export const createRoute = () => ({});
export const createRootRoute = () => ({});
export const RouterProvider = ({ children }: any) => children;
export const RouterContextProvider = ({ children }: any) => children;
export const createRouter = () => ({});
export const createMemoryHistory = () => ({});
