import { ApillonConfig } from '../lib/apillon';
import { Nft } from '../modules/nft/nft';
import { getConfig } from './helpers/helper';

describe('Nft tests', () => {
  let config: ApillonConfig;

  beforeAll(async () => {
    config = getConfig();
  });

  test('get nft collection details', async () => {
    const nft = new Nft(config);
    try {
      const collection = await nft
        .collection('2ad03895-fd5d-40e7-af17-1d6daecf3b5a')
        .get();
      console.log(collection);
    } catch (e) {
      console.log(e);
    }
  });
});
