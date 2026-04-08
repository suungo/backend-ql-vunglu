export const Public = () => {
  const { SetMetadata } = require('@nestjs/common');
  return SetMetadata('isPublic', true);
};
