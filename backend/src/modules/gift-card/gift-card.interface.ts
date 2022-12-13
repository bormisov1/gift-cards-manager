export interface IGiftCard {
  id: string;
  creatorUsername: string;
  // not sure which fields should be in core logic
  description: object;
  sum: number;
  spent: number;
  creationDate: Date;
  expirationDate?: Date;
  active: boolean;
  activationDate?: Date;
}

export interface IGiftCardInfo {
  id: string;
  creatorUsername: string;
  receiverFullName: string;
  sum: number;
  spent?: number;
  active: boolean
}

export interface IActivateGiftCard {
  expirationDate?: Date;
  activationDate?: Date;
  spent?: number;
  active: boolean;
  sum?: number;
}

export interface IEmptyGiftCard {
  id: string;
  creatorUsername: string;
  activationDate?: Date;
  creationDate: Date;
  expirationDate?: Date;
  spent?: number;
  active: boolean;
  description: object;
  sum: number;
}

export interface IQuery {
  id?: string;
  active?: boolean;
}

export interface ICreateDto {
  description: object;
  sum: number;
  spent?: number;
  //spent: 0;
}

export interface IUpdateDto {
  id: string;
  spent: number;
  description?: object;
}

export interface IActivateDto {
  id: string;
  spent?: number;
  sum?: number;
  active: boolean;
}

export interface IGiftCardStorage {
  create(
    username: string,
    dto: ICreateDto | Record<string, never>,
  ): Promise<IEmptyGiftCard>;
  read(id: string): Promise<IGiftCard>;
  getList(query?: IQuery): Promise<IGiftCardInfo[]>
  update(giftCard: IUpdateDto): void;
}

//export interface IPhone {
//
//}

export interface IDescription {
  client: {
    fullName: string;
    phone?: string;
    email?: string;
  };
  receiver: {
    fullName: string;
    phone?: string;
  };
}
