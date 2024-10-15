import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonPagination } from '../../types/apillon';
import { ICreateCloudFunction } from '../../types/cloud-functions';
import { CloudFunction } from './cloud-function';

export class CloudFunctions extends ApillonModule {
  /**
   * API url for cloud functions.
   */
  private API_PREFIX = '/cloud-functions';

  /**
   * Lists all cloud functions.
   * @param {IApillonPagination} filter Filter for listing cloud functions.
   * @returns Array of CloudFunction objects.
   */
  public async listCloudFunctions(
    filter: IApillonPagination,
  ): Promise<IApillonList<CloudFunction>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, filter);

    const data = await ApillonApi.get<
      IApillonList<CloudFunction & { functionUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map(
        (cloudFunction) =>
          new CloudFunction(cloudFunction.functionUuid, cloudFunction),
      ),
    };
  }

  /**
   * Creates a new cloud function based on the provided data.
   * @param {ICreateCloudFunction} data Data for creating the cloud function.
   * @returns {CloudFunction} Newly created cloud function.
   */
  public async createCloudFunction(
    data: ICreateCloudFunction,
  ): Promise<CloudFunction> {
    const cloudFunction = await ApillonApi.post<
      CloudFunction & { functionUuid: string }
    >(this.API_PREFIX, data);
    return new CloudFunction(cloudFunction.functionUuid, cloudFunction);
  }

  /**
   * Gets a specific cloud function.
   * @param {string} uuid Unique identifier of the cloud function.
   * @returns {CloudFunction} An empty instance of CloudFunction.
   */
  public async cloudFunction(uuid: string): Promise<CloudFunction> {
    return new CloudFunction(uuid);
  }
}
