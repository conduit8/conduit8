module.exports = {
  hooks: {
    readPackage(pkg) {
      // Link local @conduit8/core in development when LINK_LOCAL_CORE is set
      if (process.env.LINK_LOCAL_CORE && (pkg.name === '@conduit8/web' || pkg.name === 'conduit8')) {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies['@conduit8/core'] = 'link:/Users/az/projects/conduit8-backend/packages/core';
      }
      return pkg;
    }
  }
};
