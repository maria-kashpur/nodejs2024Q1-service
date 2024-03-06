import { INestApplication } from "@nestjs/common";
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import { dirname, join } from 'path';
import { parse } from 'yaml';

const getSwagerConfig = async (app: INestApplication<any>) =>  {
  const rootDir = dirname(__dirname);
  const yamlPath = join(rootDir, '..', '..', 'doc', 'api.yaml');
  const yamlDocument: OpenAPIObject = parse(fs.readFileSync(yamlPath, 'utf8'));

  return SwaggerModule.setup('doc', app, yamlDocument);
}

export default getSwagerConfig;