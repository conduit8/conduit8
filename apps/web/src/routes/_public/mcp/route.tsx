import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/mcp')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
