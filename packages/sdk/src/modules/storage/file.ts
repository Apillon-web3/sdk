import { AxiosInstance } from 'axios';
import { FileStatus, StorageContentType } from '../../types/storage';

export class File {
  /**
   * Axios instance set to correct rootUrl with correct error handling.
   */
  protected api: AxiosInstance;

  /**
   * @dev API url prefix for this class.
   */
  private API_PREFIX: string = null;

  /**
   * @dev Unique identifier of the bucket.
   */
  public bucketUuid: string;

  /**
   * @dev Unique identifier of the file.
   */
  public id: string;

  /**
   * File name.
   */
  public name: string = null;

  /**
   * File unique ipfs identifier.
   */
  public CID: string = null;

  /**
   * File status.
   */
  public status: FileStatus = null;

  /**
   * Id of the directory in which the file resides.
   */
  public parentDirectoryId: string = null;

  /**
   * Type of content.
   */
  public type = StorageContentType.FILE;

  /**
   * @dev Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the bucket.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   */
  constructor(
    api: AxiosInstance,
    bucketUuid: string,
    fileId: string,
    data: any,
  ) {
    this.api = api;
    this.bucketUuid = bucketUuid;
    this.id = fileId;
    this.API_PREFIX = `/storage/${bucketUuid}/file/${fileId}`;
    this.populate(data);
  }

  /**
   * Populates class properties via data object.
   * @param data Data object.
   */
  private populate(data: any) {
    if (data != null) {
      Object.keys(data || {}).forEach((key) => {
        const prop = this[key];
        if (prop === null) {
          this[key] = data[key];
        }
      });
    }
  }

  /**
   * @dev Gets file details.
   */
  async get() {
    const resp = await this.api.get(`${this.API_PREFIX}/detail`);
    this.status = resp.data?.data?.fileStatus;
    this.populate(resp.data?.data?.file);
    return this;
  }
}
