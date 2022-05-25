/* De la doc.: 'passing the strategy name directly to the AuthGuard() introduces magic strings in the codebase' */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { } /* 'local' nombre por default de la estartegia local */

