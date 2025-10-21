import { defineBackend } from '@aws-amplify/backend';
import { imagesStorage } from './storage/resource';
import { generateThumb } from './functions/resize/resource';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
    imagesStorage,
    generateThumb,
    auth,
    data
});

backend.imagesStorage.resources.bucket.addEventNotification(
    EventType.OBJECT_CREATED_PUT,
    new LambdaDestination(backend.generateThumb.resources.lambda),
    {
        prefix: 'originals/'
    }
)


