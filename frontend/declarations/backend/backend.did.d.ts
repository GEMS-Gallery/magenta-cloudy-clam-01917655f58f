import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Image { 'id' : ImageId, 'data' : Uint8Array | number[] }
export type ImageId = bigint;
export interface _SERVICE {
  'deleteImage' : ActorMethod<[ImageId], boolean>,
  'getAllImages' : ActorMethod<[], Array<[ImageId, Image]>>,
  'getImage' : ActorMethod<[ImageId], [] | [Image]>,
  'uploadImage' : ActorMethod<[Uint8Array | number[]], ImageId>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
