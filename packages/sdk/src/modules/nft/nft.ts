import { ApillonModule } from '../../lib/apillon';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonResponse, IApillonList } from '../../types/apillon';
import {
  ICollectionFilters,
  ICollection,
  ICreateCollection,
} from '../../types/nfts';
import { NftCollection } from './nft-collection';

export class Nft extends ApillonModule {
  /**
   * @dev API url for collections.
   */
  private API_PREFIX = '/nfts/collections';

  /**
   * @dev Returns a collection instance.
   * @param uuid Unique collection identifier.
   * @returns An instance of NFT Collection
   */
  public collection(uuid: string): NftCollection {
    return new NftCollection(this.api, this.logger, uuid, null);
  }

  /**
   * Lists all nft collections available.
   * @param params Filter for listing collections.
   * @returns Array of NftCollection.
   */
  public async list(params?: ICollectionFilters): Promise<NftCollection[]> {
    const items: NftCollection[] = [];
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const resp = await this.api.get<
      IApillonResponse<IApillonList<ICollection>>
    >(url);

    if (resp.data?.data && resp.data?.data.items) {
      for (const item of resp.data?.data.items) {
        items.push(
          new NftCollection(this.api, this.logger, item.collectionUuid, item),
        );
      }
    }

    return items;
  }

  /**
   * Deploys a new NftCollection smart contract.
   * @param data NFT collection data.
   * @returns A NftCollection instance.
   */
  public async create(data: ICreateCollection) {
    const resp = await this.api.post<IApillonResponse<ICollection>>(
      this.API_PREFIX,
      data,
    );

    return new NftCollection(
      this.api,
      this.logger,
      resp.data?.data.collectionUuid,
      resp.data?.data,
    );
  }
}
