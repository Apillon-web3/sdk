import {
  constructUrlWithQueryParams,
  listFilesRecursive,
  uploadFilesToS3,
} from '../../lib/common';
import { DeployToEnvironment, IDeploymentFilters } from '../../types/hosting';
import {
  IApillonList,
  IApillonListResponse,
  IApillonResponse,
  LogLevel,
} from '../../types/apillon';
import { Deployment } from './deployment';
import { ApillonModel } from '../../docs-index';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonLogger } from '../../lib/apillon-logger';

export class HostingWebsite extends ApillonModel {
  /**
   * @dev User assigned name of the website.
   */
  public name: string = null;

  /**
   * @dev User assigned description of the website.
   */
  public description: string = null;

  /**
   * @dev Domain on which this website lives.
   */
  public domain: string = null;

  /**
   * @dev Unique identifier of a storage bucket in which this website files reside.
   */
  public bucketUuid: string = null;

  /**
   * @dev IPNS CID for staging environment.
   */
  public ipnsStaging: string = null;

  /**
   * @dev IPNS CID for production environment.
   */
  public ipnsProduction: string = null;

  /**
   * @dev Constructor which should only be called via Hosting class.
   * @param uuid Unique identifier of the website.
   * @param data Data to populate the website with.
   */
  constructor(uuid: string, data?: Partial<HostingWebsite>) {
    super(uuid);
    this.API_PREFIX = `/hosting/websites/${uuid}`;
    this.populate(data);
  }

  /**
   * @dev Gets information about the website and fills properties with it.
   * @returns An instance of HostingWebsite class with filled properties.
   */
  public async get(): Promise<HostingWebsite> {
    const { data } = (
      await ApillonApi.get<IApillonResponse<HostingWebsite>>(this.API_PREFIX)
    ).data;
    return this.populate(data);
  }

  /**
   * @dev Uploads website files inside a folder via path.
   * @param folderPath Path to the folder to upload.
   */
  public async uploadFromFolder(folderPath: string): Promise<void> {
    ApillonLogger.log(
      `Preparing to upload files from ${folderPath} to website ${this.uuid} ...`,
      LogLevel.VERBOSE,
    );

    let files;
    try {
      files = listFilesRecursive(folderPath);
    } catch (err) {
      ApillonLogger.log(err, LogLevel.ERROR);
      throw new Error(`Error reading files in ${folderPath}`);
    }

    const data = { files };
    ApillonLogger.log(
      `Files to upload: ${data.files.length}`,
      LogLevel.VERBOSE,
    );

    ApillonLogger.logWithTime('Get upload links', LogLevel.VERBOSE);
    const { data: session } = await ApillonApi.post<any>(
      `${this.API_PREFIX}/upload`,
      data,
    );

    ApillonLogger.logWithTime('Got upload links', LogLevel.VERBOSE);

    // console.log(resp);
    const sessionUuid = session.data.sessionUuid;

    ApillonLogger.logWithTime('File upload complete', LogLevel.VERBOSE);
    await uploadFilesToS3(session.data.files, files);
    ApillonLogger.logWithTime('File upload complete', LogLevel.VERBOSE);

    ApillonLogger.log('Closing session...', LogLevel.VERBOSE);
    const { data: endSession } = await ApillonApi.post<any>(
      `${this.API_PREFIX}/upload/${sessionUuid}/end`,
    );
    ApillonLogger.log('Session ended.', LogLevel.VERBOSE);

    if (!endSession.data) {
      throw new Error('Upload session did not end');
    }
  }

  /**
   * @dev Deploy a website to a new environment.
   * @param {DeployToEnvironment} toEnvironment The environment to deploy to
   * @returns The new deployment instance
   */
  public async deploy(toEnvironment: DeployToEnvironment): Promise<any> {
    ApillonLogger.log(
      `Deploying website ${this.uuid} to IPFS (${
        toEnvironment === DeployToEnvironment.TO_STAGING
          ? 'preview'
          : 'production'
      })`,
      LogLevel.VERBOSE,
    );

    ApillonLogger.logWithTime('Deploy start', LogLevel.VERBOSE);
    const { data } = await ApillonApi.post<any>(`${this.API_PREFIX}/deploy`, {
      environment: toEnvironment,
    });

    ApillonLogger.logWithTime('Deploy complete', LogLevel.VERBOSE);

    return data.data;
  }

  /**
   * @dev Returns an list of websites.
   * @param {IWebsiteFilters} params Query filters for listing websites
   * @returns A list of all deployments instances.
   */
  public async listDeployments(
    params?: IDeploymentFilters,
  ): Promise<IApillonList<any>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/deployments`,
      params,
    );

    const { data } = await ApillonApi.get<
      IApillonListResponse<Deployment & { deploymentUuid: string }>
    >(url);

    return {
      items: data.data.items.map(
        (item) => new Deployment(item.websiteUuid, item.deploymentUuid, item),
      ),
      total: data.data.total,
    };
  }

  /**
   * Gets a deployment instance.
   * @param deploymentUuid Uuid of the deployment.
   * @returns Instance of a deployment.
   */
  deployment(deploymentUuid: string): Deployment {
    return new Deployment(this.uuid, deploymentUuid, {});
  }
}
