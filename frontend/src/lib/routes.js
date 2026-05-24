// Returns true if the app is currently running on the admin subdomain
export const isAdminDomain = () => {
  return window.location.hostname.startsWith('admin');
};

// Formats paths so that '/sbdevstudio/login' becomes '/admin/sbdevstudio/login' on the main site,
// but remains '/sbdevstudio/login' on the admin subdomain.
export const getAdminRoute = (path) => {
  if (isAdminDomain()) {
    // Return the path as-is (e.g., '/foodies/login')
    return path;
  }
  // Append '/admin' prefix for the main site (e.g., '/admin/foodies/login')
  return `/admin${path}`;
};
