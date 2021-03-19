import {PageData} from './PageData';
import {UserData} from './userData';
import {InventoryData} from './InventoryData';

export interface SuccessMsgData {
  status: string;
  message: string;
  timeStamp: string;
  page: PageData;
  data: InventoryData[] | UserData;
}
