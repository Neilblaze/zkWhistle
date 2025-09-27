import { type Logger } from 'pino';
import { type Config } from './config';
export declare const run: (config: Config, _logger: Logger) => Promise<void>;
