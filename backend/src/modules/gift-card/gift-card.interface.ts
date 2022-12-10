export interface IGiftCard {
  id: string;
  creatorUsername: string;
  // not sure which fields should be in core logic
  description: object;
  sum: number;
  spent: number;
  creationDate: Date;
  expirationDate: Date;
  active: boolean;
}

export interface IEmptyGiftCard {
  id: string;
  creatorUsername: string;
  creationDate: Date;
  expirationDate: Date;
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
  sum?: number;
  description?: object;
}

export interface IGiftCardStorage {
  create(
    username: string,
    dto: ICreateDto | Record<string, never>,
  ): Promise<IEmptyGiftCard>;
  read(query?: IQuery): Promise<IGiftCard[]>;
  update(giftCard: IUpdateDto): void;
}

//export interface IPhone {
//
//}

export interface IDescription {
  client: {
    fullName: string;
    phone?: object;
    email?: string;
  };
  receiver: {
    fullName: string;
    phone?: object;
  };
}
