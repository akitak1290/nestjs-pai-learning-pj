import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { baseEndpointPath } from 'src/types/constants';

const SwaggerConfig = new DocumentBuilder()
  .setTitle('Student Admin System')
  .setDescription(
    'A system to let teachers perform administrative functions for their students',
  )
  .addServer(`/${baseEndpointPath}`)
  .setVersion('1.0.0')
  .build();
export default SwaggerConfig;
