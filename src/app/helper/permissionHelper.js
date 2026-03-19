export const hasPermission = (permissions, module, action) => {
  return permissions.some(
    (mod) =>
      mod.slug === module &&
      mod.permissions.includes(`${module}.${action}`)
  );
};