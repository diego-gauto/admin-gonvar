import {
  Injectable,
  ServiceUnavailableException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export abstract class BaseService {
  protected handleServiceError(error: any): never {
    if (
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }

    let exception: Error;
    let logMessage: string;

    if (error.name === 'QueryFailedError') {
      exception = new ServiceUnavailableException('Database connection failed');
      logMessage = 'Database connection failed';
    } else {
      exception = new InternalServerErrorException(
        'An unexpected error occurred',
      );
      logMessage = 'An unexpected error occurred';
    }

    console.error(logMessage, error);
    throw exception;
  }
}
