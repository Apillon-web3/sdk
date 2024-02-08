import { IApillonPagination } from './apillon';

export enum StorageContentType {
  DIRECTORY = 1,
  FILE = 2,
}

export enum FileStatus {
  UPLOAD_REQUEST_GENERATED = 1,
  UPLOADED = 2,
  AVAILABLE_ON_IPFS = 3,
  AVAILABLE_ON_IPFS_AND_REPLICATED = 4,
}

export interface IStorageBucketContentRequest extends IApillonPagination {
  directoryUuid?: string;
  markedForDeletion?: boolean;
}

export interface IBucketFilesRequest extends IApillonPagination {
  fileStatus?: FileStatus;
  /**
   * Search files by upload session UUID
   */
  sessionUuid?: string;
}

export interface FileMetadata {
  fileName: string;
  content: Buffer;
  /**
   * File [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)
   */
  contentType?: string;
  /**
   * Virtual file path. Empty for root. Must not contain fileName.
   *
   * The path field can be used to place file in virtual directories inside a bucket. If directories do not yet exist, they will be automatically generated.
   *
   * For example, an images/icons path creates images directory in a bucket and icons directory inside it. File will then be created in the icons directory.
   */
  path?: string;
  /**
   * The file's UUID, obtained after uploadig
   */
  fileUuid?: string;
  /**
   * The file's CID on IPFS
   */
  CID?: string;
}

export type FileUploadResult = Omit<FileMetadata, 'content'>;

export interface IFileUploadRequest {
  /**
   * Wrap uploaded files to IPFS directory.
   *
   * Files in session can be wrapped to CID on IPFS via wrapWithDirectory parameter. This means that the directory gets its own CID and its content cannot be modified afterwards.
   *
   * @docs [IPFS docs](https://dweb-primer.ipfs.io/files-on-ipfs/wrap-directories-around-content#explanation)
   */
  wrapWithDirectory?: boolean;
  /**
   * Path to wrapped directory inside bucket.
   *
   * Mandatory when `wrapWithDirectory` is true.
   *
   * @example `main-dir` --> Files get uploaded to a folder named `main-dir` in the bucket.
   *
   * @example `main-dir/sub-dir` --> Files get uploaded to a subfolder in the location `/main-dir/sub-dir`.
   */
  directoryPath?: string;

  /**
   * If set to true, the upload action will wait until files receive a CID from IPFS before returning a result
   */
  awaitCid?: boolean;
}

export interface IFileUploadResponse {
  files: FileMetadata[];
  sessionUuid: string;
}

export interface IPNSListRequest extends IApillonPagination {
  /**
   * IPNS name, that is used to access ipns content on ipfs gateway
   */
  ipnsName?: string;
  /**
   * IPFS value (CID), to which this ipns points
   */
  ipnsValue?: string;
}

export interface ICreateIpns {
  name: string;
  description?: string;
  /**
   * CID to which this IPNS name will point.
   * If this property is specified, API executes ipns publish which sets ipnsName and ipnsValue properties
   */
  cid?: string;
}
