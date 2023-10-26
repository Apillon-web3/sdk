import { IWebsiteFilters } from '../../docs-index';
import { ApillonModule } from '../../lib/apillon';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonListResponse } from '../../types/apillon';
import { HostingWebsite } from './hosting-website';

export class Hosting extends ApillonModule {
  /**
   * @dev Base API url for hosting.
   */
  private API_PREFIX = '/hosting/websites';

  /**
   * @dev Returns a list of websites.
   * @param {IWebsiteFilters} params Query filters for listing websites
   * @returns A list of HostingWebsite instances.
   */
  public async listWebsites(
    params?: IWebsiteFilters,
  ): Promise<IApillonList<HostingWebsite>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const { data } = await this.api.get<IApillonListResponse<HostingWebsite>>(
      url,
    );

    return {
      items: data.data.items.map(
        (website) =>
          new HostingWebsite(
            this.api,
            this.logger,
            website['websiteUuid'],
            website,
          ),
      ),
      total: data.data.total,
    };
  }

  /**
   * @dev Returns an website instance.
   * @param uuid Unique website identifier.
   * @returns An instance of HostingWebsite.
   */
  public website(uuid: string): HostingWebsite {
    return new HostingWebsite(this.api, this.logger, uuid);
  }
}
