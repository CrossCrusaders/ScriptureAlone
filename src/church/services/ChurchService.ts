import PocketBaseClient from "../../api/PocketBaseClient"
import { Church } from "../Church"

export const getChurchesByState = async (state: string): Promise<Church[]> => {
  state = state.toUpperCase().trim().substring(0, 2)
  const results = await PocketBaseClient.records.getFullList('churches', 100, { filter: `region='${state}'` })
  return results as any
}