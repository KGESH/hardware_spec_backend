import { tags } from 'typia';

export type IDatasetEmbeddings = {
  vendor: string;
  urls: (string & tags.Format<'url'>)[];
  shopId: string & tags.Format<'uuid'>;
};
