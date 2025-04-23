import moduleAlias from 'module-alias';
import path from 'path';

const baseDir = path.resolve(__dirname);

moduleAlias.addAliases({
  '@resource': path.join(baseDir, 'modules/resource'),
  '@topic': path.join(baseDir, 'modules/topic'),
  '@user': path.join(baseDir, 'modules/user'),
  '@shared': path.join(baseDir, 'shared'),
});