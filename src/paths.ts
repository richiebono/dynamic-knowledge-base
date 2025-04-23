// Register module aliases for runtime path resolution
import moduleAlias from 'module-alias';
import path from 'path';

// Set up the base directory for path resolution
const baseDir = path.resolve(__dirname);

// Register aliases that match the ones in tsconfig.json
moduleAlias.addAliases({
  '@resource': path.join(baseDir, 'modules/resource'),
  '@topic': path.join(baseDir, 'modules/topic'),
  '@user': path.join(baseDir, 'modules/user'),
  '@shared': path.join(baseDir, 'shared'),
});