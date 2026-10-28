// The security screens call controllers that may not be published yet (see TODO.md · Seguridad):
// a 404 on the list says which route is missing instead of a bare status.
export function describeLoadError(error, route) {
  if (error?.status === 404) return `El servidor todavía no ofrece ${route}. Falta publicar ese controller en el back.`;
  return error?.message;
}
