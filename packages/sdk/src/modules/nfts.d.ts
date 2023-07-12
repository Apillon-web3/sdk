interface ApillonList<I> {
  items: I[];
  total: number;
}

interface ApillonResponse<D> {
  id: string;
  status: number;
  data: D;
}

interface ApillonStatus {
  status: number;
}

//OUTPUTS
interface Collection {
  projectUuid: string;
  collectionUuid: string;
  chain: number;
  name: string;
  symbol: string;
  description: string;
  baseUri: string;
  baseExtension: string;
  maxSupply: number;
  isRevokable: boolean;
  isSoulbound: boolean;
  royaltiesAddress: string;
  royaltiesFees: number;
  drop: boolean;
  dropStart: number;
  dropPrice: number;
  dropReserve: number;
}

interface Transaction {
  id: number;
  status: number;
  chainId: number;
  transactionType: number;
  transactionStatus: number;
  transactionHash: string;
  updatedTime: string;
}