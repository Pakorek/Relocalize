export enum EntityTarget {
  PLACE = 'PLACE',
  PRODUCT = 'PRODUCT',
  USER = 'USER' // surely useless -> use updateUser(user.id, {avatar: url})
}

export type TargetType = {
  target: EntityTarget,
  target_id? : number
}

export type ImageInput = {
  url: string,
  filename?: string,
  description?: string,
  target: EntityTarget,
  target_id? : number
}