import { createFileRoute, Outlet } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

// TODO: what does this mean here? this means that it will parse redirect on ANY public routes?
// Not sure if this belongs here - do we want a person to land on /support?=redirect and redirect to login or not?
const searchSchema = z.object({
  redirect: z.string().optional(),
});

function PublicRouteComponent() {
  return (
    <Outlet />
  );
}

export const Route = createFileRoute('/_public')({
  validateSearch: zodValidator(searchSchema),
  component: PublicRouteComponent,
});
