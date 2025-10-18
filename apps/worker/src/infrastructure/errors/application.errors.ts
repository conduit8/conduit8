// Domain Errors == Business Rules Errors
import { BaseError } from './base.errors';

// Application Errors == Workflow Issues
abstract class ApplicationError extends BaseError {
}
