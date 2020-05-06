import { schema } from 'normalizr'

export const petOwner = new schema.Entity('petOwner')
export const petOwners = new schema.Array(petOwner)