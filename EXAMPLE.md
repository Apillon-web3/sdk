## Hosting

Hosting module encapsulates functionalities for Hosting service available on Apillon dashboard.

::: tip
You can only create a new webpage through the [dashboard hosting service](https://app.apillon.io/dashboard/service/hosting).
:::

The flow of deploying a new website looks like this:

1. upload new website files
2. trigger deploy to staging
3. trigger deploy from staging to production

You can also directly deploy uploaded files to production.

### Usage example

```ts
import { Hosting } from "@apillon/sdk";

const hosting = new Hosting({ apillonConfig });
await hosting.listWebsites({ orderBy: 'createdTime' });
const webpage1 = hosting.website('uuid');
await webpage1.get();

// Upload files from local folder
await webpage1.uploadFromFolder('./my-foler/files/');
// Or alternatively, send file buffers as upload parameters
await webpage1.uploadFiles(
    [
      {
        fileName: 'index.html',
        contentType: 'text/html',
        path: null,
        content: htmlBuffer,
      },
    ],
    // Upload the files in a new subdirectory in the bucket instead of in the root of the bucket
    { wrapWithDirectory: true, directoryPath: 'main/subdir' },
);

await webpage1.deploy(DeployToEnvironment.TO_STAGING);
await webpage1.listDeployments();
const deployment = await webpage1.deployment(deployment_uuid).get();
if (deployment.deploymentStatus === DeploymentStatus.SUCCESSFUL) {
  // done
}
```

### Detailed Hosting docs

Detailed hosting SDK method, class and property documentation is available [here](https://sdk-docs.apillon.io/classes/Hosting.html).

## Storage

Storage module encapsulates functionalities for Storage service available on Apillon dashboard.

### Usage example

```ts
import { Storage } from "@apillon/sdk";
import * as fs from 'fs';

const storage = new Storage({ apillonConfig });
await storage.listBuckets({ limit: 5 });
const bucket = storage.bucket('uuid');

// Upload files from local folder
await bucket.uploadFromFolder('./my-foler/files/');
// Or alternatively, send file buffers as upload parameters
await bucket.uploadFiles(
    [
      {
        fileName: 'index.html',
        contentType: 'text/html',
        path: null,
        content: htmlBuffer,
      },
    ],
    // Upload the files in a new subdirectory in the bucket instead of in the root of the bucket
    { wrapWithDirectory: true, directoryPath: 'main/subdir' },
);
await bucket.listObjects({
  directoryUuid,
  markedForDeletion: false,
  limit: 5,
});
await bucket.listFiles({ fileStatus: FileStatus.UPLOADED });
const file = await bucket.file(file_uuid).get();
await bucket.deleteFile(file_uuid);
```

### Detailed Storage docs

Detailed Storage SDK method, class and property documentation is available [here](https://sdk-docs.apillon.io/classes/Storage.html).

## NFTs

NFT module encapsulates functionalities for NFT service available on Apillon dashboard.

### Usage example

```ts
import { Nft } from "@apillon/sdk";

const nft = new Nft({ apillonConfig });
  await nft.create({
    collectionType: CollectionType.GENERIC,
    chain: EvmChain.MOONBEAM,
    name: 'SpaceExplorers',
    symbol: 'SE',
    description: 'A collection of unique space exploration NFTs.',
    baseUri: 'https://moonbeamnfts.com/collections/spaceexplorers/',
    baseExtension: 'json',
    maxSupply: 1000,
    isRevokable: false,
    isSoulbound: false,
    royaltiesAddress: '0x1234567890abcdef',
    royaltiesFees: 5,
    drop: true,
    dropStart: 1679875200,
    dropPrice: 0.05,
    dropReserve: 100,
  });
  await nft.listCollections({ search: 'My NFT' });
  const collection = await nft.collection('uuid').get();
  await collection.mint(receiver, quantity);
  await collection.nestMint(collection.uuid, 1, quantity);
  await collection.burn(quantity);
  await collection.listTransactions();
  await collection.transferOwnership(to_address);
```

### Detailed NFT docs

Detailed NFT SDK method, class and property documentation is available [here](https://sdk-docs.apillon.io/classes/Nft.html).