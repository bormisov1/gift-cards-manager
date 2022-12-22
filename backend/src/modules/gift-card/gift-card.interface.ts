export interface IGiftCard {
  id: string;
  creatorUsername: string;
  description: IDescription;
  sum: number;
  service?: number;
  spent: number;
  creationDate: Date;
  expirationDate?: Date;
  active: boolean;
  activationDate?: Date;
}

export interface IFixedGiftCard {
  id: string;
  creatorUsername: string;
  description: IDescription;
  service: string;
  isService: boolean;
  sum?: number;
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
  service?: string;
  spent?: number;
  active: boolean;
}

export interface IFixedGiftCardInfo {
  id: string;
  creatorUsername: string;
  receiverFullName: string;
  sum?: number;
  service: string;
  isService: boolean;
  spent?: number;
  active: boolean;
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
  description: IDescription;
  sum: number;
  service?: string;
}
export interface IEmptyFixedGiftCard {
  id: string;
  creatorUsername: string;
  activationDate?: Date;
  creationDate: Date;
  expirationDate?: Date;
  spent?: number;
  active: boolean;
  description: IDescription;
  sum?: number;
  service: string;
  isService: boolean;
}

export interface IQuery {
  id?: string;
  active?: boolean;
}

export interface ICreateDto {
  description: IDescription;
  sum: number;
  service?: string;
  spent?: number;
  //spent: 0;
}

export interface IFixedCreateDto {
  description: IDescription;
  service: string;
  isService: boolean;
  sum?: number;
  spent?: number;
  //spent: 0;
}

export interface IUpdateDto {
  id: string;
  spent: number;
  description?: IDescription;
}

export interface IActivateDto {
  id: string;
  spent?: number;
  sum?: number;
  service?: string;
  isService?: boolean;
  active: boolean;
}

export interface IGiftCardStorage {
  create(
    username: string,
    dto: ICreateDto | IFixedCreateDto | Record<string, never>,
  ): Promise<IEmptyGiftCard | IEmptyFixedGiftCard>;
  read(id: string): Promise<IGiftCard | IFixedGiftCard>;
  getList(query?: IQuery): Promise<(IGiftCardInfo | IFixedGiftCardInfo)[]>;
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
