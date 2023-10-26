import { resolve } from 'path';
import { ApillonConfig } from '../lib/apillon';
import { Storage } from '../modules/storage/storage';
import { StorageContentType } from '../types/storage';
import { getBucketUUID, getConfig } from './helpers/helper';

describe('Storage tests', () => {
  let config: ApillonConfig;
  let bucketUUID: string;

  beforeAll(async () => {
    config = getConfig();
    bucketUUID = getBucketUUID();
  });

  test('List buckets', async () => {
    const { items } = await new Storage(config).listBuckets({ limit: 1 });
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach(item => expect(item.name).toBeTruthy());
  });

  test('get bucket content', async () => {
    const storage = new Storage(config);
    const { items } = await storage.bucket(bucketUUID).getObjects();
    for (const item of items) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach(item => expect(item.name).toBeTruthy());
  });

  test('get bucket files', async () => {
    const storage = new Storage(config);
    const { items } = await storage.bucket(bucketUUID).getFiles();
    for (const item of items) {
      console.log(`${item.type}: ${item.name}`);
    }
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach(item => expect(item.name).toBeTruthy());
  });

  test('get bucket files markedForDeletion=true', async () => {
    const storage = new Storage(config);
    const { items } = await storage.bucket(bucketUUID).getObjects({ markedForDeletion: true });
    expect(items.some(file => file['status'] == 8))
  });

  test('get bucket directory content', async () => {
    const storage = new Storage(config);
    const { items } = await storage
      .bucket(bucketUUID)
      .getObjects({ directoryUuid: '6c9c6ab1-801d-4915-a63e-120eed21fee0' });

    for (const item of items) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
    items.forEach(item => expect(item.name).toBeTruthy());
  });

  test('get file details', async () => {
    const storage = new Storage(config);
    const file = await storage.bucket(bucketUUID).file('cf6a0d3d-2abd-4a0d-85c1-10b8f04cd4fc').get();
    expect(file.name).toBeTruthy();
  });

  test.skip('upload files', async () => {
    const storage = new Storage(config);
    try {
      const uploadDir = resolve(__dirname, './helpers/website/');
      console.time('File upload complete');
      await storage
        .bucket(bucketUUID)
        .uploadFromFolder(uploadDir);
      console.timeEnd('File upload complete');

      // console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test.skip('delete a file', async () => {
    const storage = new Storage(config);
    await storage.bucket(bucketUUID).deleteFile('cf6a0d3d-2abd-4a0d-85c1-10b8f04cd4fc');
  });
});
